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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Account Header */}
      <div className="border-b border-white/10 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#d4af37]">
            <User className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
              RoyLux Concierge
            </span>
            <h1 className="text-2xl sm:text-3xl font-light text-white uppercase tracking-tight font-serif-luxury mt-0.5">
              My Account
            </h1>
          </div>
        </div>
        <Link
          href="/shop"
          className="px-4 py-2 bg-white text-black hover:bg-[#d4af37] rounded text-xs font-semibold uppercase tracking-wider transition"
        >
          Browse Drops
        </Link>
      </div>

      {/* Account Dashboard Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/account/orders"
          className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d4af37]/40 transition group"
        >
          <div className="w-10 h-10 rounded-full bg-[#164e32]/20 flex items-center justify-center text-[#d4af37] mb-4">
            <Package className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-white group-hover:text-[#d4af37] transition">
            Orders ({orders.length})
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Track status, view receipts, and delivery updates.</p>
        </Link>

        <Link
          href="/return"
          className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d4af37]/40 transition group"
        >
          <div className="w-10 h-10 rounded-full bg-[#164e32]/20 flex items-center justify-center text-[#d4af37] mb-4">
            <RotateCcw className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-white group-hover:text-[#d4af37] transition">
            Returns & Exchanges
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Submit or check the status of product return requests.</p>
        </Link>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="w-10 h-10 rounded-full bg-[#164e32]/20 flex items-center justify-center text-[#d4af37] mb-4">
            <MapPin className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-white">Default Delivery Zone</h2>
          <p className="text-xs text-zinc-400 mt-1">Standard Nationwide Delivery (Dhaka ৳60 / Outside ৳120).</p>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
            Recent Orders
          </h2>
          {orders.length > 0 && (
            <Link href="/account/orders" className="text-xs text-[#d4af37] hover:underline">
              View All Orders
            </Link>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl space-y-3">
            <p className="text-zinc-400 text-sm">You haven&apos;t placed any orders yet.</p>
            <Link
              href="/shop"
              className="inline-block text-xs uppercase tracking-widest text-[#d4af37] hover:underline font-semibold"
            >
              Start Shopping Now
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/25 transition gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{order.orderNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] uppercase font-bold text-[#d4af37]">
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    {order.items.length} item(s) • Total: ৳{order.total.toLocaleString()} • {order.paymentMethod.toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
