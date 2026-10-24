'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/store';

export default function CollectionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#8a7226] font-semibold flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Curated Capsules
        </span>
        <h1 className="text-3xl sm:text-5xl font-light text-[#121212] uppercase tracking-tight font-serif-luxury">
          RoyLux Collections
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm font-light">
          Explore our seasonal drops crafted from heavy 340+ GSM cotton fleece, architectural tailoring, and timeless minimalist detailing.
        </p>
      </div>

      {/* Collections Grid - Strict 1:1 Aspect Ratio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {INITIAL_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="group block relative overflow-hidden rounded-xl border border-stone-200 bg-white hover:border-[#121212] transition-all duration-300 shadow-sm"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
              <Image
                src={cat.imageUrl || '/images/hero/hero-1.jpg'}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold block mb-1">
                  {cat.productCount} Pieces
                </span>
                <h3 className="text-base font-semibold uppercase tracking-wider leading-snug">
                  {cat.name}
                </h3>
              </div>
            </div>

            <div className="p-4 bg-white flex items-center justify-between text-xs font-semibold text-[#121212] uppercase tracking-wider group-hover:bg-[#121212] group-hover:text-white transition-colors duration-300">
              <span>View Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Featured Drop Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-[#f5f3ee] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        <div className="space-y-3 max-w-xl text-center md:text-left">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#8a7226] font-semibold">
            Limited Release
          </span>
          <h2 className="text-2xl sm:text-4xl font-light text-[#121212] uppercase font-serif-luxury">
            Winter Drop 2026 Lookbook
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            Engineered specifically for the Bangladeshi climate with plush dual-tone fleece hoods, custom tipped ribs, and signature embroidery.
          </p>
        </div>

        <Link
          href="/shop"
          className="px-8 py-3.5 bg-[#121212] hover:bg-stone-800 text-white rounded text-xs uppercase font-semibold tracking-[0.2em] transition whitespace-nowrap shadow-md"
        >
          Shop All Pieces
        </Link>
      </div>
    </div>
  );
}
