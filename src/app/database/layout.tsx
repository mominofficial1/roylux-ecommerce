'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Database, LogOut, FileText, PlusCircle, ShieldAlert } from 'lucide-react';

export default function DatabaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [staffName, setStaffName] = useState('Staff');
  const [staffRole, setStaffRole] = useState('Staff');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If on the login page itself, don't protect
    if (pathname === '/database') {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    const isStaff = sessionStorage.getItem('roylux_staff_auth') === 'true';
    const isAdmin = sessionStorage.getItem('roylux_admin_auth') === 'true';

    if (isStaff || isAdmin) {
      setIsAuthenticated(true);
      setStaffName(sessionStorage.getItem('roylux_staff_name') || 'Authorized Staff');
      setStaffRole(isAdmin ? 'Admin' : 'Staff');
    } else {
      router.push('/database');
    }
    setLoading(false);
  }, [pathname, router]);

  const handleLogout = () => {
    sessionStorage.removeItem('roylux_staff_auth');
    sessionStorage.removeItem('roylux_staff_name');
    sessionStorage.removeItem('roylux_staff_role');
    router.push('/database');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-zinc-500 text-xs">
        Loading internal terminal...
      </div>
    );
  }

  // If on /database login screen
  if (pathname === '/database') {
    return <>{children}</>;
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white flex flex-col">
      {/* Top Internal Navigation Header (Hidden during print) */}
      <header className="print:hidden sticky top-0 z-40 bg-[#121212]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/database/dashboard" className="flex items-center gap-3">
            <div className="relative w-28 h-8">
              <Image
                src="/images/logo/roylux-logo.png"
                alt="RoyLux"
                fill
                className="object-contain"
              />
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#164e32]/30 border border-[#164e32]/60 text-[10px] text-[#4ade80] font-medium tracking-wider uppercase">
              <Database className="w-3 h-3" />
              <span>Internal Order Portal</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-4 text-xs">
            <Link
              href="/database/dashboard"
              className="text-zinc-300 hover:text-white transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Manual Entry & Orders</span>
            </Link>
            {staffRole === 'Admin' && (
              <Link
                href="/admin/dashboard"
                className="text-zinc-400 hover:text-[#d4af37] transition flex items-center gap-1.5 text-[11px]"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Executive Admin</span>
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs font-medium text-white">{staffName}</div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">{staffRole} Access</div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Employee Body */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}
