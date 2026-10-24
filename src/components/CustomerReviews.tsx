'use client';

import React from 'react';
import { Star, CheckCircle, ShieldCheck, ThumbsUp } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  location: string;
  productBought: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Tanvir Ahmed',
    location: 'Gulshan-2, Dhaka',
    productBought: 'RoyLux "Love of God" Two-Tone Fleece Hoodie (Size L)',
    rating: 5,
    date: '2 days ago',
    title: 'Genuinely international heavyweight quality in Bangladesh',
    comment:
      'The 340 GSM fleece is seriously thick, structured, and warm. Doesn\'t drape limp like fast fashion hoodies. Reached my doorstep in Gulshan within 24 hours. Well worth every taka.',
    verified: true,
  },
  {
    id: 'rev-2',
    name: 'Zannatun Nayeem',
    location: 'Uttara, Sector 4, Dhaka',
    productBought: 'RoyLux "RL" Pure White Minimalist Fleece Sweatshirt (Size M)',
    rating: 5,
    date: '4 days ago',
    title: 'The ribbing and fabric finish is exceptional',
    comment:
      'Ordered this crewneck for my brother. The contrast striped collar and cuffs stay crisp and flat even after cold wash. The brushed fleece inside is super soft against the skin.',
    verified: true,
  },
  {
    id: 'rev-3',
    name: 'Farhan Kabir',
    location: 'Nasirabad, Chittagong',
    productBought: 'RoyLux Signature Tipped Charcoal Fleece Hoodie (Size XL)',
    rating: 5,
    date: '1 week ago',
    title: 'Best streetwear hoodie brand in Bangladesh right now',
    comment:
      'Shipped to Chittagong in 2 business days via Steadfast. The white tipped hems and metallic aglets give it that Fear of God / Essentials look. Sizing is spot on.',
    verified: true,
  },
  {
    id: 'rev-4',
    name: 'Anika Tabassum',
    location: 'Dhanmondi, Dhaka',
    productBought: 'RoyLux "Love of God" Two-Tone Fleece Hoodie (Size M)',
    rating: 5,
    date: '1 week ago',
    title: 'Cash on delivery and doorstep checking was flawless',
    comment:
      'The delivery rider waited patiently while I verified the size and tags. The forest green & heather grey colorway looks even richer in person than in the product photos.',
    verified: true,
  },
  {
    id: 'rev-5',
    name: 'Mahmudul Hasan',
    location: 'Kumarpara, Sylhet',
    productBought: 'RoyLux "Paris" Collegiate Varsity Thermal Crewneck (Size L)',
    rating: 5,
    date: '2 weeks ago',
    title: 'Perfect for cold winter evenings without layering',
    comment:
      'Dense thermal cotton that really blocks chilly winter breeze. Double stitching everywhere and the high-density print is top-tier. Will order another before winter ends.',
    verified: true,
  },
];

export default function CustomerReviews() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#8a7226] font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Customer Feedback</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-light text-[#121212] uppercase tracking-tight mt-1 font-serif-luxury">
            Client Experiences Across Bangladesh
          </h2>
        </div>

        {/* Aggregate rating badge */}
        <div className="mt-4 md:mt-0 flex items-center gap-3 bg-stone-100/80 border border-stone-200 px-4 py-2 rounded-lg">
          <div className="flex items-center gap-1 text-[#b8952b]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#b8952b]" />
            ))}
          </div>
          <div className="text-xs">
            <span className="font-bold text-[#121212]">4.9 / 5.0</span>
            <span className="text-stone-500 ml-1.5">(1,240+ Verified Buyers)</span>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REVIEWS.slice(0, 3).map((review) => (
          <div
            key={review.id}
            className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-black/20 hover:shadow-md transition-all duration-300"
          >
            <div className="space-y-3">
              {/* Stars & Date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5 text-[#b8952b]">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#b8952b]" />
                  ))}
                </div>
                <span className="text-[11px] text-stone-400">{review.date}</span>
              </div>

              {/* Title & Comment */}
              <h3 className="text-sm font-semibold text-[#121212] leading-snug">
                "{review.title}"
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                {review.comment}
              </p>
            </div>

            {/* Author & Verified Badge */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-[#121212]">{review.name}</h4>
                <p className="text-[11px] text-stone-500">{review.location}</p>
              </div>

              <div className="inline-flex items-center gap-1 text-[10px] text-[#164e32] font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" />
                <span>Verified Buyer</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Highlights Strip */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-xl bg-stone-100/70 border border-stone-200 text-center">
        <div>
          <span className="text-xl sm:text-2xl font-bold text-[#121212] block">100%</span>
          <span className="text-[11px] text-stone-600 uppercase tracking-wider">340+ GSM Combed Cotton</span>
        </div>
        <div>
          <span className="text-xl sm:text-2xl font-bold text-[#121212] block">24-48h</span>
          <span className="text-[11px] text-stone-600 uppercase tracking-wider">Fast Delivery in Dhaka</span>
        </div>
        <div>
          <span className="text-xl sm:text-2xl font-bold text-[#121212] block">64</span>
          <span className="text-[11px] text-stone-600 uppercase tracking-wider">Districts Covered</span>
        </div>
        <div>
          <span className="text-xl sm:text-2xl font-bold text-[#121212] block">7 Days</span>
          <span className="text-[11px] text-stone-600 uppercase tracking-wider">Doorstep Return / Swap</span>
        </div>
      </div>
    </section>
  );
}
