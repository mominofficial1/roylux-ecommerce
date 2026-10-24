'use client';

import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Search,
  Check,
  X,
} from 'lucide-react';
import RoyLuxStore from '@/lib/store';
import { FAQItem } from '@/lib/types';

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);

  // Form State
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('Product & Quality');
  const [order, setOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);

  const loadData = () => {
    const list = RoyLuxStore.getFAQs();
    setFaqs([...list].sort((a, b) => a.order - b.order));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('roylux-faqs-updated', loadData);
    return () => window.removeEventListener('roylux-faqs-updated', loadData);
  }, []);

  const openAddModal = () => {
    setEditingFaq(null);
    setQuestion('');
    setAnswer('');
    setCategory('Product & Quality');
    setOrder(faqs.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (faq: FAQItem) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category || 'Product & Quality');
    setOrder(faq.order || 1);
    setIsActive(faq.isActive);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    const payload: FAQItem = {
      id: editingFaq ? editingFaq.id : `faq-${Date.now()}`,
      question: question.trim(),
      answer: answer.trim(),
      category: category.trim(),
      order: Number(order) || 1,
      isActive,
      createdAt: editingFaq?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    RoyLuxStore.saveFAQ(payload);
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      RoyLuxStore.deleteFAQ(id);
      loadData();
    }
  };

  const handleToggleStatus = (faq: FAQItem) => {
    RoyLuxStore.saveFAQ({
      ...faq,
      isActive: !faq.isActive,
    });
    loadData();
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all FAQs to RoyLux brand defaults? This will restore standard product, delivery & exchange policies.')) {
      RoyLuxStore.resetFAQs();
      loadData();
    }
  };

  const categories = ['All', ...Array.from(new Set(faqs.map((f) => f.category).filter(Boolean)))];

  const filteredFaqs = faqs.filter((f) => {
    const matchesSearch =
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'All' || f.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
            Customer Experience &amp; Content CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-white uppercase tracking-tight mt-1">
            FAQ Management
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage questions, sizing guidance, fabric specifications, and delivery answers displayed on the public store.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-xs uppercase tracking-wider transition border border-white/10"
            title="Restore default RoyLux FAQs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#d4af37] hover:bg-[#b8952b] text-black font-semibold text-xs uppercase tracking-wider transition shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add New FAQ</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search FAQs by question or answer keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#181818] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                filterCategory === cat
                  ? 'bg-white text-black font-semibold shadow'
                  : 'bg-[#181818] text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Table / List */}
      <div className="bg-[#181818] border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-black/50 text-zinc-400 uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Question</th>
                <th className="py-3 px-4 w-40">Category</th>
                <th className="py-3 px-4 w-28 text-center">Status</th>
                <th className="py-3 px-4 w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredFaqs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500">
                    <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No FAQs found matching your query.
                  </td>
                </tr>
              ) : (
                filteredFaqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-4 text-center font-mono text-zinc-500">
                      {faq.order}
                    </td>

                    <td className="py-4 px-4 space-y-1">
                      <p className="font-medium text-white text-sm">{faq.question}</p>
                      <p className="text-zinc-400 line-clamp-2 text-xs font-light leading-relaxed">
                        {faq.answer}
                      </p>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-[#d4af37]">
                        {faq.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(faq)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition ${
                          faq.isActive
                            ? 'bg-[#164e32]/30 text-green-400 border border-green-500/30'
                            : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {faq.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-green-400" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-zinc-500" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(faq)}
                          className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition"
                          title="Edit FAQ"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          className="p-1.5 rounded hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition"
                          title="Delete FAQ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit FAQ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-lg font-light text-white uppercase tracking-tight">
                {editingFaq ? 'Edit FAQ Item' : 'Create New FAQ'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What is RoyLux's fabric GSM and thickness?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Product & Quality">Product &amp; Quality</option>
                    <option value="Shipping & Delivery">Shipping &amp; Delivery</option>
                    <option value="Payment & Orders">Payment &amp; Orders</option>
                    <option value="Exchanges & Returns">Exchanges &amp; Returns</option>
                    <option value="Sizing & Care">Sizing &amp; Care</option>
                    <option value="General Brand">General Brand</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                  Detailed Answer *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Provide a clear, reassuring answer that helps customer conversion..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37] leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#d4af37] rounded"
                />
                <label htmlFor="isActiveToggle" className="text-zinc-300 uppercase tracking-wider text-[11px] cursor-pointer">
                  Display live on store website (Active)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-zinc-300 uppercase tracking-wider transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded bg-[#d4af37] hover:bg-[#b8952b] text-black font-semibold uppercase tracking-wider transition shadow-lg"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingFaq ? 'Save Changes' : 'Create FAQ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
