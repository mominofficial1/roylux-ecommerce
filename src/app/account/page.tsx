'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Package, RotateCcw, MapPin, ArrowRight, ShoppingBag } from 'lucide-react';
import RoyLuxStore from '@/lib/store';
import { Order } from '@/lib/types';

export default function AccountPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(RoyLuxStore.getOrders());
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-[#fbfaf8] text-black">
      {/* Account Header */}
      <div className="border-b border-black/10 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-black shadow-sm">
            <User className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#b8952b] font-semibold">
              RoyLux Concierge
            </span>
            <h1 className="text-2xl sm:text-3xl font-light text-black uppercase tracking-tight font-serif-luxury mt-0.5">
              My Account
            </h1>
          </div>
        </div>
        <Link
          href="/shop"
          className="px-4 py-2 bg-black text-white hover:bg-zinc-800 rounded text-xs font-semibold uppercase tracking-wider transition shadow-sm"
        >
          Browse Collections
        </Link>
      </div>

      {/* Account Dashboard Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/account/orders"
          className="p-6 rounded-2xl bg-white border border-[#e8e6e1] hover:border-black transition group shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-black mb-4">
            <Package className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-black group-hover:text-[#b8952b] transition">
            Orders ({orders.length})
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Track fulfillment status, view receipts, and delivery updates.</p>
        </Link>

        <Link
          href="/return"
          className="p-6 rounded-2xl bg-white border border-[#e8e6e1] hover:border-black transition group shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-black mb-4">
            <RotateCcw className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-black group-hover:text-[#b8952b] transition">
            Returns &amp; Exchanges
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Initiate 7-day size exchanges, replacement requests, or refunds.</p>
        </Link>

        <Link
          href="/shop"
          className="p-6 rounded-2xl bg-white border border-[#e8e6e1] hover:border-black transition group shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-black mb-4">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-black group-hover:text-[#b8952b] transition">
            Winter Drops 2026
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Explore pure cream, charcoal, and forest green fleece collections.</p>
        </Link>
      </div>
    </div>
  );
}
