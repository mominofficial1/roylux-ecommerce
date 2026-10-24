'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { HeroSlide } from '@/lib/types';
import RoyLuxStore from '@/lib/store';

export default function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const loadedSlides = RoyLuxStore.getHeroSlides().filter((s) => s.isActive);
    setSlides(loadedSlides);
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

  return (
    <div
      className="relative w-full h-[75vh] sm:h-[85vh] lg:h-[90vh] overflow-hidden bg-[#0c0c0c] select-none"
      style={{ minHeight: '520px', position: 'relative' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Background Images */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <Image
            src={slide.imageUrl}
            alt={slide.title}
            fill
            priority={idx === 0}
            className="object-cover object-top sm:object-center"
            sizes="100vw"
          />
          {/* Subtle gradient overlay to enhance readability without obscuring photography */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />
        </div>
      ))}

      {/* Subtle Corner Brand Emblem */}
      <div className="absolute top-24 right-6 sm:right-10 z-20 pointer-events-none hidden sm:block">
        <div className="px-3 py-1.5 rounded-md bg-black/40 backdrop-blur-md border border-white/10 text-[10px] tracking-[0.3em] uppercase text-zinc-300 font-medium">
          RoyLux • Winter Drop 2026
        </div>
      </div>

      {/* Slide Content Overlay */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-20 sm:pb-24 lg:pb-32">
        <div className="max-w-2xl space-y-4 animate-fade-in key={currentIndex}">
          {currentSlide.badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#d4af37] text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-ping" />
              {currentSlide.badge}
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light text-white uppercase tracking-tight leading-[1.1] font-serif-luxury">
            {currentSlide.title}
          </h1>

          <p className="text-sm sm:text-lg text-zinc-300 font-light tracking-wide max-w-lg">
            {currentSlide.subtitle}
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href={currentSlide.buttonLink}
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-white text-black hover:bg-[#d4af37] hover:text-black font-semibold text-xs uppercase tracking-[0.2em] rounded-sm transition-all duration-300 shadow-xl group"
            >
              <span>{currentSlide.buttonText}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center px-7 py-3.5 border border-white/40 text-white hover:bg-white/10 font-semibold text-xs uppercase tracking-[0.2em] rounded-sm backdrop-blur-sm transition"
            >
              Explore All Drops
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-sm border border-white/10 transition-all opacity-0 group-hover:opacity-100 hover:scale-105"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-sm border border-white/10 transition-all opacity-0 group-hover:opacity-100 hover:scale-105"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 right-8 z-20 flex items-center space-x-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-8 h-1.5 bg-[#d4af37]'
                    : 'w-2 h-1.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
