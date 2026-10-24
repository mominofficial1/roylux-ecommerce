'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import RoyLuxStore from '@/lib/store';
import { CartItem } from '@/lib/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  const reloadCart = () => {
    setItems(RoyLuxStore.getCart());
  };

  useEffect(() => {
    reloadCart();
    const handleUpdate = () => reloadCart();
    window.addEventListener('roylux-cart-updated', handleUpdate);
    return () => window.removeEventListener('roylux-cart-updated', handleUpdate);
  }, []);

  const updateQty = (itemId: string, newQty: number) => {
    RoyLuxStore.updateCartQuantity(itemId, newQty);
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-black">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        {/* Drawer */}
        <div className="relative w-screen max-w-md bg-[#fbfaf8] border-l border-[#e8e6e1] h-full flex flex-col shadow-2xl z-10 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#e8e6e1] bg-white">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-black" />
              <h2 className="text-sm font-semibold tracking-wider uppercase">Your Shopping Bag ({items.reduce((a, b) => a + b.quantity, 0)})</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-black rounded-full hover:bg-zinc-100 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-zinc-500 text-sm">Your shopping bag is currently empty.</p>
                <button
                  onClick={onClose}
                  className="inline-block text-xs uppercase tracking-widest text-black font-semibold hover:underline"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 bg-white rounded-lg border border-[#e8e6e1] shadow-sm"
                >
                  {/* Strict 1:1 image thumbnail */}
                  <div className="relative w-20 aspect-square bg-[#f4f2ee] rounded overflow-hidden shrink-0">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-black line-clamp-1">{item.productName}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                        <span>Size: <strong className="text-black">{item.selectedSize}</strong></span>
                        {item.selectedColor && (
                          <span>• Color: <strong className="text-black">{item.selectedColor}</strong></span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-zinc-200 rounded bg-zinc-50">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="p-1 text-zinc-600 hover:text-black transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="p-1 text-zinc-600 hover:text-black transition"
                          disabled={item.quantity >= item.maxStock}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-black">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 0)}
                          className="text-zinc-400 hover:text-red-500 transition"
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
            <div className="p-5 border-t border-[#e8e6e1] bg-white space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">Subtotal</span>
                <span className="font-semibold text-black">৳{subtotal.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Delivery charges calculated during checkout (Dhaka ৳60 / Outside ৳120).
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="w-full text-center py-3 text-xs uppercase tracking-widest font-semibold border border-zinc-300 text-black rounded hover:bg-zinc-50 transition"
                >
                  View Bag
                </Link>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full text-center py-3 text-xs uppercase tracking-widest font-semibold bg-black hover:bg-zinc-800 text-white rounded transition flex items-center justify-center gap-1.5 shadow-md"
                >
                  Checkout <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
