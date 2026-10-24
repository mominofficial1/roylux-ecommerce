'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import RoyLuxStore from '@/lib/store';
import { CartItem } from '@/lib/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  const loadCart = () => {
    setItems(RoyLuxStore.getCart());
  };

  useEffect(() => {
    loadCart();
    const handleUpdate = () => loadCart();
    window.addEventListener('roylux-cart-updated', handleUpdate);
    return () => window.removeEventListener('roylux-cart-updated', handleUpdate);
  }, []);

  const updateQty = (id: string, qty: number) => {
    RoyLuxStore.updateCartQuantity(id, qty);
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#111111] border-l border-white/10 text-white h-full flex flex-col shadow-2xl z-10 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-lg font-medium tracking-wide uppercase">Your Bag ({items.reduce((a, b) => a + b.quantity, 0)})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/5 transition"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center text-zinc-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-zinc-400 text-sm">Your shopping bag is currently empty.</p>
              <button
                onClick={onClose}
                className="inline-block text-xs uppercase tracking-widest text-[#d4af37] hover:underline"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 bg-white/5 rounded-lg border border-white/5"
              >
                <div className="relative w-20 h-24 bg-zinc-900 rounded overflow-hidden shrink-0">
                  <Image
                    src={item.image}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-medium line-clamp-1">{item.productName}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                      <span>Size: <strong className="text-white">{item.selectedSize}</strong></span>
                      {item.selectedColor && (
                        <span>• Color: <strong className="text-white">{item.selectedColor}</strong></span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-white/10 rounded bg-black/40">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="p-1 hover:text-[#d4af37] transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="p-1 hover:text-[#d4af37] transition"
                        disabled={item.quantity >= item.maxStock}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-[#d4af37]">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 0)}
                        className="text-zinc-500 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Subtotal & Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-[#0d0d0d] space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Subtotal</span>
              <span className="font-semibold text-white">৳{subtotal.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-zinc-500">
              Delivery charges calculated during checkout (Dhaka ৳60 / Outside ৳120).
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                href="/cart"
                onClick={onClose}
                className="w-full text-center py-3 text-xs uppercase tracking-widest font-semibold border border-white/20 rounded hover:bg-white/5 transition"
              >
                View Bag
              </Link>
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full text-center py-3 text-xs uppercase tracking-widest font-semibold bg-[#164e32] hover:bg-[#1e613f] text-white rounded transition flex items-center justify-center gap-1.5 shadow-lg shadow-[#164e32]/20"
              >
                Checkout <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
