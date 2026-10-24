'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  PackageCheck,
  Truck,
  Clock,
  Printer,
  ArrowLeft,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react';
import RoyLuxStore from '@/lib/store';
import { Order, OrderStatus } from '@/lib/types';

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
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-light text-white uppercase tracking-wider font-serif-luxury">
          Order Not Located
        </h2>
        <p className="text-zinc-500 text-sm">
          No matching order record was found for reference ID &ldquo;{orderId}&rdquo;.
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-2.5 bg-white text-black text-xs uppercase font-semibold tracking-wider rounded"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30';
      case 'cancelled':
        return 'text-red-400 bg-red-950/50 border-red-500/30';
      case 'shipped':
      case 'out_for_delivery':
        return 'text-blue-400 bg-blue-950/50 border-blue-500/30';
      default:
        return 'text-[#d4af37] bg-[#d4af37]/10 border-[#d4af37]/30';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner Confirmation */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-[#164e32]/30 via-white/5 to-black border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#164e32] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#164e32]/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
              Thank you for choosing RoyLux
            </span>
            <h1 className="text-2xl sm:text-3xl font-light text-white uppercase tracking-tight font-serif-luxury mt-0.5">
              Order Confirmed: {order.orderNumber}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-white/10 hover:bg-white text-zinc-200 hover:text-black rounded text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2"
          >
            <Printer className="w-3.5 h-3.5" /> Print Receipt
          </button>
          <Link
            href="/shop"
            className="px-4 py-2.5 bg-white text-black hover:bg-[#d4af37] rounded text-xs font-semibold uppercase tracking-wider transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Order Items & Status Timeline (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Status Timeline */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-5">
            <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
              Fulfillment Timeline
            </h2>

            <div className="space-y-4">
              {order.statusTimeline.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#164e32]/30 border border-[#164e32] flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Clock className="w-3 h-3 text-[#d4af37]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-white">
                        {item.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {item.note && <p className="text-xs text-zinc-400 mt-0.5">{item.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ordered Items Snapshot */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-5">
            <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
              Purchased Items ({order.items.length})
            </h2>

            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-16 bg-zinc-900 rounded overflow-hidden shrink-0 border border-white/10">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                        <span>Size: <strong className="text-zinc-200">{item.size}</strong></span>
                        {item.color && <span>• Color: <strong className="text-zinc-200">{item.color}</strong></span>}
                        <span>• Qty: {item.quantity}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-sm font-semibold text-white">
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
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 text-xs">
            <h3 className="uppercase tracking-[0.2em] font-semibold text-white">
              Shipping Information
            </h3>
            <div className="space-y-2 text-zinc-300">
              <p className="font-semibold text-white text-sm">{order.customer.fullName}</p>
              <p>Phone: {order.customer.mobile}</p>
              {order.customer.email && <p>Email: {order.customer.email}</p>}
              <p className="text-zinc-400 pt-1 leading-relaxed">
                {order.customer.fullAddress}, {order.customer.area}, {order.customer.district}, {order.customer.division}
              </p>
            </div>
          </div>

          {/* Payment & Summary */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 text-xs">
            <h3 className="uppercase tracking-[0.2em] font-semibold text-white">
              Financial Breakdown
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="text-white">৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Delivery Charge</span>
                <span className="text-white">৳{order.deliveryCharge}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-sm">
                <span className="text-white">Total Amount</span>
                <span className="text-[#d4af37] text-lg">৳{order.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-400">Payment Method:</span>
                <span className="font-semibold text-white uppercase">{order.paymentMethod.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Payment Status:</span>
                <span className="font-semibold text-[#d4af37] uppercase">{order.paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* Need help or return */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-400 space-y-2 text-center">
            <p>Need to return or exchange an item?</p>
            <Link
              href="/return"
              className="inline-flex items-center gap-1.5 text-[#d4af37] hover:underline font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Submit Return Request
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
