'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import RoyLuxStore from '@/lib/store';
import { Product, Category } from '@/lib/types';

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const filterParam = searchParams.get('filter') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(3500);

  useEffect(() => {
    setProducts(RoyLuxStore.getProducts());
    setCategories(RoyLuxStore.getCategories().filter((c) => c.isActive));
  }, []);

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all') {
          const cat = categories.find((c) => c.slug === selectedCategory);
          if (cat && p.category.toLowerCase() !== cat.name.toLowerCase()) {
            return false;
          }
        }

        // Special filter param
        if (filterParam === 'new' && !p.isNewArrival) return false;
        if (filterParam === 'best-seller' && !p.isBestSeller) return false;
        if (filterParam === 'featured' && !p.isFeatured) return false;

        // Size filter
        if (selectedSize !== 'all' && !p.sizes.some((s) => s.name === selectedSize)) {
          return false;
        }

        // Price filter
        if (p.price > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0;
      });
  }, [products, categories, selectedCategory, filterParam, selectedSize, maxPrice, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
          Winter 2026 Collection
        </span>
        <h1 className="text-3xl sm:text-5xl font-light text-white uppercase tracking-tight font-serif-luxury">
          The RoyLux Wardrobe
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm font-light">
          Engineered for thermal comfort, tailored for elevated everyday luxury.
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Category Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full uppercase tracking-wider font-semibold transition ${
              selectedCategory === 'all'
                ? 'bg-white text-black shadow-md'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            All Products
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.slug)}
              className={`px-3.5 py-1.5 rounded-full uppercase tracking-wider font-semibold transition ${
                selectedCategory === c.slug
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Right Sort & Size controls */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Size filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 uppercase tracking-wider">Size:</span>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="bg-black/50 border border-white/15 text-white rounded px-2.5 py-1.5 focus:outline-none focus:border-[#d4af37]"
            >
              <option value="all">All Sizes</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-black/50 border border-white/15 text-white rounded px-2.5 py-1.5 focus:outline-none focus:border-[#d4af37]"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest Drops</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Counter and Grid */}
      <div>
        <div className="flex items-center justify-between mb-6 text-xs text-zinc-500">
          <span>Showing {filteredProducts.length} pieces</span>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSize('all');
              }}
              className="text-[#d4af37] hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl space-y-4">
            <p className="text-zinc-400 text-sm">No products found matching your current filter criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSize('all');
                setMaxPrice(3500);
              }}
              className="px-6 py-2.5 bg-[#164e32] text-white text-xs uppercase font-semibold tracking-wider rounded hover:bg-[#1e6340] transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-zinc-500">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
