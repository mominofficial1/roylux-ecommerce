'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ShieldCheck, Truck } from 'lucide-react';
import RoyLuxStore from '@/lib/store';
import { CartItem, SiteSettings } from '@/lib/types';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(RoyLuxStore.getSettings());
  const [deliveryArea, setDeliveryArea] = useState<'dhaka' | 'outside_dhaka'>('dhaka');

  const reloadCart = () => {
    setItems(RoyLuxStore.getCart());
    setSettings(RoyLuxStore.getSettings());
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
  const deliveryCharge = deliveryArea === 'dhaka' ? settings.dhakaDeliveryFee : settings.outsideDhakaDeliveryFee;
  const freeThreshold = settings.freeDeliveryThreshold || 5000;
  const isFreeDelivery = subtotal >= freeThreshold;
  const finalDelivery = isFreeDelivery ? 0 : deliveryCharge;
  const total = subtotal + finalDelivery;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6 bg-[#fbfaf8] text-black">
        <div className="w-20 h-20 mx-auto rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-light text-black uppercase tracking-wider font-serif-luxury">
            Your Shopping Bag is Empty
          </h1>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            Discover our latest heavyweight combed cotton hoodies and tailored winter sweatshirts.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-white text-xs font-semibold uppercase tracking-[0.2em] rounded hover:bg-zinc-800 transition shadow-md"
        >
          Explore Collections <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-[#fbfaf8] text-black">
      {/* Page Title */}
      <div className="border-b border-black/10 pb-6 flex items-baseline justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#b8952b] font-semibold">
            Order Review
          </span>
          <h1 className="text-3xl sm:text-4xl font-light text-black uppercase tracking-tight font-serif-luxury mt-1">
            Shopping Bag ({items.reduce((a, b) => a + b.quantity, 0)})
          </h1>
        </div>
        <Link href="/shop" className="text-xs uppercase tracking-widest text-zinc-600 hover:text-black transition">
          Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart Items Table (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="hidden sm:grid grid-cols-12 text-xs uppercase tracking-widest text-zinc-500 pb-3 border-b border-black/10">
            <span className="col-span-6">Product</span>
            <span className="col-span-2 text-center">Size</span>
            <span className="col-span-2 text-center">Quantity</span>
            <span className="col-span-2 text-right">Total</span>
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:grid sm:grid-cols-12 items-start sm:items-center gap-4 py-5 border-b border-zinc-200"
            >
              {/* Product Info (6 cols) */}
              <div className="sm:col-span-6 flex gap-4 w-full">
                {/* Strict 1:1 image */}
                <div className="relative w-20 aspect-square bg-[#f4f2ee] rounded overflow-hidden shrink-0 border border-zinc-200">
                  <Image src={item.image} alt={item.productName} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.productSlug}`}>
                    <h3 className="text-sm font-medium text-black hover:text-[#b8952b] transition truncate">
                      {item.productName}
                    </h3>
                  </Link>
                  <p className="text-xs text-zinc-500 mt-1">
                    Unit Price: <span className="text-black font-semibold">৳{item.price.toLocaleString()}</span>
                  </p>
                  {item.selectedColor && (
                    <span className="inline-block text-[11px] text-zinc-500 mt-1">
                      Color: {item.selectedColor}
                    </span>
                  )}
                  <button
                    onClick={() => updateQty(item.id, 0)}
                    className="flex sm:hidden items-center gap-1 text-xs text-red-500 hover:text-red-700 mt-3"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>

              {/* Size (2 cols) */}
              <div className="sm:col-span-2 flex sm:justify-center w-full">
                <span className="px-2.5 py-1 rounded bg-zinc-100 border border-zinc-200 text-xs font-semibold text-black">
                  {item.selectedSize}
                </span>
              </div>

              {/* Quantity (2 cols) */}
              <div className="sm:col-span-2 flex sm:justify-center w-full">
                <div className="flex items-center border border-zinc-200 rounded bg-white">
                  <button
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    className="px-2.5 py-1 text-zinc-500 hover:text-black transition"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-3 text-xs font-semibold text-black">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    className="px-2.5 py-1 text-zinc-500 hover:text-black transition"
                    disabled={item.quantity >= item.maxStock}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Line Total & Remove (2 cols) */}
              <div className="sm:col-span-2 flex sm:flex-col items-center sm:items-end justify-between w-full">
                <span className="text-sm font-semibold text-black">
                  ৳{(item.price * item.quantity).toLocaleString()}
                </span>
                <button
                  onClick={() => updateQty(item.id, 0)}
                  className="hidden sm:inline-flex text-zinc-400 hover:text-red-500 transition mt-2"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Destination Selector (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#e8e6e1] shadow-sm space-y-6">
            <h2 className="text-base uppercase tracking-widest font-semibold text-black">
              Order Summary
            </h2>

            {/* Subtotal */}
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">Bag Subtotal</span>
              <span className="font-semibold text-black">৳{subtotal.toLocaleString()}</span>
            </div>

            {/* Delivery Area Options */}
            <div className="space-y-2 pt-2 border-t border-zinc-100">
              <span className="text-xs uppercase tracking-wider text-zinc-600 font-medium block">
                Destination:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDeliveryArea('dhaka')}
                  className={`p-3 rounded-lg border text-left text-xs transition ${
                    deliveryArea === 'dhaka'
                      ? 'border-black bg-zinc-50 text-black font-semibold'
                      : 'border-zinc-200 text-zinc-500 hover:border-black'
                  }`}
                >
                  <div className="text-black">Inside Dhaka</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">৳{settings.dhakaDeliveryFee}</div>
                </button>

                <button
                  onClick={() => setDeliveryArea('outside_dhaka')}
                  className={`p-3 rounded-lg border text-left text-xs transition ${
                    deliveryArea === 'outside_dhaka'
                      ? 'border-black bg-zinc-50 text-black font-semibold'
                      : 'border-zinc-200 text-zinc-500 hover:border-black'
                  }`}
                >
                  <div className="text-black">Outside Dhaka</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">৳{settings.outsideDhakaDeliveryFee}</div>
                </button>
              </div>
            </div>

            {/* Delivery Line */}
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">Delivery Charge</span>
              <span className="font-semibold text-black">
                {isFreeDelivery ? (
                  <span className="text-[#164e32] uppercase text-xs font-bold">Free</span>
                ) : (
                  `৳${deliveryCharge}`
                )}
              </span>
            </div>

            {/* Grand Total */}
            <div className="border-t border-zinc-200 pt-4 flex justify-between items-baseline">
              <span className="text-sm font-medium text-black uppercase tracking-wider">Total Amount</span>
              <span className="text-2xl font-bold text-black">
                ৳{total.toLocaleString()}
              </span>
            </div>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              className="w-full py-4 bg-black hover:bg-zinc-800 text-white rounded text-xs uppercase font-semibold tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-md"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="p-4 rounded-xl bg-white border border-[#e8e6e1] text-xs text-zinc-600 space-y-2 shadow-sm">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#b8952b]" />
              <span>Safe &amp; Secure Checkout Guaranteed</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#b8952b]" />
              <span>Nationwide Doorstep Delivery with Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
