'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Database, ArrowRight, Shield } from 'lucide-react';
import RoyLuxStore from '@/lib/store';

export default function EmployeeLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isStaff = sessionStorage.getItem('roylux_staff_auth') === 'true';
      const isAdmin = sessionStorage.getItem('roylux_admin_auth') === 'true';
      if (isStaff || isAdmin) {
        router.push('/database/dashboard');
      }
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const staffCreds = RoyLuxStore.getEmployeeCredentials();
    const adminCreds = RoyLuxStore.getAdminCredentials();

    const u = username.trim();
    const p = password.trim();

    if (u === staffCreds.username && p === staffCreds.password) {
      sessionStorage.setItem('roylux_staff_auth', 'true');
      sessionStorage.setItem('roylux_staff_name', 'Staff Member');
      sessionStorage.setItem('roylux_staff_role', 'Staff');
      router.push('/database/dashboard');
    } else if (u === adminCreds.username && p === adminCreds.password) {
      sessionStorage.setItem('roylux_staff_auth', 'true');
      sessionStorage.setItem('roylux_admin_auth', 'true');
      sessionStorage.setItem('roylux_staff_name', 'Administrator');
      sessionStorage.setItem('roylux_staff_role', 'Admin');
      router.push('/database/dashboard');
    } else {
      setErrorMsg('Invalid staff authentication credentials. Access denied.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-[#121212] border border-white/10 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="relative w-44 h-12 mx-auto">
            <Image
              src="/images/logo/roylux-logo.png"
              alt="RoyLux"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
            <Database className="w-3.5 h-3.5" />
            <span>Staff Order Database</span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded bg-red-950/40 border border-red-500/30 text-red-300 text-xs text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
              Staff ID / Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full bg-black/60 border border-white/10 rounded px-3.5 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
              Access Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-black/60 border border-white/10 rounded px-3.5 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#164e32] hover:bg-[#1f6341] text-white rounded text-xs uppercase font-semibold tracking-[0.2em] transition flex items-center justify-center gap-2 shadow-xl shadow-[#164e32]/30 mt-2"
          >
            {loading ? (
              <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <span>Enter Order System</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-white/5 text-center text-[11px] text-zinc-500">
          <p className="flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-zinc-600" />
            <span>Restricted Internal Operation • Authorized Personnel Only</span>
          </p>
        </div>
      </div>
    </div>
  );
}
