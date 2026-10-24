'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RotateCcw, CheckCircle2, ShieldCheck, ArrowLeft, Truck } from 'lucide-react';
import RoyLuxStore from '@/lib/store';

export default function ReturnPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [productName, setProductName] = useState('');
  const [reason, setReason] = useState('size_mismatch');
  const [description, setDescription] = useState('');
  const [preferredResolution, setPreferredResolution] = useState<'refund' | 'replacement' | 'store_credit'>('replacement');
  const [submitted, setSubmitted] = useState(false);
  const [returnId, setReturnId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !customerName.trim() || !mobile.trim()) return;

    const newReturn = RoyLuxStore.createReturnRequest({
      orderNumber,
      customerName,
      mobile,
      productName,
      reason,
      description,
      preferredResolution,
      status: 'return_requested',
    });

    setReturnId(newReturn.id);
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#8a7226] font-semibold">
          Customer Care & Guarantee
        </span>
        <h1 className="text-3xl sm:text-4xl font-light text-[#121212] uppercase tracking-tight font-serif-luxury">
          RoyLux Return & Exchange
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm font-light">
          We want you to feel complete confidence in every piece. We offer a simple 7-day return and exchange policy across Bangladesh.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 sm:p-12 rounded-2xl bg-white border border-stone-200 shadow-sm text-center space-y-5 animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#121212] flex items-center justify-center text-white shadow-xl shadow-black/10">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-light text-[#121212] uppercase font-serif-luxury">
              Return Request Received
            </h2>
            <p className="text-xs text-stone-500">
              Reference ID: <strong className="text-[#121212] font-mono">{returnId}</strong>
            </p>
          </div>
          <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
            Our quality concierge team will review your order details and reach out to you at <strong className="text-[#121212]">{mobile}</strong> within 24 hours to coordinate doorstep pickup.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-2.5 bg-[#121212] text-white hover:bg-stone-800 rounded text-xs uppercase font-semibold tracking-wider transition"
            >
              Return to Home
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Form (7 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-5">
            <h2 className="text-sm uppercase tracking-[0.2em] font-semibold text-[#121212]">
              Submit Return Form
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-stone-600 mb-1 font-medium">
                  Order Number *
                </label>
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. RL-2026-123456"
                  className="w-full bg-[#faf9f6] border border-stone-300 rounded px-3.5 py-2.5 text-[#121212] placeholder-stone-400 focus:outline-none focus:border-[#121212]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-stone-600 mb-1 font-medium">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-[#faf9f6] border border-stone-300 rounded px-3.5 py-2.5 text-[#121212] placeholder-stone-400 focus:outline-none focus:border-[#121212]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-stone-600 mb-1 font-medium">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-[#faf9f6] border border-stone-300 rounded px-3.5 py-2.5 text-[#121212] placeholder-stone-400 focus:outline-none focus:border-[#121212]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-stone-600 mb-1 font-medium">
                  Product to Return/Exchange *
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. RoyLux Signature Charcoal Hoodie (Size L)"
                  className="w-full bg-[#faf9f6] border border-stone-300 rounded px-3.5 py-2.5 text-[#121212] placeholder-stone-400 focus:outline-none focus:border-[#121212]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-stone-600 mb-1 font-medium">
                    Reason *
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-[#faf9f6] border border-stone-300 rounded px-3 py-2.5 text-[#121212] focus:outline-none focus:border-[#121212]"
                  >
                    <option value="size_mismatch">Size Too Large / Small</option>
                    <option value="fabric_defect">Fabric Defect or Damaged</option>
                    <option value="wrong_item">Received Incorrect Item</option>
                    <option value="changed_mind">Changed Mind</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-stone-600 mb-1 font-medium">
                    Preferred Resolution *
                  </label>
                  <select
                    value={preferredResolution}
                    onChange={(e) => setPreferredResolution(e.target.value as any)}
                    className="w-full bg-[#faf9f6] border border-stone-300 rounded px-3 py-2.5 text-[#121212] focus:outline-none focus:border-[#121212]"
                  >
                    <option value="replacement">Exchange for Different Size</option>
                    <option value="refund">Full Monetary Refund</option>
                    <option value="store_credit">RoyLux Store Credit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-stone-600 mb-1 font-medium">
                  Additional Details
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us what you'd like us to know..."
                  className="w-full bg-[#faf9f6] border border-stone-300 rounded px-3.5 py-2.5 text-[#121212] placeholder-stone-400 focus:outline-none focus:border-[#121212]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#121212] hover:bg-black text-white rounded text-xs uppercase font-semibold tracking-[0.2em] transition shadow-md"
              >
                Submit Request
              </button>
            </div>
          </form>

          {/* Policy Information (5 cols) */}
          <div className="lg:col-span-5 space-y-6 text-xs text-stone-600">
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
              <h3 className="uppercase tracking-[0.2em] font-semibold text-[#121212]">
                Policy Highlights
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5">
                  <RotateCcw className="w-4 h-4 text-[#8a7226] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#121212]">7-Day Window:</strong> Items must be submitted within 7 calendar days from the delivery date.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#8a7226] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#121212]">Pristine Condition:</strong> Garments must be unwashed, unworn, and with original brand tags attached.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Truck className="w-4 h-4 text-[#8a7226] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#121212]">Doorstep Pickup:</strong> For exchanges within Dhaka, our courier handles swap right at your doorstep.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
