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
    <footer className="bg-[#080808] border-t border-white/10 text-zinc-400 text-sm">
      {/* Brand Trust Strip */}
      <div className="border-b border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#d4af37] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Premium Quality</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">340+ GSM Combed Cotton</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#d4af37] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Fast Delivery</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">Dhaka ৳60 • Outside ৳120</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#d4af37] shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Easy Returns</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">Hassle-free 7-day policy</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#d4af37] shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Secure Checkout</h4>
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
              <div className="relative w-48 h-12">
                <Image
                  src="/images/logo/roylux-logo.png"
                  alt="RoyLux"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              RoyLux is a modern high-fashion clothing brand dedicated to timeless silhouettes, heavy-gauge fleece comfort, and immaculate streetwear tailoring. Crafted for the modern connoisseur.
            </p>

            {/* Newsletter form */}
            <div className="pt-2">
              <span className="block text-xs uppercase tracking-widest text-zinc-300 font-semibold mb-2">
                Join the RoyLux Inner Circle
              </span>
              {subscribed ? (
                <p className="text-xs text-[#d4af37]">Thank you for subscribing. Welcome to RoyLux.</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 bg-white/5 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-zinc-500 rounded-l focus:outline-none focus:border-[#d4af37]"
                  />
                  <button
                    type="submit"
                    className="bg-[#164e32] hover:bg-[#1f6341] text-white px-4 rounded-r text-xs uppercase font-semibold tracking-wider transition flex items-center"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-5">Shop</h4>
            <ul className="space-y-3 text-xs">
              <li>
                <Link href="/shop" className="hover:text-white transition">All Products</Link>
              </li>
              <li>
                <Link href="/shop?filter=new" className="hover:text-white transition">New Arrivals</Link>
              </li>
              <li>
                <Link href="/shop?category=winter-hoodie" className="hover:text-white transition">Winter Hoodies</Link>
              </li>
              <li>
                <Link href="/shop?category=winter-sweatshirt" className="hover:text-white transition">Winter Sweatshirts</Link>
              </li>
              <li>
                <Link href="/shop?filter=featured" className="hover:text-white transition">Featured Pieces</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-5">Customer Care</h4>
            <ul className="space-y-3 text-xs">
              <li>
                <Link href="/contact" className="hover:text-white transition">Contact Us</Link>
              </li>
              <li>
                <Link href="/return" className="hover:text-white transition">Return Policy & Form</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">About RoyLux</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: My Account & Social */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-5">Account & Social</h4>
            <ul className="space-y-3 text-xs mb-6">
              <li>
                <Link href="/account" className="hover:text-white transition">My Profile</Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-white transition">Order History</Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition">Shopping Bag</Link>
              </li>
            </ul>

            <h5 className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold mb-2">Connect</h5>
            <div className="flex space-x-3 text-xs">
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#d4af37] transition"
                >
                  Facebook
                </a>
              )}
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#d4af37] transition"
                >
                  Instagram
                </a>
              )}
              {settings.tiktokUrl && (
                <a
                  href={settings.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#d4af37] transition"
                >
                  TikTok
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 space-y-4 sm:space-y-0">
          <p>© {currentYear} {settings.brandName}. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-[11px]">
            <span>Inside Dhaka: ৳{settings.dhakaDeliveryFee}</span>
            <span>•</span>
            <span>Outside Dhaka: ৳{settings.outsideDhakaDeliveryFee}</span>
            <span>•</span>
            <span>Gulshan 2, Dhaka</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
