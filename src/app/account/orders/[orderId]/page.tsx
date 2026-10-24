'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Clock,
  Printer,
  RotateCcw,
} from 'lucide-react';
import RoyLuxStore from '@/lib/store';
import { Order } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      const o = RoyLuxStore.getOrderById(orderId);
      if (o) setOrder(o);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4 bg-[#fbfaf8] text-black">
        <h2 className="text-2xl font-light text-black uppercase tracking-wider font-serif-luxury">
          Order Not Located
        </h2>
        <p className="text-zinc-600 text-sm">
          No matching order record was found for reference ID &ldquo;{orderId}&rdquo;.
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-2.5 bg-black text-white text-xs uppercase font-semibold tracking-wider rounded"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#fbfaf8] text-black">
      {/* Success Confirmation Header */}
      <div className="p-8 rounded-2xl bg-white border border-[#e8e6e1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#164e32] flex items-center justify-center text-white shrink-0 shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#b8952b] font-semibold">
              Thank you for choosing RoyLux
            </span>
            <h1 className="text-2xl sm:text-3xl font-light text-black uppercase tracking-tight font-serif-luxury mt-0.5">
              Order Confirmed: {order.orderNumber}
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-zinc-100 hover:bg-black hover:text-white text-black border border-zinc-200 rounded text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2"
          >
            <Printer className="w-3.5 h-3.5" /> Print Receipt
          </button>
          <Link
            href="/shop"
            className="px-4 py-2.5 bg-black text-white hover:bg-zinc-800 rounded text-xs font-semibold uppercase tracking-wider transition shadow-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Order Items & Status Timeline (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Status Timeline */}
          <div className="p-6 rounded-2xl bg-white border border-[#e8e6e1] space-y-5 shadow-sm">
            <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-black">
              Fulfillment Timeline
            </h2>

            <div className="space-y-4">
              {order.statusTimeline.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-zinc-100 border border-zinc-300 flex items-center justify-center text-black shrink-0 mt-0.5">
                    <Clock className="w-3 h-3 text-[#b8952b]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-black">
                        {item.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {item.note && <p className="text-xs text-zinc-600 mt-0.5">{item.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ordered Items Snapshot */}
          <div className="p-6 rounded-2xl bg-white border border-[#e8e6e1] space-y-5 shadow-sm">
            <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-black">
              Purchased Items ({order.items.length})
            </h2>

            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-zinc-100">
                  <div className="flex items-center gap-4">
                    {/* Strict 1:1 image aspect ratio */}
                    <div className="relative w-14 aspect-square bg-[#f4f2ee] rounded overflow-hidden shrink-0 border border-zinc-200">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-black">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                        <span>Size: <strong className="text-black">{item.size}</strong></span>
                        {item.color && <span>• Color: <strong className="text-black">{item.color}</strong></span>}
                        <span>• Qty: {item.quantity}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-sm font-semibold text-black">
                    ৳{item.subtotal.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Payment Details (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer & Shipping Destination */}
          <div className="p-6 rounded-2xl bg-white border border-[#e8e6e1] space-y-4 text-xs shadow-sm">
            <h3 className="uppercase tracking-[0.2em] font-semibold text-black">
              Shipping Information
            </h3>
            <div className="space-y-2 text-zinc-700">
              <p className="font-semibold text-black text-sm">{order.customer.fullName}</p>
              <p>Phone: {order.customer.mobile}</p>
              {order.customer.email && <p>Email: {order.customer.email}</p>}
              <p className="text-zinc-600 pt-1 leading-relaxed">
                {order.customer.fullAddress}, {order.customer.area}, {order.customer.district}, {order.customer.division}
              </p>
            </div>
          </div>

          {/* Payment & Charges Breakdown */}
          <div className="p-6 rounded-2xl bg-white border border-[#e8e6e1] space-y-4 text-xs shadow-sm">
            <h3 className="uppercase tracking-[0.2em] font-semibold text-black">
              Payment Summary
            </h3>
            <div className="space-y-2.5">
              <div className="flex justify-between text-zinc-600">
                <span>Payment Method</span>
                <span className="font-medium text-black uppercase">
                  {order.paymentMethod.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Payment Status</span>
                <span className="font-semibold text-[#164e32] uppercase">
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Delivery Zone</span>
                <span className="text-black uppercase">
                  {order.deliveryArea === 'dhaka' ? 'Inside Dhaka (৳60)' : 'Outside Dhaka (৳120)'}
                </span>
              </div>
              <div className="border-t border-zinc-200 pt-3 flex justify-between text-base font-bold text-black">
                <span>Total Amount</span>
                <span>৳{order.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100">
              <Link
                href="/return"
                className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-black text-xs font-semibold uppercase tracking-wider rounded transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Return / Exchange
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
