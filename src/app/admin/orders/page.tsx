'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, ShoppingBag, Eye, Printer } from 'lucide-react';
import RoyLuxStore from '@/lib/store';
import { Order, OrderStatus } from '@/lib/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadData = () => {
    setOrders(RoyLuxStore.getOrders());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    RoyLuxStore.updateOrderStatus(orderId, newStatus);
    loadData();
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchName = o.customer.fullName.toLowerCase().includes(q);
      const matchPhone = o.customer.mobile.includes(q);
      const matchDistrict = o.customer.district.toLowerCase().includes(q);
      return matchNum || matchName || matchPhone || matchDistrict;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
            Order Fulfillment
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-white uppercase tracking-tight font-serif-luxury mt-1">
            All Customer Orders ({orders.length})
          </h1>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-black/60 border border-white/10 rounded px-3 py-2">
          <Search className="w-4 h-4 text-zinc-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order #, Customer Name, Phone, District..."
            className="w-full bg-transparent text-white placeholder-zinc-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-500 uppercase tracking-wider">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black/60 border border-white/15 text-white rounded px-3 py-2 focus:outline-none focus:border-[#d4af37]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 text-xs">
            No orders match the selected search query or status filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="uppercase tracking-widest text-[10px] text-zinc-500 border-b border-white/5 pb-2">
                <tr>
                  <th className="py-3 px-2">Order #</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Phone</th>
                  <th className="py-3 px-2">Destination</th>
                  <th className="py-3 px-2">Amount</th>
                  <th className="py-3 px-2">Payment</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition">
                    <td className="py-3 px-2 font-mono font-bold text-white">{order.orderNumber}</td>
                    <td className="py-3 px-2 text-zinc-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 font-medium text-white">{order.customer.fullName}</td>
                    <td className="py-3 px-2 text-zinc-400">{order.customer.mobile}</td>
                    <td className="py-3 px-2 text-zinc-400">
                      {order.customer.district}, {order.customer.division}
                    </td>
                    <td className="py-3 px-2 font-semibold text-[#d4af37]">
                      ৳{order.total.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 uppercase text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-white/10 font-medium">
                        {order.paymentMethod.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className="bg-black/60 border border-white/15 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Link
                        href={`/account/orders/${order.id}`}
                        target="_blank"
                        className="text-[#d4af37] hover:underline font-semibold"
                      >
                        Invoice / Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
