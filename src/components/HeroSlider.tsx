'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { HeroSlide } from '@/lib/types';
import RoyLuxStore, { INITIAL_HERO_SLIDES } from '@/lib/store';

export default function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    const loadedSlides = RoyLuxStore.getHeroSlides().filter((s) => s.isActive);
    setSlides(loadedSlides.length > 0 ? loadedSlides : INITIAL_HERO_SLIDES);
  }, []);

  const slideDuration = (RoyLuxStore.getSettings().heroSliderDurationSeconds || 5) * 1000;

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, slideDuration);

    return () => clearInterval(interval);
  }, [slides.length, isPaused, slideDuration]);

  if (slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
    setTouchStartX(null);
  };

  return (
    <div className="w-full bg-[#fbfaf8]">
      {/* 1920:820 Strict Aspect Ratio Hero Image Container */}
      <div
        className="relative w-full aspect-[1920/820] overflow-hidden bg-stone-900 select-none shadow-sm"
        style={{ aspectRatio: '1920 / 820' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Images */}
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              priority={idx === 0}
              className="object-contain sm:object-cover w-full h-full object-center"
              sizes="100vw"
            />
            {/* Desktop Gradient Overlay for Legibility */}
            <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />
          </div>
        ))}

        {/* Subtle Brand Emblem */}
        <div className="hidden sm:block absolute top-6 right-6 sm:top-8 sm:right-10 z-20 pointer-events-none">
          <div className="px-3.5 py-1 rounded bg-black/50 backdrop-blur-md border border-white/20 text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-stone-200 font-medium">
            RoyLux • Winter 2026
          </div>
        </div>

        {/* Desktop Text Overlay (sm and above) */}
        <div className="hidden sm:flex absolute inset-0 z-20 max-w-7xl mx-auto px-6 lg:px-8 flex-col justify-end pb-8 lg:pb-12 pointer-events-none">
          <div className="max-w-2xl space-y-3 pointer-events-auto">
            {currentSlide.badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[#d4af37] text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-ping" />
                {currentSlide.badge}
              </div>
            )}

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-light text-white uppercase tracking-tight leading-[1.15] font-serif-luxury drop-shadow-md">
              {currentSlide.title}
            </h1>

            <p className="text-xs sm:text-sm text-stone-200 font-light tracking-wide max-w-lg drop-shadow-sm">
              {currentSlide.subtitle}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <Link
                href={currentSlide.buttonLink}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black hover:bg-[#d4af37] hover:text-black font-semibold text-xs uppercase tracking-[0.2em] rounded transition-all shadow-xl group"
              >
                <span>{currentSlide.buttonText}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-6 py-3 border border-white/60 text-white hover:bg-white/10 font-semibold text-xs uppercase tracking-[0.2em] rounded backdrop-blur-sm transition"
              >
                Explore Collections
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/20 transition-all shadow-lg"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/20 transition-all shadow-lg"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>

            {/* Desktop Dots */}
            <div className="hidden sm:flex absolute bottom-4 right-6 lg:bottom-8 lg:right-10 z-20 items-center space-x-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    idx === currentIndex
                      ? 'w-7 sm:w-8 h-1.5 bg-[#d4af37]'
                      : 'w-2 h-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Mobile Text & Action Strip: Displays cleanly below the 100% full uncropped 1920:820 banner */}
      <div className="block sm:hidden bg-[#fbfaf8] border-b border-stone-200 px-5 py-6 text-center space-y-3.5">
        {/* Slide Indicator Dots on Mobile */}
        <div className="flex items-center justify-center space-x-2 pb-1">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? 'w-6 h-1.5 bg-[#121212]'
                  : 'w-2 h-1.5 bg-stone-300 hover:bg-stone-400'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {currentSlide.badge && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-[#8a7226] text-[10px] uppercase tracking-[0.2em] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8a7226] animate-ping" />
            {currentSlide.badge}
          </div>
        )}

        <h1 className="text-xl font-light text-[#121212] uppercase tracking-tight leading-snug font-serif-luxury">
          {currentSlide.title}
        </h1>

        <p className="text-xs text-stone-600 font-light tracking-wide max-w-sm mx-auto">
          {currentSlide.subtitle}
        </p>

        <div className="pt-2 flex flex-col gap-2.5 max-w-xs mx-auto">
          <Link
            href={currentSlide.buttonLink}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#121212] text-white hover:bg-stone-800 font-semibold text-xs uppercase tracking-[0.2em] rounded transition-all shadow-md"
          >
            <span>{currentSlide.buttonText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/shop"
            className="w-full inline-flex items-center justify-center px-6 py-2.5 border border-stone-300 text-stone-800 hover:bg-stone-100 font-semibold text-xs uppercase tracking-[0.2em] rounded transition"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    </div>
  );
}
