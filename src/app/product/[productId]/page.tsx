'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import {
  ShoppingBag,
  Zap,
  Check,
  Truck,
  RotateCcw,
  Shield,
  Star,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import RoyLuxStore from '@/lib/store';
import { Product } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.productId as string;
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const p = RoyLuxStore.getProductById(productId);
    if (p) {
      setProduct(p);
      setSelectedSize(p.sizes[0]?.name || 'L');
      setSelectedColor(p.colors[0]?.name || '');
      setSelectedImageIndex(0);

      // Related products
      const all = RoyLuxStore.getProducts();
      setRelatedProducts(
        all.filter((item) => item.id !== p.id && item.category === p.category).slice(0, 4)
      );
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-light text-white uppercase tracking-wider font-serif-luxury">
          Product Not Found
        </h2>
        <p className="text-zinc-500 text-sm">
          The requested RoyLux piece could not be located in our catalog.
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-2.5 bg-white text-black text-xs uppercase font-semibold tracking-wider rounded"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    RoyLuxStore.addToCart({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      image: product.images[selectedImageIndex] || product.images[0],
      price: product.price,
      selectedColor,
      selectedSize,
      quantity,
      maxStock: product.stock,
    });

    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2500);
    }, 350);
  };

  const handleBuyNow = () => {
    RoyLuxStore.addToCart({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      image: product.images[selectedImageIndex] || product.images[0],
      price: product.price,
      selectedColor,
      selectedSize,
      quantity,
      maxStock: product.stock,
    });
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-20">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-zinc-500 uppercase tracking-widest">
        <Link href="/" className="hover:text-white transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-white transition">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-zinc-300 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* LEFT: Gallery (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails Sidebar */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 py-1">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-16 sm:w-20 aspect-[3/4] rounded-md overflow-hidden border-2 transition-all shrink-0 ${
                  selectedImageIndex === idx
                    ? 'border-[#d4af37] ring-2 ring-[#d4af37]/20 scale-105'
                    : 'border-white/10 opacity-60 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`${product.name} shot ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>

          {/* Large Main Image Stage */}
          <div className="relative flex-1 aspect-[3/4] rounded-xl overflow-hidden bg-zinc-950 border border-white/10 shadow-2xl group">
            <Image
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {product.discountPercentage && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-[#164e32] text-white text-xs font-bold uppercase tracking-widest rounded shadow-lg">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>
        </div>

        {/* RIGHT: Product Details & Purchase Form (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-[10px] uppercase tracking-widest font-semibold">
                {product.category}
              </span>
              <span className="text-zinc-600 text-xs">•</span>
              <span className="text-xs text-zinc-500 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-light text-white uppercase tracking-tight font-serif-luxury leading-tight">
              {product.name}
            </h1>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl sm:text-3xl font-semibold text-white">
                ৳{product.price.toLocaleString()}
              </span>
              {product.previousPrice && (
                <span className="text-base text-zinc-500 line-through">
                  ৳{product.previousPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs text-[#d4af37] font-medium tracking-wide">
                VAT Included
              </span>
            </div>

            {/* Short Description */}
            <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed pt-1">
              {product.shortDescription}
            </p>

            {/* Color Swatch */}
            {product.colors.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="block text-xs uppercase tracking-widest text-zinc-400 font-medium">
                  Color: <strong className="text-white">{selectedColor}</strong>
                </span>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs transition ${
                        selectedColor === c.name
                          ? 'border-[#d4af37] bg-white/5 text-white'
                          : 'border-white/10 text-zinc-400 hover:border-white/30'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/30"
                        style={{ backgroundColor: c.code }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-widest text-zinc-400 font-medium">
                  Select Size: <strong className="text-white">{selectedSize}</strong>
                </span>
                <span className="text-zinc-500 text-[11px]">Relaxed Fit</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setSelectedSize(s.name)}
                    className={`py-3 rounded border text-xs font-semibold uppercase tracking-wider transition ${
                      selectedSize === s.name
                        ? 'border-[#d4af37] bg-[#d4af37]/15 text-[#d4af37]'
                        : 'border-white/10 text-zinc-300 hover:border-white/30 hover:bg-white/5'
                    }`}
                  >
                    {s.name}
                    <span className="block text-[9px] text-zinc-500 font-normal">
                      {s.stock > 0 ? `${s.stock} left` : 'Sold out'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium">
                Quantity:
              </span>
              <div className="flex items-center border border-white/15 rounded bg-black/40">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-zinc-400 hover:text-white transition"
                >
                  -
                </button>
                <span className="px-4 text-xs font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-1.5 text-zinc-400 hover:text-white transition"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-zinc-500">
                {product.stock > 0 ? 'In Stock (Ready to dispatch)' : 'Out of Stock'}
              </span>
            </div>

            {/* CTAs: Add to Bag & Buy Now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdding || product.stock <= 0}
                className={`w-full py-4 px-6 rounded text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 ${
                  isAdded
                    ? 'bg-[#164e32] text-white shadow-xl shadow-[#164e32]/30'
                    : 'bg-white hover:bg-[#d4af37] text-black shadow-lg hover:shadow-[#d4af37]/20'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Bag
                  </>
                ) : isAdding ? (
                  <span className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Bag
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full py-4 px-6 rounded text-xs font-semibold uppercase tracking-[0.2em] bg-[#164e32] hover:bg-[#1f6341] text-white transition flex items-center justify-center gap-2 shadow-lg shadow-[#164e32]/25"
              >
                <Zap className="w-4 h-4" /> Buy Now
              </button>
            </div>
          </div>

          {/* Delivery & Return Trust Box */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3 text-xs text-zinc-400">
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>
                <strong>Nationwide Delivery:</strong> Dhaka (৳60, 24-48 hrs) • Outside Dhaka (৳120, 2-3 days).
              </span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>
                <strong>Hassle-Free Returns:</strong> 7-day easy return and exchange guarantee.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>
                <strong>100% Authentic RoyLux:</strong> Signature high-density woven cotton fleece.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Features, Materials */}
      <div className="border-t border-white/10 pt-12 space-y-8">
        <div className="max-w-3xl space-y-6">
          <h2 className="text-xl sm:text-2xl font-light text-white uppercase tracking-wider font-serif-luxury">
            Garment Specification & Craftsmanship
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed font-light">
            {product.fullDescription}
          </p>

          {product.features && product.features.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                Signature Details
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#164e32]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.materials && (
            <div className="pt-2 text-xs text-zinc-400">
              <strong className="text-zinc-200">Fabric Composition:</strong> {product.materials}
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-white/10 pt-16 space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                Complete the Look
              </span>
              <h2 className="text-2xl sm:text-3xl font-light text-white uppercase tracking-tight mt-1 font-serif-luxury">
                Related Pieces
              </h2>
            </div>
            <Link href="/shop" className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
