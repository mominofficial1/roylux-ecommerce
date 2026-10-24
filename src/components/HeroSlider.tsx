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
      className="relative w-full h-[65vh] sm:h-[80vh] lg:h-[88vh] min-h-[460px] sm:min-h-[550px] overflow-hidden bg-[#111111] select-none"
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
            sizes="(max-width: 768px) 100vw, 100vw"
          />
          {/* Subtle gradient overlay to enhance readability without obscuring photography */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/30" />
        </div>
      ))}

      {/* Subtle Corner Brand Emblem */}
      <div className="absolute top-20 sm:top-24 right-4 sm:right-10 z-20 pointer-events-none">
        <div className="px-3 py-1 rounded bg-black/40 backdrop-blur-md border border-white/10 text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-zinc-300 font-medium">
          RoyLux • Winter 2026
        </div>
      </div>

      {/* Slide Content Overlay */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-20 lg:pb-28">
        <div className="max-w-2xl space-y-3 sm:space-y-4 animate-fade-in key={currentIndex}">
          {currentSlide.badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#b8952b] text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b8952b] animate-ping" />
              {currentSlide.badge}
            </div>
          )}

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-light text-white uppercase tracking-tight leading-[1.15] font-serif-luxury">
            {currentSlide.title}
          </h1>

          <p className="text-xs sm:text-base text-zinc-300 font-light tracking-wide max-w-lg line-clamp-2 sm:line-clamp-none">
            {currentSlide.subtitle}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md sm:max-w-none">
            <Link
              href={currentSlide.buttonLink}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-white text-black hover:bg-[#b8952b] hover:text-black font-semibold text-xs uppercase tracking-[0.2em] rounded-sm transition-all duration-300 shadow-xl group"
            >
              <span>{currentSlide.buttonText}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-3 border border-white/50 text-white hover:bg-white/10 font-semibold text-xs uppercase tracking-[0.2em] rounded-sm backdrop-blur-sm transition"
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
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-sm border border-white/10 transition-all opacity-70 sm:opacity-0 hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-sm border border-white/10 transition-all opacity-70 sm:opacity-0 hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-20 flex items-center space-x-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-7 sm:w-8 h-1.5 bg-[#b8952b]'
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
