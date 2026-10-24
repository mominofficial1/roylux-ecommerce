'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import RoyLuxStore from '@/lib/store';
import { CartItem, SiteSettings, OrderItemSnapshot } from '@/lib/types';
import { BANGLADESH_DIVISIONS } from '@/lib/locations';

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(RoyLuxStore.getSettings());

  // Form states
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [area, setArea] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Payment states
  const [deliveryArea, setDeliveryArea] = useState<'dhaka' | 'outside_dhaka'>('dhaka');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'pay_delivery_charge'>('cod');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const cart = RoyLuxStore.getCart();
    if (cart.length === 0) {
      router.push('/cart');
    }
    setItems(cart);
    setSettings(RoyLuxStore.getSettings());
  }, [router]);

  // When division changes, auto-update districts & delivery zone
  const handleDivisionChange = (newDivision: string) => {
    setDivision(newDivision);
    const divObj = BANGLADESH_DIVISIONS.find((d) => d.name === newDivision);
    if (divObj && divObj.districts.length > 0) {
      const firstDistrict = divObj.districts[0];
      setDistrict(firstDistrict);
      const isDhakaCity = newDivision === 'Dhaka' && firstDistrict === 'Dhaka';
      setDeliveryArea(isDhakaCity ? 'dhaka' : 'outside_dhaka');
    }
  };

  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    const isDhakaCity = division === 'Dhaka' && newDistrict === 'Dhaka';
    setDeliveryArea(isDhakaCity ? 'dhaka' : 'outside_dhaka');
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryCharge =
    deliveryArea === 'dhaka' ? settings.dhakaDeliveryFee : settings.outsideDhakaDeliveryFee;
  const isFreeDelivery = subtotal >= (settings.freeDeliveryThreshold || 5000);
  const finalDelivery = isFreeDelivery ? 0 : deliveryCharge;
  const grandTotal = subtotal + finalDelivery;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !mobile.trim() || !fullAddress.trim()) {
      setErrorMsg('Please complete all mandatory delivery fields (Name, Phone, Address).');
      return;
    }

    setLoading(true);

    try {
      const itemSnapshots: OrderItemSnapshot[] = items.map((i) => ({
        productId: i.productId,
        name: i.productName,
        image: i.image,
        price: i.price,
        size: i.selectedSize,
        color: i.selectedColor,
        quantity: i.quantity,
        subtotal: i.price * i.quantity,
      }));

      const newOrder = RoyLuxStore.createOrder({
        customer: {
          fullName,
          mobile,
          email: email || undefined,
          division,
          district,
          area,
          fullAddress,
          notes: notes || undefined,
        },
        items: itemSnapshots,
        subtotal,
        deliveryCharge: finalDelivery,
        total: grandTotal,
        deliveryArea,
        paymentMethod,
        paymentStatus: paymentMethod === 'pay_delivery_charge' ? 'paid' : 'unpaid',
        orderStatus: 'confirmed',
        source: 'online',
      });

      // Clear Cart
      RoyLuxStore.clearCart();

      // Launch Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#b8952b', '#164e32', '#121212'],
      });

      // Redirect to Order Confirmation
      setTimeout(() => {
        router.push(`/account/orders/${newOrder.id}`);
      }, 700);
    } catch {
      setErrorMsg('An error occurred while creating your order. Please try again.');
      setLoading(false);
    }
  };

  const currentDivisionObj = BANGLADESH_DIVISIONS.find((d) => d.name === division);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#fbfaf8] text-black">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-zinc-600 hover:text-black transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Bag
        </Link>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Lock className="w-3.5 h-3.5 text-[#164e32]" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Customer & Delivery Details (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {errorMsg && (
            <div className="p-4 rounded bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMsg}
            </div>
          )}

          {/* 1. Customer Information */}
          <div className="p-6 rounded-2xl bg-white border border-[#e8e6e1] shadow-sm space-y-4">
            <h2 className="text-sm uppercase tracking-[0.2em] font-semibold text-black flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold">
                1
              </span>
              Customer Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-600 mb-1.5 font-medium">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full bg-[#fbfaf8] border border-zinc-200 rounded px-3.5 py-2.5 text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-600 mb-1.5 font-medium">
                  Mobile Number (Bangladesh) *
                </label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-[#fbfaf8] border border-zinc-200 rounded px-3.5 py-2.5 text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-zinc-600 mb-1.5 font-medium">
                  Email Address (Optional, for digital receipt)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  className="w-full bg-[#fbfaf8] border border-zinc-200 rounded px-3.5 py-2.5 text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* 2. Bangladesh Delivery Address */}
          <div className="p-6 rounded-2xl bg-white border border-[#e8e6e1] shadow-sm space-y-4">
            <h2 className="text-sm uppercase tracking-[0.2em] font-semibold text-black flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold">
                2
              </span>
              Delivery Address (Bangladesh)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-600 mb-1.5 font-medium">
                  Division *
                </label>
                <select
                  value={division}
                  onChange={(e) => handleDivisionChange(e.target.value)}
                  className="w-full bg-[#fbfaf8] border border-zinc-200 rounded px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black"
                >
                  {BANGLADESH_DIVISIONS.map((div) => (
                    <option key={div.name} value={div.name}>
                      {div.name} Division
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-600 mb-1.5 font-medium">
                  District *
                </label>
                <select
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full bg-[#fbfaf8] border border-zinc-200 rounded px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black"
                >
                  {currentDivisionObj?.districts.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-zinc-600 mb-1.5 font-medium">
                  Thana / Area / Landmark
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Dhanmondi, Road #27 or Sector 4, Uttara"
                  className="w-full bg-[#fbfaf8] border border-zinc-200 rounded px-3.5 py-2.5 text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-zinc-600 mb-1.5 font-medium">
                  Full Street Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="House #, Apartment/Floor, Road #, Area..."
                  className="w-full bg-[#fbfaf8] border border-zinc-200 rounded px-3.5 py-2.5 text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-zinc-600 mb-1.5 font-medium">
                  Delivery Notes / Special Instructions
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Call before delivery, leave with security..."
                  className="w-full bg-[#fbfaf8] border border-zinc-200 rounded px-3.5 py-2.5 text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="p-6 rounded-2xl bg-white border border-[#e8e6e1] shadow-sm space-y-4">
            <h2 className="text-sm uppercase tracking-[0.2em] font-semibold text-black flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold">
                3
              </span>
              Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  paymentMethod === 'cod'
                    ? 'border-black bg-zinc-50 text-black shadow-sm'
                    : 'border-zinc-200 text-zinc-600 hover:border-black'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs uppercase tracking-wider text-black">
                    Cash On Delivery (COD)
                  </span>
                  {paymentMethod === 'cod' && (
                    <CheckCircle2 className="w-4 h-4 text-black" />
                  )}
                </div>
                <p className="text-[11px] text-zinc-500">
                  Pay full amount (৳{grandTotal.toLocaleString()}) when product arrives at your doorstep.
                </p>
              </div>

              {/* Option 2: Pay Delivery Charge */}
              <div
                onClick={() => setPaymentMethod('pay_delivery_charge')}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  paymentMethod === 'pay_delivery_charge'
                    ? 'border-black bg-zinc-50 text-black shadow-sm'
                    : 'border-zinc-200 text-zinc-600 hover:border-black'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs uppercase tracking-wider text-black">
                    Prepay Delivery Fee (৳{finalDelivery})
                  </span>
                  {paymentMethod === 'pay_delivery_charge' && (
                    <CheckCircle2 className="w-4 h-4 text-black" />
                  )}
                </div>
                <p className="text-[11px] text-zinc-500">
                  Prepay delivery fee online (bKash/Nagad/Card); pay garment balance upon delivery.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Items Summary & Confirmation (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#e8e6e1] shadow-sm space-y-6 sticky top-28">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-black">
              Order Review ({items.length} items)
            </h3>

            {/* Items scroll */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-2 border-b border-zinc-100">
                  {/* Strict 1:1 image thumbnail */}
                  <div className="relative w-12 aspect-square bg-[#f4f2ee] rounded overflow-hidden shrink-0 border border-zinc-200">
                    <Image src={item.image} alt={item.productName} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-black truncate">{item.productName}</h4>
                    <span className="text-[11px] text-zinc-500">
                      Size: {item.selectedSize} • Qty: {item.quantity}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-black">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Price lines */}
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="text-black font-medium">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Delivery Charge ({deliveryArea === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                <span className="text-black font-medium">৳{finalDelivery}</span>
              </div>
              <div className="border-t border-zinc-200 pt-3 flex justify-between text-sm font-bold">
                <span className="text-black uppercase tracking-wider">Total Payable</span>
                <span className="text-xl text-black">৳{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black hover:bg-zinc-800 text-white rounded text-xs uppercase font-semibold tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                'Confirm Order'
              )}
            </button>

            <div className="text-[11px] text-zinc-500 text-center space-y-1">
              <p>By confirming, an official order receipt and invoice will be generated.</p>
              <p>Customer account will automatically link with your phone number.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
