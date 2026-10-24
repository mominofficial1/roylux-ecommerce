'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PlusCircle,
  Search,
  Printer,
  Trash2,
  CheckCircle2,
  Package,
  User,
  MapPin,
  CreditCard,
  FileText,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import RoyLuxStore from '@/lib/store';
import { Product, Order, OrderItemSnapshot, OrderStatus, PaymentStatus } from '@/lib/types';
import { BANGLADESH_DIVISIONS } from '@/lib/locations';

export default function DatabaseDashboardPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState(RoyLuxStore.getSettings());
  const [staffName, setStaffName] = useState('Staff');

  // Customer Details Form State
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [area, setArea] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');

  // Item Selector State
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedSize, setSelectedSize] = useState('L');
  const [selectedColor, setSelectedColor] = useState('');
  const [itemPrice, setItemPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState<OrderItemSnapshot[]>([]);

  // Delivery & Payment
  const [deliveryArea, setDeliveryArea] = useState<'dhaka' | 'outside_dhaka'>('dhaka');
  const [deliveryCharge, setDeliveryCharge] = useState<number>(settings.dhakaDeliveryFee || 60);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'pay_delivery_charge' | 'online_full'>('cod');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('unpaid');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('confirmed');

  // Order submission feedback
  const [submitting, setSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Search in database list
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const prods = RoyLuxStore.getProducts();
    setProducts(prods);
    if (prods.length > 0) {
      setSelectedProductId(prods[0].id);
      setItemPrice(prods[0].price);
      if (prods[0].colors && prods[0].colors.length > 0) {
        setSelectedColor(prods[0].colors[0].name);
      }
    }
    setOrders(RoyLuxStore.getOrders());
    const currentSettings = RoyLuxStore.getSettings();
    setSettings(currentSettings);
    setDeliveryCharge(currentSettings.dhakaDeliveryFee || 60);

    if (typeof window !== 'undefined') {
      const name = sessionStorage.getItem('roylux_staff_name') || 'Authorized Staff';
      setStaffName(name);
    }
  }, []);

  // Update district when division changes
  const handleDivisionChange = (newDivision: string) => {
    setDivision(newDivision);
    const divObj = BANGLADESH_DIVISIONS.find((d) => d.name === newDivision);
    if (divObj && divObj.districts.length > 0) {
      const firstDist = divObj.districts[0];
      setDistrict(firstDist);
      const isDhakaDist = newDivision === 'Dhaka' && firstDist === 'Dhaka';
      const areaType = isDhakaDist ? 'dhaka' : 'outside_dhaka';
      setDeliveryArea(areaType);
      setDeliveryCharge(
        areaType === 'dhaka' ? settings.dhakaDeliveryFee : settings.outsideDhakaDeliveryFee
      );
    }
  };

  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    const isDhakaDist = division === 'Dhaka' && newDist === 'Dhaka';
    const areaType = isDhakaDist ? 'dhaka' : 'outside_dhaka';
    setDeliveryArea(areaType);
    setDeliveryCharge(
      areaType === 'dhaka' ? settings.dhakaDeliveryFee : settings.outsideDhakaDeliveryFee
    );
  };

  // When product changes in selector
  const handleProductSelect = (pId: string) => {
    setSelectedProductId(pId);
    const prod = products.find((p) => p.id === pId);
    if (prod) {
      setItemPrice(prod.price);
      if (prod.colors && prod.colors.length > 0) {
        setSelectedColor(prod.colors[0].name);
      } else {
        setSelectedColor('');
      }
    }
  };

  // Add line item to manual order
  const handleAddItem = () => {
    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;

    const newItem: OrderItemSnapshot = {
      productId: prod.id,
      name: prod.name,
      image: prod.images && prod.images[0] ? prod.images[0] : '/images/logo/roylux-logo.png',
      price: itemPrice,
      size: selectedSize,
      color: selectedColor || undefined,
      quantity: quantity,
      subtotal: itemPrice * quantity,
    };

    setOrderItems([...orderItems, newItem]);
    setQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  // Totals
  const itemsSubtotal = orderItems.reduce((acc, item) => acc + item.subtotal, 0);
  const grandTotal = Math.max(0, itemsSubtotal + deliveryCharge - (Number(discountAmount) || 0));

  // Submit Manual Order
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      alert('Please add at least one product item to the order.');
      return;
    }
    if (!fullName.trim() || !mobile.trim() || !fullAddress.trim()) {
      alert('Please fill in customer name, mobile number, and delivery address.');
      return;
    }

    setSubmitting(true);

    try {
      const newOrder = RoyLuxStore.createOrder({
        customer: {
          fullName: fullName.trim(),
          mobile: mobile.trim(),
          email: email.trim() || undefined,
          division,
          district,
          area: area.trim() || district,
          fullAddress: fullAddress.trim(),
          postalCode: postalCode.trim() || undefined,
          notes: notes.trim() || undefined,
        },
        items: orderItems,
        subtotal: itemsSubtotal,
        deliveryCharge,
        discountAmount: Number(discountAmount) || 0,
        total: grandTotal,
        deliveryArea,
        paymentMethod,
        paymentStatus,
        orderStatus,
        source: 'manual_employee',
        employeeName: staffName,
      });

      setCreatedOrder(newOrder);
      setOrders(RoyLuxStore.getOrders());
    } catch (err) {
      console.error('Error creating manual order:', err);
      alert('Failed to record manual order.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFullName('');
    setMobile('');
    setEmail('');
    setArea('');
    setFullAddress('');
    setPostalCode('');
    setNotes('');
    setOrderItems([]);
    setDiscountAmount(0);
    setCreatedOrder(null);
  };

  // Filtered orders for Search tab
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      searchQuery === '' ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.mobile.includes(searchQuery) ||
      o.customer.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const currentDivisionObj = BANGLADESH_DIVISIONS.find((d) => d.name === division);

  return (
    <div className="space-y-6">
      {/* Title & Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif tracking-wider text-white">
            Employee Order Terminal
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manual order creation, phone orders, wholesale entries, and official RoyLux invoice generator.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded text-xs font-medium transition flex items-center gap-2 ${
              activeTab === 'create'
                ? 'bg-[#164e32] text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Order Entry</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('list');
              setOrders(RoyLuxStore.getOrders());
            }}
            className={`px-4 py-2 rounded text-xs font-medium transition flex items-center gap-2 ${
              activeTab === 'list'
                ? 'bg-[#164e32] text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Database ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* Success Modal / Banner after order creation */}
      {createdOrder && (
        <div className="p-6 rounded-xl bg-[#164e32]/20 border border-[#164e32] text-white space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#4ade80]" />
              <div>
                <h3 className="text-base font-semibold text-white">
                  Order Successfully Recorded: {createdOrder.orderNumber}
                </h3>
                <p className="text-xs text-zinc-300 mt-0.5">
                  Customer: {createdOrder.customer.fullName} ({createdOrder.customer.mobile}) • Total: ৳{createdOrder.total.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/database/invoice/${createdOrder.id}`}
                target="_blank"
                className="px-4 py-2 bg-[#d4af37] hover:bg-[#b8952b] text-black font-semibold rounded text-xs flex items-center gap-2 shadow-lg transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Invoice</span>
              </Link>
              <button
                onClick={handleResetForm}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-xs transition"
              >
                New Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: MANUAL ORDER CREATION FORM */}
      {activeTab === 'create' && (
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: Customer Details + Line Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Details Card */}
            <div className="p-5 sm:p-6 rounded-xl bg-[#121212] border border-white/10 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/5 text-sm font-medium text-white">
                <User className="w-4 h-4 text-[#d4af37]" />
                <span>Customer Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="e.g. 01712345678"
                    className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tanvir@example.com"
                    className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Postal Code (Optional)</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 1205"
                    className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Division *</label>
                  <select
                    value={division}
                    onChange={(e) => handleDivisionChange(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    {BANGLADESH_DIVISIONS.map((div) => (
                      <option key={div.name} value={div.name} className="bg-zinc-900">
                        {div.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">District *</label>
                  <select
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    {currentDivisionObj?.districts.map((dist) => (
                      <option key={dist} value={dist} className="bg-zinc-900">
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-zinc-400 mb-1 font-medium">Specific Area / Thana</label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Dhanmondi / Gulshan / Mirpur"
                  className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="text-xs">
                <label className="block text-zinc-400 mb-1 font-medium">Full Street Address *</label>
                <textarea
                  required
                  rows={2}
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="House #, Road #, Sector/Block, Landmark details..."
                  className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="text-xs">
                <label className="block text-zinc-400 mb-1 font-medium">Internal Staff Order Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Customer requested urgent evening dispatch; confirmed on WhatsApp"
                  className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            {/* Line Items Builder Card */}
            <div className="p-5 sm:p-6 rounded-xl bg-[#121212] border border-white/10 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/5 text-sm font-medium text-white">
                <Package className="w-4 h-4 text-[#d4af37]" />
                <span>Product Selection & Items</span>
              </div>

              {/* Selector Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs bg-white/5 p-4 rounded-lg border border-white/5">
                <div className="sm:col-span-5">
                  <label className="block text-zinc-400 mb-1">Select Product</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => handleProductSelect(e.target.value)}
                    className="w-full bg-black/80 border border-white/10 rounded px-2.5 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id} className="bg-zinc-900">
                        {p.name} (৳{p.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-400 mb-1">Size</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full bg-black/80 border border-white/10 rounded px-2.5 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                      <option key={s} value={s} className="bg-zinc-900">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-400 mb-1">Price (৳)</label>
                  <input
                    type="number"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(Number(e.target.value))}
                    className="w-full bg-black/80 border border-white/10 rounded px-2.5 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-zinc-400 mb-1">Qty</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-black/80 border border-white/10 rounded px-2 py-2 text-center text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="sm:col-span-2 flex items-end">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="w-full py-2 bg-[#164e32] hover:bg-[#1f6341] text-white rounded text-xs font-medium transition flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>
              </div>

              {/* Items List Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400">
                      <th className="py-2.5 px-3">Item</th>
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Unit Price</th>
                      <th className="py-2.5 px-3">Qty</th>
                      <th className="py-2.5 px-3">Subtotal</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orderItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-zinc-500 italic">
                          No items added yet. Select a product above and click &quot;Add Item&quot;.
                        </td>
                      </tr>
                    ) : (
                      orderItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02]">
                          <td className="py-3 px-3 flex items-center gap-3">
                            <div className="relative w-9 h-12 bg-zinc-900 rounded overflow-hidden flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-white">{item.name}</div>
                              {item.color && (
                                <div className="text-[11px] text-zinc-400">Color: {item.color}</div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-zinc-300 font-mono">{item.size}</td>
                          <td className="py-3 px-3 text-zinc-300">৳{item.price.toLocaleString()}</td>
                          <td className="py-3 px-3 text-zinc-300">{item.quantity}</td>
                          <td className="py-3 px-3 font-semibold text-white">
                            ৳{item.subtotal.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded transition"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing, Delivery & Submit */}
          <div className="space-y-6">
            <div className="p-5 sm:p-6 rounded-xl bg-[#121212] border border-white/10 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-white/5 text-sm font-medium text-white">
                <CreditCard className="w-4 h-4 text-[#d4af37]" />
                <span>Order Summary & Billing</span>
              </div>

              {/* Delivery Zone */}
              <div className="space-y-2 text-xs">
                <label className="block text-zinc-400 font-medium">Delivery Zone</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryArea('dhaka');
                      setDeliveryCharge(settings.dhakaDeliveryFee || 60);
                    }}
                    className={`py-2 px-3 rounded text-center border transition ${
                      deliveryArea === 'dhaka'
                        ? 'border-[#164e32] bg-[#164e32]/20 text-white font-medium'
                        : 'border-white/10 text-zinc-400 hover:bg-white/5'
                    }`}
                  >
                    Inside Dhaka (৳{settings.dhakaDeliveryFee})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryArea('outside_dhaka');
                      setDeliveryCharge(settings.outsideDhakaDeliveryFee || 120);
                    }}
                    className={`py-2 px-3 rounded text-center border transition ${
                      deliveryArea === 'outside_dhaka'
                        ? 'border-[#164e32] bg-[#164e32]/20 text-white font-medium'
                        : 'border-white/10 text-zinc-400 hover:bg-white/5'
                    }`}
                  >
                    Outside Dhaka (৳{settings.outsideDhakaDeliveryFee})
                  </button>
                </div>
              </div>

              {/* Delivery Charge Override */}
              <div className="text-xs">
                <label className="block text-zinc-400 mb-1">Delivery Charge (৳)</label>
                <input
                  type="number"
                  value={deliveryCharge}
                  onChange={(e) => setDeliveryCharge(Number(e.target.value) || 0)}
                  className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Discount */}
              <div className="text-xs">
                <label className="block text-zinc-400 mb-1">Discount Amount (৳)</label>
                <input
                  type="number"
                  min="0"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                  className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Payment Method */}
              <div className="text-xs space-y-1.5">
                <label className="block text-zinc-400 font-medium">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="cod" className="bg-zinc-900">
                    Cash on Delivery (COD)
                  </option>
                  <option value="pay_delivery_charge" className="bg-zinc-900">
                    Pre-paid Delivery Charge (COD Balance)
                  </option>
                  <option value="online_full" className="bg-zinc-900">
                    Paid Full (bKash / Nagad / Bank)
                  </option>
                </select>
              </div>

              {/* Payment Status */}
              <div className="text-xs space-y-1.5">
                <label className="block text-zinc-400 font-medium">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="unpaid" className="bg-zinc-900">
                    Unpaid
                  </option>
                  <option value="pending" className="bg-zinc-900">
                    Pending Verification
                  </option>
                  <option value="paid" className="bg-zinc-900">
                    Paid in Full
                  </option>
                </select>
              </div>

              {/* Initial Order Status */}
              <div className="text-xs space-y-1.5">
                <label className="block text-zinc-400 font-medium">Initial Order Status</label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
                  className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="confirmed" className="bg-zinc-900">
                    Confirmed (Ready to Pack)
                  </option>
                  <option value="pending" className="bg-zinc-900">
                    Pending Call Confirmation
                  </option>
                  <option value="processing" className="bg-zinc-900">
                    Processing
                  </option>
                  <option value="packed" className="bg-zinc-900">
                    Packed
                  </option>
                </select>
              </div>

              {/* Price Calculation breakdown */}
              <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Items Subtotal:</span>
                  <span>৳{itemsSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Delivery Charge:</span>
                  <span>৳{deliveryCharge.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#4ade80]">
                    <span>Discount:</span>
                    <span>- ৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold text-white pt-2 border-t border-white/10">
                  <span>Grand Total:</span>
                  <span className="text-[#d4af37]">৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || orderItems.length === 0}
                className="w-full py-3.5 bg-[#164e32] hover:bg-[#1f6341] text-white rounded text-xs uppercase font-semibold tracking-widest transition flex items-center justify-center gap-2 shadow-xl shadow-[#164e32]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Create &amp; Print Invoice</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: SEARCH DATABASE LIST */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="p-4 rounded-xl bg-[#121212] border border-white/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search by Order #, Customer, Mobile, District..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto text-xs">
              <span className="text-zinc-400 text-[11px] uppercase tracking-wider">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-black/60 border border-white/10 rounded px-3 py-1.5 text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-xl bg-[#121212] border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-zinc-400">
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Customer Details</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total (BDT)</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-zinc-500 italic">
                        No orders matching the specified filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-white/[0.02] transition">
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-medium text-white">{ord.orderNumber}</div>
                          <div className="text-[11px] text-zinc-500">
                            {new Date(ord.createdAt).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                          {ord.source === 'manual_employee' && (
                            <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] bg-[#164e32]/40 text-[#4ade80] border border-[#164e32]">
                              Manual Entry
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-white">{ord.customer.fullName}</div>
                          <div className="text-[11px] text-zinc-400 font-mono">{ord.customer.mobile}</div>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-300">
                          <div>{ord.customer.district}</div>
                          <div className="text-[10px] text-zinc-500">{ord.customer.division}</div>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-300">
                          {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-white">
                          ৳{ord.total.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-medium ${
                              ord.paymentStatus === 'paid'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-medium bg-white/5 border border-white/10 text-zinc-300">
                            {ord.orderStatus.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/database/invoice/${ord.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 hover:bg-[#d4af37] hover:text-black text-zinc-300 transition text-[11px] font-medium"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Invoice</span>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
