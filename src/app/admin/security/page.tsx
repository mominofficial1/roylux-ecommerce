'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Key, Check, Lock, AlertCircle } from 'lucide-react';
import RoyLuxStore from '@/lib/store';

export default function AdminSecurityPage() {
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminSaved, setAdminSaved] = useState(false);

  const [staffUsername, setStaffUsername] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffSaved, setStaffSaved] = useState(false);

  useEffect(() => {
    const adminCreds = RoyLuxStore.getAdminCredentials();
    setAdminUsername(adminCreds.username);
    setAdminPassword(adminCreds.password);

    const staffCreds = RoyLuxStore.getEmployeeCredentials();
    setStaffUsername(staffCreds.username);
    setStaffPassword(staffCreds.password);
  }, []);

  const handleSaveAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUsername.trim() || !adminPassword.trim()) return;
    RoyLuxStore.saveAdminCredentials(adminUsername.trim(), adminPassword.trim());
    setAdminSaved(true);
    setTimeout(() => setAdminSaved(false), 2500);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffUsername.trim() || !staffPassword.trim()) return;
    RoyLuxStore.saveEmployeeCredentials(staffUsername.trim(), staffPassword.trim());
    setStaffSaved(true);
    setTimeout(() => setStaffSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
            Authentication & Access Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-white uppercase tracking-tight font-serif-luxury mt-1">
            Security & Credentials Manager
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
        {/* Administrator Credentials */}
        <form onSubmit={handleSaveAdmin} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold uppercase tracking-wider text-sm border-b border-white/5 pb-3">
            <Lock className="w-4 h-4 text-[#d4af37]" />
            <span>Administrator Credentials (/admin)</span>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
              Admin Username *
            </label>
            <input
              type="text"
              required
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
              Admin Password *
            </label>
            <input
              type="text"
              required
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#164e32] hover:bg-[#1e6341] text-white rounded font-semibold uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-lg shadow-[#164e32]/25"
          >
            {adminSaved ? <Check className="w-4 h-4 text-[#d4af37]" /> : <Key className="w-4 h-4" />}
            <span>{adminSaved ? 'Admin Credentials Updated!' : 'Update Admin Credentials'}</span>
          </button>
        </form>

        {/* Employee Credentials */}
        <form onSubmit={handleSaveStaff} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold uppercase tracking-wider text-sm border-b border-white/5 pb-3">
            <Shield className="w-4 h-4 text-[#d4af37]" />
            <span>Staff Credentials (/database)</span>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
              Staff Username *
            </label>
            <input
              type="text"
              required
              value={staffUsername}
              onChange={(e) => setStaffUsername(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-medium">
              Staff Password *
            </label>
            <input
              type="text"
              required
              value={staffPassword}
              onChange={(e) => setStaffPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#164e32] hover:bg-[#1e6341] text-white rounded font-semibold uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-lg shadow-[#164e32]/25"
          >
            {staffSaved ? <Check className="w-4 h-4 text-[#d4af37]" /> : <Key className="w-4 h-4" />}
            <span>{staffSaved ? 'Staff Credentials Updated!' : 'Update Staff Credentials'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
