'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import RoyLuxStore from '@/lib/store';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const settings = RoyLuxStore.getSettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && message.trim()) {
      setSent(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-light text-white uppercase tracking-tight font-serif-luxury">
          RoyLux Concierge
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm font-light">
          Have an inquiry regarding a product drop, order tracking, or corporate order? We are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
              Direct Channels
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3 text-zinc-300">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-300">
                <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-start gap-3 text-zinc-300">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-[11px] text-zinc-500">
              Customer support is available Saturday to Thursday, 10:00 AM – 8:00 PM (BST).
            </div>
          </div>
        </div>

        {/* Message form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10">
            {sent ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#164e32] mx-auto" />
                <h3 className="text-base font-semibold text-white">Message Dispatched</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Thank you for reaching out, {name}. A member of our concierge team will respond promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-black/50 border border-white/10 rounded px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                    Email / Mobile Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="How can we reach you?"
                    className="w-full bg-black/50 border border-white/10 rounded px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                    Inquiry Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                    className="w-full bg-black/50 border border-white/10 rounded px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#164e32] hover:bg-[#1e6341] text-white rounded text-xs uppercase font-semibold tracking-[0.2em] transition flex items-center justify-center gap-2 shadow-lg shadow-[#164e32]/25"
                >
                  <Send className="w-3.5 h-3.5" /> Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
