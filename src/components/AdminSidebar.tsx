'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Sliders,
  RotateCcw,
  BarChart3,
  Settings,
  Shield,
  HelpCircle,
  LogOut,
  ExternalLink,
} from 'lucide-react';

interface AdminSidebarProps {
  onLogout: () => void;
}

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Products', href: '/admin/products', icon: Layers },
    { name: 'Categories', href: '/admin/categories', icon: Sliders },
    { name: 'Hero Slider', href: '/admin/hero', icon: Sliders },
    { name: 'Returns', href: '/admin/returns', icon: RotateCcw },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { name: 'FAQ Manager', href: '/admin/faq', icon: HelpCircle },
    { name: 'Site Settings', href: '/admin/settings', icon: Settings },
    { name: 'Security', href: '/admin/security', icon: Shield },
  ];

  return (
    <aside className="w-64 bg-[#111111] border-r border-white/10 flex flex-col justify-between shrink-0 h-screen sticky top-0 p-5 text-zinc-300">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="pb-4 border-b border-white/10">
          <div className="relative w-36 h-9 mb-2">
            <Image
              src="/images/logo/roylux-logo.png"
              alt="RoyLux"
              fill
              className="object-contain object-left"
            />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold block">
            Executive Control
          </span>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider transition ${
                  active
                    ? 'bg-[#164e32] text-white shadow-lg shadow-[#164e32]/30'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition"
        >
          <span>Live Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-red-400 hover:bg-red-950/30 transition text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
