'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Flame, Tag } from 'lucide-react';
import HeroSlider from '@/components/HeroSlider';
import ProductCard from '@/components/ProductCard';
import RoyLuxStore from '@/lib/store';
import { Product, Category } from '@/lib/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setProducts(RoyLuxStore.getProducts());
    setCategories(RoyLuxStore.getCategories().filter((c) => c.isActive));
  }, []);

  const newArrivals = products.filter((p) => p.isNewArrival);
  const bestSellers = products.filter((p) => p.isBestSeller);
  const featured = products.filter((p) => p.isFeatured);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Large Hero Slider */}
      <HeroSlider />

      {/* 2. Featured Categories Section */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-white/10">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-4xl font-light text-white uppercase tracking-tight mt-1 font-serif-luxury">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition mt-3 md:mt-0"
          >
            Explore All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group relative aspect-[3/4] rounded-lg overflow-hidden border border-white/10 bg-zinc-950 block"
            >
              <Image
                src={category.imageUrl || '/images/hero/hero-1.jpg'}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 space-y-1">
                <h3 className="text-base sm:text-lg font-medium text-white uppercase tracking-wider group-hover:text-[#d4af37] transition-colors">
                  {category.name}
                </h3>
                <p className="text-[11px] text-zinc-400 font-light line-clamp-1">
                  {category.description}
                </p>
                <div className="pt-2 flex items-center text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
                  <span>Discover Pieces</span>
                  <ArrowRight className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fresh Drop</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-light text-white uppercase tracking-tight mt-1 font-serif-luxury">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop?filter=new"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition mt-3 md:mt-0"
          >
            View All New <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Luxury Promotional Editorial Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-r from-zinc-950 via-[#101010] to-[#164e32]/30 p-8 sm:p-14 lg:p-20 shadow-2xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-block px-3 py-1 rounded bg-[#164e32] text-white text-[10px] font-bold uppercase tracking-[0.2em]">
              The Winter Standard
            </span>
            <h2 className="text-3xl sm:text-5xl font-light text-white uppercase tracking-tight font-serif-luxury leading-tight">
              Heavyweight Warmth. <br />
              Tailored Architecture.
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base font-light leading-relaxed">
              Every RoyLux garment is built using dense 340+ GSM brushed combed cotton, reinforced seams, and custom hardware aglets designed to withstand winters in immaculate style.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/shop?category=winter-hoodie"
                className="px-7 py-3.5 bg-white text-black hover:bg-[#d4af37] font-semibold text-xs uppercase tracking-[0.2em] rounded-sm transition shadow-lg"
              >
                Shop Winter Hoodies
              </Link>
              <Link
                href="/about"
                className="px-7 py-3.5 border border-white/20 text-white hover:bg-white/10 font-semibold text-xs uppercase tracking-[0.2em] rounded-sm transition"
              >
                Our Craftsmanship
              </Link>
            </div>
          </div>

          {/* Background Decorative Accent */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none hidden lg:block">
            <div className="relative w-full h-full">
              <Image
                src="/images/products/product-1/1-front.jpg"
                alt="Editorial"
                fill
                className="object-cover object-center filter grayscale"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-light text-white uppercase tracking-tight mt-1 font-serif-luxury">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/shop?filter=best-seller"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition mt-3 md:mt-0"
          >
            View All Best Sellers <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
