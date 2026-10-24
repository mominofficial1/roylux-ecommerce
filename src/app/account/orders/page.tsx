'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Package, Calendar, Clock } from 'lucide-react';
import RoyLuxStore from '@/lib/store';
import { Order } from '@/lib/types';

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(RoyLuxStore.getOrders());
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Account
          </Link>
          <h1 className="text-2xl sm:text-3xl font-light text-white uppercase tracking-tight font-serif-luxury">
            My Order History
          </h1>
        </div>
        <span className="text-xs text-zinc-500 font-medium">Total Orders: {orders.length}</span>
      </div>

      {orders.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-white/10 rounded-2xl space-y-4">
          <Package className="w-10 h-10 text-zinc-600 mx-auto" />
          <h2 className="text-base font-semibold text-white">No Orders Found</h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            You currently have no active or completed orders on record.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-white text-black text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#d4af37] transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-2">
                <div>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">Order Reference</span>
                  <div className="text-base font-bold text-white mt-0.5">{order.orderNumber}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-[#164e32]/20 border border-[#164e32]/50 text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                    {order.orderStatus.replace(/_/g, ' ')}
                  </span>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white text-zinc-200 hover:text-black text-xs font-semibold uppercase tracking-wider transition"
                  >
                    <span>Details</span> <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Items summary */}
              <div className="text-xs text-zinc-400 space-y-1">
                <p>
                  <strong>Items:</strong> {order.items.map((i) => `${i.quantity}x ${i.name} (${i.size})`).join(', ')}
                </p>
                <p>
                  <strong>Total:</strong> <span className="text-white font-semibold">৳{order.total.toLocaleString()}</span> ({order.paymentMethod.toUpperCase()})
                </p>
                <p className="text-zinc-500 text-[11px] flex items-center gap-1 pt-1">
                  <Clock className="w-3 h-3" /> Placed on {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
