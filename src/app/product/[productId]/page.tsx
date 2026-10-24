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
  ChevronRight,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import RoyLuxStore from '@/lib/store';
import { Product } from '@/lib/types';

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

      const all = RoyLuxStore.getProducts();
      setRelatedProducts(
        all.filter((item) => item.id !== p.id && item.category === p.category).slice(0, 4)
      );
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4 bg-[#fbfaf8] text-black">
        <h2 className="text-2xl font-light text-black uppercase tracking-wider font-serif-luxury">
          Product Not Found
        </h2>
        <p className="text-zinc-600 text-sm">
          The requested RoyLux piece could not be located in our catalog.
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-2.5 bg-black text-white text-xs uppercase font-semibold tracking-wider rounded"
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 bg-[#fbfaf8] text-black">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-zinc-500 uppercase tracking-widest">
        <Link href="/" className="hover:text-black transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-black transition">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-black font-medium truncate max-w-xs">{product.name}</span>
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
                className={`relative w-16 sm:w-20 aspect-square rounded-md overflow-hidden border-2 transition-all shrink-0 bg-white ${
                  selectedImageIndex === idx
                    ? 'border-black ring-2 ring-black/10 scale-105 shadow-sm'
                    : 'border-zinc-200 opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`${product.name} shot ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>

          {/* Large Main Image Stage: Strict 1:1 Aspect Ratio */}
          <div className="relative flex-1 aspect-square rounded-xl overflow-hidden bg-white border border-[#e8e6e1] shadow-lg group">
            <Image
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Badges: Top Right Corner */}
            <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5 z-10 pointer-events-none">
              {product.isNewArrival && (
                <span className="px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest rounded shadow-md">
                  New Drop
                </span>
              )}
              {product.discountPercentage && (
                <span className="px-3 py-1 bg-[#164e32] text-white text-xs font-bold uppercase tracking-widest rounded shadow-md">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Product Details & Purchase Form (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-[10px] uppercase tracking-widest font-semibold">
                {product.category}
              </span>
              <span className="text-zinc-400 text-xs">•</span>
              <span className="text-xs text-zinc-500 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-light text-black uppercase tracking-tight font-serif-luxury leading-tight">
              {product.name}
            </h1>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl sm:text-3xl font-semibold text-black">
                ৳{product.price.toLocaleString()}
              </span>
              {product.previousPrice && (
                <span className="text-base text-zinc-400 line-through">
                  ৳{product.previousPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs text-[#b8952b] font-medium tracking-wide">
                VAT Included
              </span>
            </div>

            {/* Short Description */}
            <p className="text-zinc-600 text-xs sm:text-sm font-light leading-relaxed pt-1">
              {product.shortDescription}
            </p>

            {/* Color Swatch */}
            {product.colors.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="block text-xs uppercase tracking-widest text-zinc-600 font-medium">
                  Color: <strong className="text-black">{selectedColor}</strong>
                </span>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs transition ${
                        selectedColor === c.name
                          ? 'border-black bg-zinc-100 text-black font-medium'
                          : 'border-zinc-200 text-zinc-600 hover:border-black'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-zinc-300"
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
                <span className="uppercase tracking-widest text-zinc-600 font-medium">
                  Select Size: <strong className="text-black">{selectedSize}</strong>
                </span>
                <span className="text-zinc-500 text-[11px]">Relaxed Tailored Fit</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setSelectedSize(s.name)}
                    className={`py-3 rounded border text-xs font-semibold uppercase tracking-wider transition ${
                      selectedSize === s.name
                        ? 'border-black bg-black text-white shadow-sm'
                        : 'border-zinc-200 text-zinc-700 hover:border-black hover:text-black bg-white'
                    }`}
                  >
                    {s.name}
                    <span className="block text-[9px] text-zinc-400 font-normal">
                      {s.stock > 0 ? `${s.stock} left` : 'Sold out'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs uppercase tracking-widest text-zinc-600 font-medium">
                Quantity:
              </span>
              <div className="flex items-center border border-zinc-200 rounded bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-zinc-500 hover:text-black transition"
                >
                  -
                </button>
                <span className="px-4 text-xs font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-1.5 text-zinc-500 hover:text-black transition"
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
                    ? 'bg-[#164e32] text-white shadow-md'
                    : 'bg-black hover:bg-zinc-800 text-white shadow-md'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Bag
                  </>
                ) : isAdding ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Bag
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full py-4 px-6 rounded text-xs font-semibold uppercase tracking-[0.2em] bg-[#164e32] hover:bg-[#1f6341] text-white transition flex items-center justify-center gap-2 shadow-md"
              >
                <Zap className="w-4 h-4" /> Buy Now
              </button>
            </div>
          </div>

          {/* Delivery & Return Trust Box */}
          <div className="p-4 rounded-xl bg-white border border-[#e8e6e1] space-y-3 text-xs text-zinc-600 shadow-sm">
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-[#b8952b] shrink-0" />
              <span>
                <strong>Nationwide Delivery:</strong> Dhaka (৳60, 24-48 hrs) • Outside Dhaka (৳120, 2-3 days).
              </span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-[#b8952b] shrink-0" />
              <span>
                <strong>Hassle-Free Returns:</strong> 7-day easy return and size exchange guarantee.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-[#b8952b] shrink-0" />
              <span>
                <strong>100% Authentic RoyLux:</strong> Heavyweight brushed combed cotton fleece.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Features, Materials */}
      <div className="border-t border-black/10 pt-12 space-y-8">
        <div className="max-w-3xl space-y-6">
          <h2 className="text-xl sm:text-2xl font-light text-black uppercase tracking-wider font-serif-luxury">
            Garment Specification & Craftsmanship
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed font-light">
            {product.fullDescription}
          </p>

          {product.features && product.features.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs uppercase tracking-widest text-[#b8952b] font-semibold">
                Signature Details
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-700">
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
            <div className="pt-2 text-xs text-zinc-600">
              <strong className="text-black">Fabric Composition:</strong> {product.materials}
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-black/10 pt-16 space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#b8952b] font-semibold">
                Complete the Look
              </span>
              <h2 className="text-2xl sm:text-3xl font-light text-black uppercase tracking-tight mt-1 font-serif-luxury">
                Related Pieces
              </h2>
            </div>
            <Link href="/shop" className="text-xs uppercase tracking-widest text-zinc-600 hover:text-black">
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
