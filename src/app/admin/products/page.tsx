'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Check, X, Layers, AlertCircle } from 'lucide-react';
import RoyLuxStore from '@/lib/store';
import { Product, Category } from '@/lib/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<number>(2400);
  const [previousPrice, setPreviousPrice] = useState<number>(2800);
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState<number>(40);
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [materials, setMaterials] = useState('');
  const [imagesText, setImagesText] = useState('');
  const [sizesText, setSizesText] = useState('M,L,XL');
  const [colorsText, setColorsText] = useState('Charcoal Grey:#383838');

  const loadData = () => {
    setProducts(RoyLuxStore.getProducts());
    setCategories(RoyLuxStore.getCategories());
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNewProductModal = () => {
    setEditingProduct(null);
    setName('');
    setCategory(categories[0]?.name || 'Winter Hoodie');
    setPrice(2400);
    setPreviousPrice(2800);
    setSku(`RL-${Math.floor(100 + Math.random() * 900)}`);
    setStock(40);
    setShortDesc('');
    setFullDesc('');
    setMaterials('85% Combed Cotton, 15% Poly Fleece Heavyweight');
    setImagesText('/images/hero/hero-1.jpg');
    setSizesText('M,L,XL');
    setColorsText('Cream:#F5F2EB');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setPrice(p.price);
    setPreviousPrice(p.previousPrice || 0);
    setSku(p.sku);
    setStock(p.stock);
    setShortDesc(p.shortDescription);
    setFullDesc(p.fullDescription);
    setMaterials(p.materials || '');
    setImagesText(p.images.join('\n'));
    setSizesText(p.sizes.map((s) => s.name).join(','));
    setColorsText(p.colors.map((c) => `${c.name}:${c.code}`).join(','));
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const images = imagesText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const sizes = sizesText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => ({ name: s, stock: Math.floor(stock / 3) || 10 }));

    const colors = colorsText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((c) => {
        const [cName, cCode] = c.split(':');
        return { name: cName.trim(), code: cCode ? cCode.trim() : '#111111' };
      });

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name,
      slug,
      category,
      price: Number(price),
      previousPrice: Number(previousPrice) || undefined,
      discountPercentage: previousPrice > price ? Math.round(((previousPrice - price) / previousPrice) * 100) : undefined,
      sku,
      stock: Number(stock),
      status: 'active',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      shortDescription: shortDesc,
      fullDescription: fullDesc,
      materials,
      images: images.length > 0 ? images : ['/images/hero/hero-1.jpg'],
      sizes,
      colors,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    RoyLuxStore.saveProduct(productPayload);
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this piece from catalog?')) {
      RoyLuxStore.deleteProduct(id);
      loadData();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
            Atelier Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-white uppercase tracking-tight font-serif-luxury mt-1">
            Product Management ({products.length})
          </h1>
        </div>

        <button
          onClick={openNewProductModal}
          className="px-4 py-2 bg-[#164e32] hover:bg-[#1e6341] text-white rounded text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1.5 shadow-lg shadow-[#164e32]/30"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-4 hover:border-white/20 transition"
          >
            <div className="space-y-3">
              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-zinc-950 border border-white/5">
                <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-white">
                  SKU: {p.sku}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold">
                  {p.category}
                </span>
                <h3 className="text-sm font-semibold text-white line-clamp-1 mt-0.5">{p.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-white">৳{p.price.toLocaleString()}</span>
                  {p.previousPrice && (
                    <span className="text-xs text-zinc-500 line-through">
                      ৳{p.previousPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="ml-auto text-xs text-zinc-400">Stock: {p.stock}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
              <button
                onClick={() => openEditModal(p)}
                className="text-zinc-300 hover:text-white flex items-center gap-1 font-semibold"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>

              <button
                onClick={() => handleDelete(p.id)}
                className="text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-[#141414] border border-white/10 rounded-2xl p-6 sm:p-8 text-white shadow-2xl max-h-[90vh] overflow-y-auto space-y-6 z-10 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-light uppercase tracking-wider font-serif-luxury">
                {editingProduct ? 'Edit Product' : 'Create New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. RoyLux Signature Charcoal Hoodie"
                  className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                    Selling Price (BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                    Previous Price (BDT)
                  </label>
                  <input
                    type="number"
                    value={previousPrice}
                    onChange={(e) => setPreviousPrice(Number(e.target.value))}
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                    Total Inventory Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                  Image Paths (One URL per line) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={imagesText}
                  onChange={(e) => setImagesText(e.target.value)}
                  placeholder="/images/products/product-1/1-front.jpg"
                  className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37] font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                    Available Sizes (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={sizesText}
                    onChange={(e) => setSizesText(e.target.value)}
                    placeholder="M,L,XL"
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                    Colors (Name:Hex, comma separated)
                  </label>
                  <input
                    type="text"
                    value={colorsText}
                    onChange={(e) => setColorsText(e.target.value)}
                    placeholder="Charcoal:#383838,Cream:#FAF8F5"
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                  Full Description & Details
                </label>
                <textarea
                  rows={3}
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded border border-white/10 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded bg-[#164e32] hover:bg-[#1e6341] text-white font-semibold uppercase tracking-wider"
                >
                  Save Piece
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
