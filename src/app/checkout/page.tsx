'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, Lock, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';
import RoyLuxStore from '@/lib/store';
import { CartItem, OrderItemSnapshot } from '@/lib/types';
import { BANGLADESH_DIVISIONS, getDistrictsForDivision } from '@/lib/locations';

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [area, setArea] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [deliveryArea, setDeliveryArea] = useState<'dhaka' | 'outside_dhaka'>('dhaka');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'pay_delivery_charge'>('cod');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const cart = RoyLuxStore.getCart();
    if (cart.length === 0) {
      router.push('/cart');
    } else {
      setItems(cart);
    }
  }, [router]);

  // When division changes, auto-select first district in that division
  const availableDistricts = getDistrictsForDivision(division);
  const handleDivisionChange = (newDiv: string) => {
    setDivision(newDiv);
    const districts = getDistrictsForDivision(newDiv);
    if (districts.length > 0) {
      setDistrict(districts[0]);
    }
    // Auto set delivery area based on Dhaka
    if (newDiv.toLowerCase() === 'dhaka') {
      setDeliveryArea('dhaka');
    } else {
      setDeliveryArea('outside_dhaka');
    }
  };

  const settings = RoyLuxStore.getSettings();
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryCharge =
    deliveryArea === 'dhaka' ? settings.dhakaDeliveryFee : settings.outsideDhakaDeliveryFee;
  const isFreeDelivery = settings.freeDeliveryThreshold && subtotal >= settings.freeDeliveryThreshold;
  const finalDelivery = isFreeDelivery ? 0 : deliveryCharge;
  const grandTotal = subtotal + finalDelivery;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !mobile.trim() || !fullAddress.trim() || !area.trim()) {
      setErrorMsg('Please fill in all required customer and delivery address fields.');
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
        colors: ['#d4af37', '#164e32', '#ffffff'],
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition"
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
            <div className="p-4 rounded bg-red-900/30 border border-red-500/40 text-red-200 text-xs">
              {errorMsg}
            </div>
          )}

          {/* 1. Customer Information */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h2 className="text-sm uppercase tracking-[0.2em] font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#164e32] text-white text-[10px] flex items-center justify-center font-bold">
                1
              </span>
              Customer Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full bg-black/50 border border-white/10 rounded px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                  Mobile Number (Bangladesh) *
                </label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-black/50 border border-white/10 rounded px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                  Email Address (Optional, for digital receipt)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  className="w-full bg-black/50 border border-white/10 rounded px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          </div>

          {/* 2. Bangladesh Delivery Address */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h2 className="text-sm uppercase tracking-[0.2em] font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#164e32] text-white text-[10px] flex items-center justify-center font-bold">
                2
              </span>
              Delivery Address (Bangladesh)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                  Division *
                </label>
                <select
                  value={division}
                  onChange={(e) => handleDivisionChange(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                >
                  {BANGLADESH_DIVISIONS.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                  District *
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                >
                  {availableDistricts.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                  Thana / Area / Upazila *
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Dhanmondi, Road 27 / Uttara Sector 7"
                  className="w-full bg-black/50 border border-white/10 rounded px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                  Full Street Address (House, Flat, Road) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="House #, Flat #, Road # or landmark"
                  className="w-full bg-black/50 border border-white/10 rounded px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                  Delivery Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special instructions for the courier"
                  className="w-full bg-black/50 border border-white/10 rounded px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method Selection */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h2 className="text-sm uppercase tracking-[0.2em] font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#164e32] text-white text-[10px] flex items-center justify-center font-bold">
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
                    ? 'border-[#164e32] bg-[#164e32]/15 text-white'
                    : 'border-white/10 bg-black/30 text-zinc-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs uppercase tracking-wider text-white">
                    Cash On Delivery (COD)
                  </span>
                  {paymentMethod === 'cod' && (
                    <CheckCircle2 className="w-4 h-4 text-[#164e32]" />
                  )}
                </div>
                <p className="text-[11px] text-zinc-400">
                  Pay full amount (৳{grandTotal.toLocaleString()}) when product arrives at your doorstep.
                </p>
              </div>

              {/* Option 2: Pay Delivery Charge */}
              <div
                onClick={() => setPaymentMethod('pay_delivery_charge')}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  paymentMethod === 'pay_delivery_charge'
                    ? 'border-[#d4af37] bg-[#d4af37]/15 text-white'
                    : 'border-white/10 bg-black/30 text-zinc-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs uppercase tracking-wider text-white">
                    Pay Delivery Charge (৳{finalDelivery})
                  </span>
                  {paymentMethod === 'pay_delivery_charge' && (
                    <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                  )}
                </div>
                <p className="text-[11px] text-zinc-400">
                  Prepay delivery fee online (bKash/Nagad/Card); pay garment price upon delivery.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Items Summary & Confirmation (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6 sticky top-28">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
              Order Review ({items.length} items)
            </h3>

            {/* Items scroll */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-2 border-b border-white/5">
                  <div className="relative w-12 h-14 bg-zinc-900 rounded overflow-hidden shrink-0 border border-white/10">
                    <Image src={item.image} alt={item.productName} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-white truncate">{item.productName}</h4>
                    <span className="text-[11px] text-zinc-400">
                      Size: {item.selectedSize} • Qty: {item.quantity}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-zinc-200">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Price lines */}
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="text-white">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Delivery Charge ({deliveryArea === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                <span className="text-white">৳{finalDelivery}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between text-sm font-bold">
                <span className="text-white uppercase tracking-wider">Total Payable</span>
                <span className="text-xl text-[#d4af37]">৳{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#164e32] hover:bg-[#1f6341] text-white rounded text-xs uppercase font-semibold tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#164e32]/30"
            >
              {loading ? (
                <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                'Confirm Order'
              )}
            </button>

            <div className="text-[11px] text-zinc-500 text-center space-y-1">
              <p>By confirming, an order confirmation SMS/receipt will be generated.</p>
              <p>Customer account will automatically be linked with your phone number.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
