'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Package,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Clock,
  ArrowRight,
  Plus,
} from 'lucide-react';
import RoyLuxStore from '@/lib/store';
import { Order, Product, ReturnRequest, OrderStatus } from '@/lib/types';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);

  const loadData = () => {
    setOrders(RoyLuxStore.getOrders());
    setProducts(RoyLuxStore.getProducts());
    setReturns(RoyLuxStore.getReturns());
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'confirmed');
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'delivered');
  const lowStockProducts = products.filter((p) => p.stock <= 15);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    RoyLuxStore.updateOrderStatus(orderId, newStatus);
    loadData();
  };

  return (
    <div className="space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
            Executive Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-white uppercase tracking-tight font-serif-luxury mt-1">
            RoyLux Operations Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products?action=new"
            className="px-4 py-2 bg-[#164e32] hover:bg-[#1e6341] text-white rounded text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1.5 shadow-lg shadow-[#164e32]/20"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Piece
          </Link>
          <Link
            href="/admin/reports"
            className="px-4 py-2 bg-white/10 hover:bg-white text-zinc-200 hover:text-black rounded text-xs font-semibold uppercase tracking-wider transition"
          >
            Financial Reports
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="uppercase tracking-wider">Total Sales</span>
            <div className="w-8 h-8 rounded-full bg-[#164e32]/20 flex items-center justify-center text-[#d4af37]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">৳{totalRevenue.toLocaleString()}</div>
          <p className="text-[11px] text-zinc-500">Gross revenue across all channels</p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-full bg-[#164e32]/20 flex items-center justify-center text-[#d4af37]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{orders.length}</div>
          <p className="text-[11px] text-zinc-500">
            {pendingOrders.length} pending / processing
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="uppercase tracking-wider">Fulfillment Rate</span>
            <div className="w-8 h-8 rounded-full bg-[#164e32]/20 flex items-center justify-center text-[#d4af37]">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{deliveredOrders.length} Delivered</div>
          <p className="text-[11px] text-zinc-500">Completed nationwide deliveries</p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="uppercase tracking-wider">Return Requests</span>
            <div className="w-8 h-8 rounded-full bg-[#164e32]/20 flex items-center justify-center text-[#d4af37]">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{returns.length}</div>
          <p className="text-[11px] text-zinc-500">
            {returns.filter((r) => r.status === 'return_requested').length} awaiting review
          </p>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-200">
                Low Inventory Warning
              </h4>
              <p className="text-xs text-amber-300/70">
                {lowStockProducts.map((p) => `${p.name} (${p.stock} units left)`).join(', ')}
              </p>
            </div>
          </div>
          <Link
            href="/admin/products"
            className="text-xs text-amber-300 font-semibold uppercase hover:underline shrink-0"
          >
            Manage Stock
          </Link>
        </div>
      )}

      {/* Recent Orders Table */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
            Recent Orders
          </h2>
          <Link href="/admin/orders" className="text-xs text-[#d4af37] hover:underline font-medium">
            View All Orders
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-xs">
            No customer orders placed yet. Live orders will populate automatically.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="uppercase tracking-widest text-[10px] text-zinc-500 border-b border-white/5 pb-2">
                <tr>
                  <th className="py-3 px-2">Order #</th>
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Phone</th>
                  <th className="py-3 px-2">Location</th>
                  <th className="py-3 px-2">Total</th>
                  <th className="py-3 px-2">Payment</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.slice(0, 8).map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition">
                    <td className="py-3 px-2 font-mono font-bold text-white">{order.orderNumber}</td>
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
                        View Receipt
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
