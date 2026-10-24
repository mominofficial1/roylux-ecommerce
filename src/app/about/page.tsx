import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
          The RoyLux Heritage
        </span>
        <h1 className="text-3xl sm:text-5xl font-light text-white uppercase tracking-tight font-serif-luxury leading-tight">
          Modern Luxury Streetwear Reimagined
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
          Born from a passion for heavyweight textiles, tailored silhouettes, and enduring craftsmanship.
        </p>
      </div>

      {/* Hero Image */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <Image
          src="/images/hero/hero-1.jpg"
          alt="RoyLux Atelier"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-xs uppercase tracking-widest text-zinc-300 font-medium">
            RoyLux Winter Drop 2026 • Dhaka, Bangladesh
          </p>
        </div>
      </div>

      {/* Story Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#164e32]/30 flex items-center justify-center text-[#d4af37]">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Uncompromising Weight
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-light">
            We reject flimsy fast fashion. Every RoyLux hoodie is constructed with 340+ GSM combed cotton fleece, ensuring structure and warmth that endures season after season.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#164e32]/30 flex items-center justify-center text-[#d4af37]">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Architectural Fit
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-light">
            Our patterns feature subtle drop-shoulder shaping, structured crossover hoods, and precision ribbing that compliments both casual streetwear and elevated winter layering.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#164e32]/30 flex items-center justify-center text-[#d4af37]">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Nationwide Concierge
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-light">
            We provide fast, reliable door-to-door fulfillment across Bangladesh with transparent delivery rates and a dedicated customer service concierge.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-8 border-t border-white/10">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black hover:bg-[#d4af37] text-xs uppercase font-semibold tracking-[0.2em] rounded transition shadow-xl"
        >
          Explore the Collection <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
