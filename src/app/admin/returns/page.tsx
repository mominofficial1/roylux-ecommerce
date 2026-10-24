'use client';

import React, { useState, useEffect } from 'react';
import { RotateCcw, Check, X, Clock, AlertCircle } from 'lucide-react';
import RoyLuxStore from '@/lib/store';
import { ReturnRequest } from '@/lib/types';

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [filter, setFilter] = useState('all');

  const loadData = () => {
    setReturns(RoyLuxStore.getReturns());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = (id: string, status: ReturnRequest['status']) => {
    RoyLuxStore.updateReturnStatus(id, status);
    loadData();
  };

  const filtered = returns.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
            Customer Guarantee
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-white uppercase tracking-tight font-serif-luxury mt-1">
            Return & Exchange Requests ({returns.length})
          </h1>
        </div>
      </div>

      {/* Filter tab */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {['all', 'return_requested', 'reviewing', 'approved', 'rejected', 'completed'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3.5 py-1.5 rounded-full font-semibold uppercase tracking-wider transition shrink-0 ${
              filter === st
                ? 'bg-white text-black'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {st.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 text-xs">
            No return requests match this filter. Customer submissions appear here in real time.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="uppercase tracking-widest text-[10px] text-zinc-500 border-b border-white/5 pb-2">
                <tr>
                  <th className="py-3 px-2">Order #</th>
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Mobile</th>
                  <th className="py-3 px-2">Product</th>
                  <th className="py-3 px-2">Reason</th>
                  <th className="py-3 px-2">Resolution</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-white/5 transition">
                    <td className="py-3 px-2 font-mono font-bold text-white">{r.orderNumber}</td>
                    <td className="py-3 px-2 font-medium text-white">{r.customerName}</td>
                    <td className="py-3 px-2 text-zinc-400">{r.mobile}</td>
                    <td className="py-3 px-2 text-white">{r.productName}</td>
                    <td className="py-3 px-2 text-zinc-400">{r.reason.replace(/_/g, ' ')}</td>
                    <td className="py-3 px-2 text-[#d4af37] uppercase text-[10px] font-semibold">
                      {r.preferredResolution.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3 px-2">
                      <select
                        value={r.status}
                        onChange={(e) => handleUpdateStatus(r.id, e.target.value as any)}
                        className="bg-black/60 border border-white/15 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                      >
                        <option value="return_requested">Requested</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="product_received">Product Received</option>
                        <option value="refunded">Refunded</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="py-3 px-2 text-right text-[11px] text-zinc-400">
                      {new Date(r.createdAt).toLocaleDateString()}
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
