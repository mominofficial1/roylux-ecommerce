'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Lock } from 'lucide-react';
import RoyLuxStore from '@/lib/store';
import { SiteSettings } from '@/lib/types';

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>(RoyLuxStore.getSettings());
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    setSettings(RoyLuxStore.getSettings());
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
    }
  };

  return (
    <footer className="bg-[#f5f3ee] border-t border-[#e8e6e1] text-zinc-600 text-sm">
      {/* Brand Trust Strip */}
      <div className="border-b border-[#e8e6e1] py-10 bg-[#fbfaf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-[#b8952b] shrink-0 border border-zinc-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-black text-xs font-semibold uppercase tracking-wider">Premium Quality</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">340+ GSM Combed Cotton</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-[#b8952b] shrink-0 border border-zinc-200">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-black text-xs font-semibold uppercase tracking-wider">Fast Delivery</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">Dhaka ৳60 • Outside ৳120</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-[#b8952b] shrink-0 border border-zinc-200">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-black text-xs font-semibold uppercase tracking-wider">Easy Returns</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">Hassle-free 7-day policy</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-[#b8952b] shrink-0 border border-zinc-200">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-black text-xs font-semibold uppercase tracking-wider">Secure Checkout</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">Cash on Delivery & Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block relative">
              <div className="relative w-44 h-11">
                <Image
                  src="/images/logo/roylux-logo.png"
                  alt="RoyLux"
                  width={160}
                  height={42}
                  className="h-8 sm:h-10 w-auto object-contain filter invert"
                />
              </div>
            </Link>
            <p className="text-xs text-zinc-600 leading-relaxed max-w-sm">
              RoyLux is a modern high-fashion clothing brand dedicated to timeless silhouettes, heavy-gauge fleece comfort, and immaculate streetwear tailoring. Crafted for the modern connoisseur.
            </p>

            {/* Newsletter form */}
            <div className="pt-2">
              <span className="block text-xs uppercase tracking-widest text-black font-semibold mb-2">
                Join the RoyLux Inner Circle
              </span>
              {subscribed ? (
                <p className="text-xs text-[#164e32] font-medium">Thank you for subscribing. Welcome to RoyLux.</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 bg-white border border-zinc-300 px-4 py-2.5 text-xs text-black placeholder-zinc-400 rounded-l focus:outline-none focus:border-black"
                  />
                  <button
                    type="submit"
                    className="bg-black hover:bg-zinc-800 text-white px-4 rounded-r text-xs uppercase font-semibold tracking-wider transition flex items-center"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-black mb-5">Shop</h4>
            <ul className="space-y-3 text-xs">
              <li>
                <Link href="/shop" className="hover:text-black transition">All Collections</Link>
              </li>
              <li>
                <Link href="/shop?filter=new" className="hover:text-black transition">New Arrivals</Link>
              </li>
              <li>
                <Link href="/shop?category=winter-hoodie" className="hover:text-black transition">Winter Hoodies</Link>
              </li>
              <li>
                <Link href="/shop?category=winter-sweatshirt" className="hover:text-black transition">Winter Sweatshirts</Link>
              </li>
              <li>
                <Link href="/shop?filter=featured" className="hover:text-black transition">Featured Pieces</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Care */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-black mb-5">Client Care</h4>
            <ul className="space-y-3 text-xs">
              <li>
                <Link href="/account" className="hover:text-black transition">Order Tracking</Link>
              </li>
              <li>
                <Link href="/return" className="hover:text-black transition">Returns & Exchanges</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-black transition">Concierge Support</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-black transition">Delivery Information</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Brand */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-black mb-5">RoyLux</h4>
            <ul className="space-y-3 text-xs">
              <li>
                <Link href="/about" className="hover:text-black transition">Our Heritage</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-black transition">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-black transition">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-[#e8e6e1] flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {currentYear} RoyLux. All rights reserved. Designed for Luxury & Comfort.</p>
          <div className="flex items-center space-x-6 text-[11px]">
            <span>Dhaka, Bangladesh</span>
            <span>•</span>
            <span>Cash on Delivery Nationwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
