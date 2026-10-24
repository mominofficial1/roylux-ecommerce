'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Check, Eye } from 'lucide-react';
import { Product } from '@/lib/types';
import RoyLuxStore from '@/lib/store';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]?.name || 'L');
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const primaryImage = product.images[0] || '/images/hero/hero-1.jpg';
  const secondaryImage = product.images[1] || primaryImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);

    RoyLuxStore.addToCart({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      image: primaryImage,
      price: product.price,
      selectedColor: product.colors[0]?.name,
      selectedSize,
      quantity: 1,
      maxStock: product.stock,
    });

    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }, 400);
  };

  return (
    <div
      className="group relative flex flex-col bg-white border border-[#e8e6e1] rounded-lg overflow-hidden transition-all duration-300 hover:border-black/30 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame: Strict 1:1 Aspect Ratio */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square w-full overflow-hidden bg-[#f4f2ee] block">
        <Image
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges: Moved to top-right corner */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10 pointer-events-none">
          {product.isNewArrival && (
            <span className="px-2.5 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-md">
              New Drop
            </span>
          )}
          {product.discountPercentage && (
            <span className="px-2.5 py-1 bg-[#164e32] text-white text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-md">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Quick View Button overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <span className="w-full py-2.5 bg-black/85 backdrop-blur-md text-white text-[11px] font-semibold uppercase tracking-widest text-center rounded flex items-center justify-center gap-1.5 hover:bg-black transition shadow-lg">
            <Eye className="w-3.5 h-3.5" /> View Details
          </span>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white text-black">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">
            {product.category}
          </span>

          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm font-medium text-black group-hover:text-[#b8952b] transition-colors line-clamp-1 mt-1">
              {product.name}
            </h3>
          </Link>

          {/* Pricing */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-base font-semibold text-black">
              ৳{product.price.toLocaleString()}
            </span>
            {product.previousPrice && (
              <span className="text-xs text-zinc-400 line-through">
                ৳{product.previousPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Size Selection & Quick Add */}
        <div className="pt-3 border-t border-zinc-100 mt-3 space-y-2.5">
          {/* Quick Size Chips */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              {product.sizes.map((s) => (
                <button
                  key={s.name}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSize(s.name);
                  }}
                  className={`w-7 h-7 text-[11px] font-semibold rounded border transition ${
                    selectedSize === s.name
                      ? 'border-black bg-black text-white'
                      : 'border-zinc-200 text-zinc-600 hover:border-black hover:text-black bg-zinc-50'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            {/* Color Dot Indicator */}
            {product.colors.length > 0 && (
              <div
                className="w-3.5 h-3.5 rounded-full border border-zinc-300"
                style={{ backgroundColor: product.colors[0].code }}
                title={product.colors[0].name}
              />
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className={`w-full py-2.5 px-3 rounded text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
              isAdded
                ? 'bg-[#164e32] text-white shadow-md'
                : 'bg-black hover:bg-zinc-800 text-white shadow-sm'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added to Bag
              </>
            ) : isAdding ? (
              <span className="inline-block animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
