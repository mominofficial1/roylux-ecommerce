'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import CartDrawer from './CartDrawer';
import SearchModal from './SearchModal';
import RoyLuxStore from '@/lib/store';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const updateCount = () => {
    const items = RoyLuxStore.getCart();
    setCartCount(items.reduce((acc, item) => acc + item.quantity, 0));
  };

  useEffect(() => {
    updateCount();
    const handleUpdate = () => updateCount();
    window.addEventListener('roylux-cart-updated', handleUpdate);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('roylux-cart-updated', handleUpdate);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Collections', href: '/shop' },
    { name: 'Hoodies', href: '/shop?category=winter-hoodie' },
    { name: 'Sweatshirts', href: '/shop?category=winter-sweatshirt' },
    { name: 'New Arrivals', href: '/shop?filter=new' },
    { name: 'About', href: '/about' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-header py-3.5 shadow-xl'
            : 'bg-gradient-to-b from-black/90 via-black/60 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: RoyLux Logo */}
            <div className="flex-1 flex items-center">
              <Link href="/" className="inline-block relative group">
                <div className="flex items-center" style={{ maxWidth: '180px', maxHeight: '48px' }}>
                  <Image
                    src="/images/logo/roylux-logo.png"
                    alt="RoyLux"
                    width={170}
                    height={44}
                    className="h-9 sm:h-11 w-auto object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs uppercase tracking-[0.2em] font-medium text-zinc-300 hover:text-white transition relative py-1 group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#d4af37] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right: Actions */}
            <div className="flex-1 flex items-center justify-end space-x-4 sm:space-x-6">
              {/* Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-zinc-300 hover:text-white transition"
                aria-label="Search store"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Account Link */}
              <Link
                href="/account"
                className="p-2 text-zinc-300 hover:text-white transition"
                aria-label="Customer account"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Cart Button */}
              <button
                onClick={() => setCartOpen(true)}
                className="p-2 text-zinc-300 hover:text-white relative transition group"
                aria-label="View shopping bag"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#164e32] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-[#0c0c0c] animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-zinc-300 hover:text-white lg:hidden"
                aria-label="Open mobile navigation"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 bottom-0 right-0 w-4/5 max-w-sm bg-[#111] border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl animate-fade-in">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="relative w-32 h-9">
                  <Image
                    src="/images/logo/roylux-logo.png"
                    alt="RoyLux"
                    fill
                    className="object-contain object-left"
                  />
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-zinc-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-8 flex flex-col space-y-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm uppercase tracking-[0.2em] font-medium text-zinc-300 hover:text-[#d4af37] transition"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 text-xs text-zinc-400 space-y-3">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 hover:text-white transition"
              >
                <User className="w-4 h-4 text-[#d4af37]" />
                <span>My Account & Orders</span>
              </Link>
              <p className="text-[11px] text-zinc-500">
                Delivery across Bangladesh • Dhaka ৳60 / Outside ৳120
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
