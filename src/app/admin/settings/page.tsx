'use client';

import React, { useState, useEffect } from 'react';
import { Save, Check, Settings, Truck, Phone, Globe } from 'lucide-react';
import RoyLuxStore from '@/lib/store';
import { SiteSettings } from '@/lib/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(RoyLuxStore.getSettings());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(RoyLuxStore.getSettings());
  }, []);

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    RoyLuxStore.saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
            Storefront Configuration
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-white uppercase tracking-tight font-serif-luxury mt-1">
            Site Settings & Delivery Rules
          </h1>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-[#164e32] hover:bg-[#1e6341] text-white rounded text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1.5 shadow-lg shadow-[#164e32]/30"
        >
          {saved ? <Check className="w-4 h-4 text-[#d4af37]" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Settings Saved!' : 'Save All Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Delivery Rules */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#d4af37]" /> Bangladesh Delivery Fees
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                Inside Dhaka (BDT) *
              </label>
              <input
                type="number"
                required
                value={settings.dhakaDeliveryFee}
                onChange={(e) => handleChange('dhakaDeliveryFee', Number(e.target.value))}
                className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white font-bold"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                Outside Dhaka (BDT) *
              </label>
              <input
                type="number"
                required
                value={settings.outsideDhakaDeliveryFee}
                onChange={(e) => handleChange('outsideDhakaDeliveryFee', Number(e.target.value))}
                className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white font-bold"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                Free Delivery Above (BDT)
              </label>
              <input
                type="number"
                value={settings.freeDeliveryThreshold || 0}
                onChange={(e) => handleChange('freeDeliveryThreshold', Number(e.target.value))}
                className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white font-bold"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#d4af37]" /> Business & Concierge Info
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                Concierge Contact Phone *
              </label>
              <input
                type="text"
                required
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                Support Email Address *
              </label>
              <input
                type="email"
                required
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                Storefront / Atelier Address *
              </label>
              <input
                type="text"
                required
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#d4af37]" /> Social Media Channels
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                Facebook Page URL
              </label>
              <input
                type="text"
                value={settings.facebookUrl || ''}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                Instagram Profile URL
              </label>
              <input
                type="text"
                value={settings.instagramUrl || ''}
                onChange={(e) => handleChange('instagramUrl', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                TikTok Channel URL
              </label>
              <input
                type="text"
                value={settings.tiktokUrl || ''}
                onChange={(e) => handleChange('tiktokUrl', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
