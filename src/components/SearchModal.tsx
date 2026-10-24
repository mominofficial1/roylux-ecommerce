'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight } from 'lucide-react';
import RoyLuxStore from '@/lib/store';
import { Product } from '@/lib/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    setAllProducts(RoyLuxStore.getProducts());
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
    );
    setResults(filtered);
  }, [query, allProducts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 text-black">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-white border border-[#e8e6e1] rounded-xl text-black shadow-2xl z-10 overflow-hidden animate-fade-in">
        {/* Search Input */}
        <div className="flex items-center px-5 py-4 border-b border-[#e8e6e1] bg-[#fbfaf8]">
          <Search className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hoodies, sweatshirts, collections..."
            className="w-full bg-transparent text-black placeholder-zinc-400 focus:outline-none text-base font-light"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-zinc-400 hover:text-black mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-wider text-zinc-500 hover:text-black px-2 py-1 rounded bg-zinc-100"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-zinc-400 text-xs uppercase tracking-widest">
              Type to discover luxury winter apparel
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-sm">
              No matching products found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            results.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-50 transition border border-transparent hover:border-zinc-200"
              >
                <div className="relative w-14 aspect-square bg-[#f4f2ee] rounded overflow-hidden shrink-0">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-black truncate">{product.name}</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">{product.category} • SKU: {product.sku}</p>
                  <span className="text-sm font-semibold text-black mt-1 inline-block">
                    ৳{product.price.toLocaleString()}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-black shrink-0" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
