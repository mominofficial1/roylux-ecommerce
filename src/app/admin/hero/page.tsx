'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sliders, Save, Check } from 'lucide-react';
import RoyLuxStore from '@/lib/store';
import { HeroSlide, SiteSettings } from '@/lib/types';

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(RoyLuxStore.getSettings());
  const [duration, setDuration] = useState<number>(5);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSlides(RoyLuxStore.getHeroSlides());
    const s = RoyLuxStore.getSettings();
    setSettings(s);
    setDuration(s.heroSliderDurationSeconds || 5);
  }, []);

  const handleSlideChange = (id: string, field: keyof HeroSlide, value: any) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    slides.forEach((slide) => RoyLuxStore.saveHeroSlide(slide));

    const updatedSettings = {
      ...settings,
      heroSliderDurationSeconds: Number(duration),
    };
    RoyLuxStore.saveSettings(updatedSettings);

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
            Visual Merchandising
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-white uppercase tracking-tight font-serif-luxury mt-1">
            Hero Slider Management
          </h1>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-5 py-2.5 bg-[#164e32] hover:bg-[#1e6341] text-white rounded text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1.5 shadow-lg shadow-[#164e32]/30"
        >
          {saved ? <Check className="w-4 h-4 text-[#d4af37]" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Changes Saved!' : 'Save Slider Changes'}</span>
        </button>
      </div>

      {/* Global Slider Timing Setting */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div>
          <h3 className="font-semibold text-white uppercase tracking-wider">
            Slide Transition Interval
          </h3>
          <p className="text-zinc-400 mt-0.5">
            Automatic time before transitioning to the next banner slide.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            min={2}
            max={20}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-20 bg-black/60 border border-white/15 rounded px-3 py-2 text-white text-center font-bold focus:outline-none focus:border-[#d4af37]"
          />
          <span className="text-zinc-400">Seconds (Current: {duration}s)</span>
        </div>
      </div>

      {/* Slides Editor Cards */}
      <div className="space-y-6">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#164e32] text-white text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Slide {index + 1}
                </h3>
              </div>

              <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={slide.isActive}
                  onChange={(e) => handleSlideChange(slide.id, 'isActive', e.target.checked)}
                  className="rounded bg-black border-white/20 text-[#164e32]"
                />
                <span>Active in Rotation</span>
              </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
              {/* Image Preview (4 cols) */}
              <div className="lg:col-span-4 space-y-2">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-zinc-950 border border-white/10">
                  <Image src={slide.imageUrl} alt={slide.title} fill className="object-cover" />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-zinc-500 mb-1 font-medium text-[10px]">
                    Banner Image Path
                  </label>
                  <input
                    type="text"
                    value={slide.imageUrl}
                    onChange={(e) => handleSlideChange(slide.id, 'imageUrl', e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded px-2.5 py-1.5 text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Form Fields (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={slide.badge || ''}
                      onChange={(e) => handleSlideChange(slide.id, 'badge', e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={slide.orderPosition}
                      onChange={(e) => handleSlideChange(slide.id, 'orderPosition', Number(e.target.value))}
                      className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                    Slide Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={slide.title}
                    onChange={(e) => handleSlideChange(slide.id, 'title', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                    Slide Subtitle
                  </label>
                  <input
                    type="text"
                    value={slide.subtitle}
                    onChange={(e) => handleSlideChange(slide.id, 'subtitle', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={slide.buttonText}
                      onChange={(e) => handleSlideChange(slide.id, 'buttonText', e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                      Button Link
                    </label>
                    <input
                      type="text"
                      value={slide.buttonLink}
                      onChange={(e) => handleSlideChange(slide.id, 'buttonLink', e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
