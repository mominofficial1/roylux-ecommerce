'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If on the login page itself, don't protect
    if (pathname === '/admin') {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    const auth = sessionStorage.getItem('roylux_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    } else {
      router.push('/admin');
    }
    setLoading(false);
  }, [pathname, router]);

  const handleLogout = () => {
    sessionStorage.removeItem('roylux_admin_auth');
    router.push('/admin');
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center text-zinc-500 text-xs">Loading secure session...</div>;
  }

  // If on /admin login screen
  if (pathname === '/admin') {
    return <>{children}</>;
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-[#0c0c0c] text-white">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto p-6 sm:p-10">{children}</main>
    </div>
  );
}
