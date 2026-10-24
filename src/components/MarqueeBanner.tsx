'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Tag, ShieldCheck, Truck } from 'lucide-react';

export default function MarqueeBanner() {
  const items = [
    { text: 'WINTER DROP 2026 NOW LIVE', icon: Sparkles, highlight: false },
    { text: 'GET 20% OFF ALL HOODIES & SWEATSHIRTS — USE CODE: ROYLUX20', icon: Tag, highlight: true },
    { text: '340+ GSM HEAVYWEIGHT COMBED COTTON FLEECE', icon: ShieldCheck, highlight: false },
    { text: 'CASH ON DELIVERY ACROSS ALL 64 DISTRICTS IN BANGLADESH', icon: Truck, highlight: false },
    { text: '7-DAY HASSLE-FREE DOORSTEP EXCHANGES', icon: ShieldCheck, highlight: false },
    { text: 'LIMITED WINTER CAPSULE • LUXURY ARCHITECTURAL FIT', icon: Sparkles, highlight: false },
  ];

  return (
    <div className="w-full bg-[#121212] text-white py-2 overflow-hidden border-b border-white/10 text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase select-none">
      <div className="animate-marquee flex items-center space-x-8 whitespace-nowrap">
        {/* Repeated twice for seamless infinite loop */}
        {[...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center space-x-3 shrink-0">
              <Icon className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className={item.highlight ? 'text-[#d4af37] font-semibold' : 'text-stone-300'}>
                {item.text}
              </span>
              <span className="text-stone-600 pl-4">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
