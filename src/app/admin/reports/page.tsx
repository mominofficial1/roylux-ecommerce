'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { BarChart3, Download, Printer, DollarSign, ShoppingBag, Truck, RotateCcw } from 'lucide-react';
import RoyLuxStore from '@/lib/store';
import { Order } from '@/lib/types';

export default function AdminReportsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [dateRange, setDateRange] = useState<'current_month' | 'previous_month' | 'all'>('current_month');

  useEffect(() => {
    setOrders(RoyLuxStore.getOrders());
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalDeliveryCharges = orders.reduce((sum, o) => sum + o.deliveryCharge, 0);
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'delivered');
  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
  const unpaidOrders = orders.filter((o) => o.paymentStatus === 'unpaid');
  const returnedOrders = orders.filter((o) => o.orderStatus === 'returned' || o.orderStatus === 'refunded');

  const exportCSV = () => {
    const headers = ['OrderNumber', 'Customer', 'Phone', 'District', 'Amount', 'DeliveryCharge', 'Status', 'Date'];
    const rows = orders.map((o) => [
      o.orderNumber,
      `"${o.customer.fullName}"`,
      o.customer.mobile,
      o.customer.district,
      o.total,
      o.deliveryCharge,
      o.orderStatus,
      new Date(o.createdAt).toLocaleDateString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `roylux_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
            Financial & Sales Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-white uppercase tracking-tight font-serif-luxury mt-1">
            Executive Performance Report
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-white/10 hover:bg-white text-zinc-200 hover:text-black rounded text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#164e32] hover:bg-[#1e6341] text-white rounded text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1.5 shadow-lg shadow-[#164e32]/20"
          >
            <Printer className="w-3.5 h-3.5" /> Print Branded PDF
          </button>
        </div>
      </div>

      {/* Printable Report Paper Style Container */}
      <div className="p-8 sm:p-12 rounded-2xl bg-white/5 border border-white/10 space-y-8 text-xs text-zinc-300">
        {/* Report Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="relative w-40 h-10">
            <Image src="/images/logo/roylux-logo.png" alt="RoyLux" fill className="object-contain object-left" />
          </div>
          <div className="text-right text-[11px] text-zinc-400">
            <p className="font-semibold text-white">RoyLux Fashion Ltd.</p>
            <p>Gulshan 2, Dhaka, Bangladesh</p>
            <p>Generated: {new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        {/* Financial Metrics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">Gross Sales</span>
            <div className="text-lg font-bold text-white">৳{totalRevenue.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">Total Orders</span>
            <div className="text-lg font-bold text-white">{orders.length}</div>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">Delivery Logistics</span>
            <div className="text-lg font-bold text-white">৳{totalDeliveryCharges.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">Delivered Volume</span>
            <div className="text-lg font-bold text-[#164e32]">{deliveredOrders.length}</div>
          </div>
        </div>

        {/* Breakdown Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
            <span className="text-zinc-400 font-medium">Paid Orders:</span>
            <div className="font-semibold text-white">{paidOrders.length}</div>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
            <span className="text-zinc-400 font-medium">Pending Payment (COD):</span>
            <div className="font-semibold text-white">{unpaidOrders.length}</div>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
            <span className="text-zinc-400 font-medium">Returned Orders:</span>
            <div className="font-semibold text-white">{returnedOrders.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
