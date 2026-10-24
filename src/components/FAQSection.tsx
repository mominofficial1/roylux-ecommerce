'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, ShieldCheck } from 'lucide-react';
import RoyLuxStore from '@/lib/store';
import { FAQItem } from '@/lib/types';

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const loadFaqs = () => {
    const list = RoyLuxStore.getFAQs().filter((f) => f.isActive);
    setFaqs(list.sort((a, b) => a.order - b.order));
  };

  useEffect(() => {
    loadFaqs();

    const handleUpdate = () => loadFaqs();
    window.addEventListener('roylux-faqs-updated', handleUpdate);
    return () => window.removeEventListener('roylux-faqs-updated', handleUpdate);
  }, []);

  const categories = ['All', ...Array.from(new Set(faqs.map((f) => f.category).filter(Boolean)))];

  const filteredFaqs =
    selectedCategory === 'All'
      ? faqs
      : faqs.filter((f) => f.category === selectedCategory);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-black/5 bg-[#faf9f6] text-black scroll-mt-24">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/10 text-[10px] uppercase tracking-[0.25em] font-semibold text-zinc-700">
            <HelpCircle className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Client Care &amp; Guidance</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-light uppercase tracking-tight font-serif-luxury text-black">
            Frequently Asked Questions
          </h2>

          <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto font-light leading-relaxed">
            Everything you need to know about our 340+ GSM heavyweight fleece, doorstep sizing exchanges, and nationwide delivery across all 64 districts in Bangladesh.
          </p>
        </div>

        {/* Category Pills */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-black text-white shadow-md'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:border-black/40 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl transition-all duration-300 border ${
                  isOpen
                    ? 'bg-white border-black/20 shadow-md ring-1 ring-black/5'
                    : 'bg-white/80 hover:bg-white border-zinc-200/80 shadow-sm'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-6 h-6 rounded-full bg-black/5 text-zinc-700 text-xs font-mono font-medium flex items-center justify-center shrink-0">
                      {faq.order || '•'}
                    </span>
                    <span className="text-sm sm:text-base font-medium text-black">
                      {faq.question}
                    </span>
                  </div>

                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'bg-black text-white rotate-180' : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-zinc-600 font-light leading-relaxed border-t border-zinc-100 animate-fade-in pl-14">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Help Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-black to-[#1a1a1a] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-[#d4af37] text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>RoyLux Concierge Support</span>
            </div>
            <h3 className="text-base sm:text-lg font-light uppercase tracking-wide">
              Still have questions about fit or fabric?
            </h3>
            <p className="text-xs text-zinc-400">
              Our styling specialists are available 24/7 on WhatsApp &amp; Phone.
            </p>
          </div>

          <a
            href="https://wa.me/8801700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#d4af37] hover:bg-[#b8952b] text-black font-semibold text-xs uppercase tracking-widest transition-all shadow-lg shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat On WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
