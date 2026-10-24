'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Edit2, Sliders, Check, X } from 'lucide-react';
import RoyLuxStore from '@/lib/store';
import { Category } from '@/lib/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/images/hero/hero-1.jpg');
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const loadData = () => {
    setCategories(RoyLuxStore.getCategories());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const catSlug =
      slug.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const catPayload: Category = {
      id: isEditing || `cat-${Date.now()}`,
      name,
      slug: catSlug,
      description,
      imageUrl,
      isActive: true,
      orderPosition: categories.length + 1,
    };

    RoyLuxStore.saveCategory(catPayload);
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl('/images/hero/hero-1.jpg');
    setIsEditing(null);
    loadData();
  };

  const handleEdit = (c: Category) => {
    setIsEditing(c.id);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description || '');
    setImageUrl(c.imageUrl || '/images/hero/hero-1.jpg');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this category?')) {
      RoyLuxStore.deleteCategory(id);
      loadData();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
            Taxonomy & Navigation
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-white uppercase tracking-tight font-serif-luxury mt-1">
            Category Management ({categories.length})
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Form (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
            {isEditing ? 'Edit Category' : 'Create New Category'}
          </h2>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Winter Hoodie"
                className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                Slug (Optional, auto-generated)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="winter-hoodie"
                className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                Cover Image Path
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/images/products/product-1/1-front.jpg"
                className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short tagline for category cards"
                className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#164e32] hover:bg-[#1e6341] text-white rounded text-xs font-semibold uppercase tracking-wider transition"
              >
                {isEditing ? 'Update Category' : 'Add Category'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(null);
                    setName('');
                    setSlug('');
                    setDescription('');
                  }}
                  className="px-3 py-2.5 rounded border border-white/10 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Existing Categories List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
            Current Active Categories
          </h2>

          <div className="space-y-3">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-14 bg-zinc-900 rounded overflow-hidden shrink-0 border border-white/10">
                    <Image
                      src={c.imageUrl || '/images/hero/hero-1.jpg'}
                      alt={c.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{c.name}</h3>
                    <p className="text-xs text-zinc-500 font-mono">/shop?category={c.slug}</p>
                    {c.description && (
                      <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">{c.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="p-1.5 rounded hover:bg-white/10 text-zinc-300 hover:text-white transition"
                    title="Edit category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 rounded hover:bg-red-950/40 text-red-400 transition"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
