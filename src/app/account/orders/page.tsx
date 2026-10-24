'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Package } from 'lucide-react';
import RoyLuxStore from '@/lib/store';
import { Order } from '@/lib/types';

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(RoyLuxStore.getOrders());
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#fbfaf8] text-black">
      <div className="flex items-center justify-between border-b border-black/10 pb-6">
        <div>
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-zinc-600 hover:text-black transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Account
          </Link>
          <h1 className="text-2xl sm:text-3xl font-light text-black uppercase tracking-tight font-serif-luxury">
            My Order History
          </h1>
        </div>
        <span className="text-xs text-zinc-500 font-medium">Total Orders: {orders.length}</span>
      </div>

      {orders.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-zinc-200 rounded-2xl space-y-4 bg-white">
          <Package className="w-10 h-10 text-zinc-400 mx-auto" />
          <h2 className="text-base font-semibold text-black">No Orders Found</h2>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            You currently have no active or completed orders on record.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-zinc-800 transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-6 rounded-2xl bg-white border border-[#e8e6e1] shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 gap-2">
                <div>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">Order Reference</span>
                  <div className="text-base font-bold text-black mt-0.5">{order.orderNumber}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded text-xs uppercase font-medium bg-zinc-100 border border-zinc-200 text-black">
                    {order.orderStatus.replace(/_/g, ' ')}
                  </span>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="inline-flex items-center gap-1 text-xs text-black font-semibold hover:underline"
                  >
                    Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-zinc-500">Date</span>
                  <div className="text-black font-medium mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500">Destination</span>
                  <div className="text-black font-medium mt-0.5">{order.customer.district}</div>
                </div>
                <div>
                  <span className="text-zinc-500">Items Count</span>
                  <div className="text-black font-medium mt-0.5">{order.items.length} pieces</div>
                </div>
                <div>
                  <span className="text-zinc-500">Total Payable</span>
                  <div className="text-black font-bold mt-0.5">৳{order.total.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
