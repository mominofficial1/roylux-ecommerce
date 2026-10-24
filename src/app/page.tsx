'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Flame } from 'lucide-react';
import HeroSlider from '@/components/HeroSlider';
import ProductCard from '@/components/ProductCard';
import CustomerReviews from '@/components/CustomerReviews';
import FAQSection from '@/components/FAQSection';
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

  return (
    <div className="space-y-20 sm:space-y-28 pb-20 bg-[#fbfaf8] text-black">
      {/* 1. Large Hero Slider */}
      <HeroSlider />

      {/* 2. Featured Categories Section */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 pb-4 border-b border-black/10">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#b8952b] font-semibold">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-4xl font-light text-black uppercase tracking-tight mt-1 font-serif-luxury">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-zinc-600 hover:text-black transition mt-3 md:mt-0 font-medium"
          >
            Explore All Collections <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group relative aspect-square rounded-lg overflow-hidden border border-[#e8e6e1] bg-white block shadow-sm hover:shadow-lg transition-all"
            >
              <Image
                src={category.imageUrl || '/images/hero/hero-1.jpg'}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 right-4 sm:right-5 space-y-1">
                <h3 className="text-base sm:text-lg font-medium text-white uppercase tracking-wider group-hover:text-[#d4af37] transition-colors">
                  {category.name}
                </h3>
                <p className="text-[11px] text-zinc-300 font-light line-clamp-1">
                  {category.description}
                </p>
                <div className="pt-1.5 flex items-center text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 pb-4 border-b border-black/10">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#b8952b] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fresh Drop</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-light text-black uppercase tracking-tight mt-1 font-serif-luxury">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop?filter=new"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-zinc-600 hover:text-black transition mt-3 md:mt-0 font-medium"
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

      {/* 4. Luxury Promotional Editorial Banner - Fully Visible Split Model Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-[#161616] text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 space-y-5">
              <span className="inline-block px-3 py-1 rounded bg-[#164e32] text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                The Winter Standard
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white uppercase tracking-tight font-serif-luxury leading-tight">
                Heavyweight Warmth. <br />
                Tailored Architecture.
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed max-w-lg">
                Every RoyLux garment is built using dense 340+ GSM brushed combed cotton fleece, reinforced stitching, and custom hardware aglets designed to withstand winters in immaculate comfort and style.
              </p>
              <div className="pt-2 flex flex-wrap gap-3 sm:gap-4">
                <Link
                  href="/shop?category=winter-hoodie"
                  className="px-6 py-3 bg-white text-black hover:bg-[#b8952b] hover:text-black font-semibold text-xs uppercase tracking-[0.2em] rounded transition-all shadow-lg"
                >
                  Shop Winter Hoodies
                </Link>
                <Link
                  href="/about"
                  className="px-6 py-3 border border-white/40 text-white hover:bg-white/10 font-semibold text-xs uppercase tracking-[0.2em] rounded transition"
                >
                  Our Craftsmanship
                </Link>
              </div>
            </div>

            {/* Right Column: 100% Fully Visible Model Image */}
            <div className="lg:col-span-5 relative w-full h-[360px] sm:h-[440px] lg:h-[500px] bg-stone-900 overflow-hidden">
              <Image
                src="/images/products/product-1/1-front.jpg"
                alt="RoyLux Model Wearing Love of God Hoodie"
                fill
                priority
                className="object-cover object-top sm:object-center transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
              <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded bg-black/60 backdrop-blur-md border border-white/20 text-[9px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold">
                340+ GSM Fleece
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 pb-4 border-b border-black/10">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#b8952b] font-semibold">
              <Flame className="w-3.5 h-3.5 text-orange-600" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-light text-black uppercase tracking-tight mt-1 font-serif-luxury">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/shop?filter=best-seller"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-zinc-600 hover:text-black transition mt-3 md:mt-0 font-medium"
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

      {/* 6. Realistic Customer Reviews Section (Bangladeshi Verified Buyers) */}
      <CustomerReviews />

      {/* 7. Comprehensive FAQ Section (Collapsible Accordion managed by Admin) */}
      <FAQSection />
    </div>
  );
}
