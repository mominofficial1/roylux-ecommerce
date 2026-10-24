'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Package,
  RotateCcw,
  MapPin,
  ArrowRight,
  LogOut,
  Mail,
  Phone,
  Lock,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import RoyLuxStore from '@/lib/store';
import { CustomerUser, Order } from '@/lib/types';
import { BANGLADESH_DIVISIONS } from '@/lib/locations';

export default function AccountPage() {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDivision, setRegDivision] = useState('Dhaka');
  const [regDistrict, setRegDistrict] = useState('Dhaka');
  const [regArea, setRegArea] = useState('');
  const [regFullAddress, setRegFullAddress] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  const loadData = () => {
    const current = RoyLuxStore.getCurrentCustomer();
    setCustomer(current);
    const allOrders = RoyLuxStore.getOrders();
    if (current) {
      // Filter orders by customer mobile or email
      const customerOrders = allOrders.filter(
        (o) =>
          (o.customer.email && o.customer.email.toLowerCase() === current.email.toLowerCase()) ||
          (o.customer.mobile && o.customer.mobile === current.mobile)
      );
      setOrders(customerOrders.length > 0 ? customerOrders : allOrders);
    } else {
      setOrders(allOrders);
    }
  };

  useEffect(() => {
    loadData();
    const handleAuth = () => loadData();
    window.addEventListener('roylux-auth-updated', handleAuth);
    return () => window.removeEventListener('roylux-auth-updated', handleAuth);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both your email/mobile and password.');
      return;
    }

    const res = RoyLuxStore.loginCustomer(loginIdentifier, loginPassword);
    if (res.success && res.customer) {
      setLoginSuccess(res.message);
      setCustomer(res.customer);
    } else {
      setLoginError(res.message);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regFullName.trim() || !regEmail.trim() || !regMobile.trim() || !regPassword.trim()) {
      setRegError('Please fill in all required fields.');
      return;
    }

    const res = RoyLuxStore.registerCustomer({
      fullName: regFullName,
      email: regEmail,
      mobile: regMobile,
      password: regPassword,
      address: {
        division: regDivision,
        district: regDistrict,
        area: regArea,
        fullAddress: regFullAddress,
      },
    });

    if (res.success && res.customer) {
      setRegSuccess(res.message);
      setCustomer(res.customer);
    } else {
      setRegError(res.message);
    }
  };

  const handleLogout = () => {
    RoyLuxStore.logoutCustomer();
    setCustomer(null);
  };

  const handleDivisionChange = (newDiv: string) => {
    setRegDivision(newDiv);
    const divObj = BANGLADESH_DIVISIONS.find((d) => d.name === newDiv);
    if (divObj && divObj.districts.length > 0) {
      setRegDistrict(divObj.districts[0]);
    }
  };

  // If customer is LOGGED IN: Show Customer Profile Dashboard
  if (customer) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-[#fbfaf8] text-black">
        {/* Account Header */}
        <div className="border-b border-stone-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white border border-stone-300 flex items-center justify-center text-black shadow-sm text-xl font-serif-luxury font-bold">
              {customer.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#8a7226] font-semibold">
                RoyLux Client Profile
              </span>
              <h1 className="text-2xl sm:text-3xl font-light text-black uppercase tracking-tight font-serif-luxury mt-0.5">
                {customer.fullName}
              </h1>
              <p className="text-xs text-stone-500 font-mono mt-0.5">
                {customer.email} • {customer.mobile}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="px-4 py-2 bg-[#121212] text-white hover:bg-stone-800 rounded text-xs font-semibold uppercase tracking-wider transition shadow-sm"
            >
              Browse Shop
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1.5 border border-stone-200"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Saved Shipping Details Card */}
        {customer.address && (
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2 text-xs">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#121212] uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-[#8a7226]" />
              <span>Default Delivery Address</span>
            </div>
            <p className="text-stone-700 leading-relaxed">
              {customer.address.fullAddress ? `${customer.address.fullAddress}, ` : ''}
              {customer.address.area ? `${customer.address.area}, ` : ''}
              {customer.address.district}, {customer.address.division}
            </p>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/account/orders"
            className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-black transition group shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-black mb-4">
              <Package className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-black group-hover:text-[#8a7226] transition">
              My Orders ({orders.length})
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Track fulfillment status, view receipts, and delivery updates.
            </p>
          </Link>

          <Link
            href="/return"
            className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-black transition group shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-black mb-4">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-black group-hover:text-[#8a7226] transition">
              Returns &amp; Exchanges
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Initiate 7-day size exchanges, replacement requests, or refunds.
            </p>
          </Link>

          <Link
            href="/shop"
            className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-black transition group shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-black mb-4">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-black group-hover:text-[#8a7226] transition">
              Winter Drops 2026
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Explore pure cream, charcoal, and forest green fleece collections.
            </p>
          </Link>
        </div>

        {/* Recent Orders Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm uppercase tracking-widest font-semibold text-[#121212]">
              Order History
            </h3>
            <Link
              href="/account/orders"
              className="text-xs uppercase tracking-wider font-semibold text-[#8a7226] hover:underline"
            >
              View All Orders →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-stone-200 text-center space-y-3">
              <Package className="w-10 h-10 text-stone-400 mx-auto" />
              <p className="text-xs text-stone-600">You have no active orders yet.</p>
              <Link
                href="/shop"
                className="inline-block px-5 py-2 bg-[#121212] text-white text-xs uppercase font-semibold rounded"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-xl bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <span className="font-mono font-bold text-black">{order.orderNumber}</span>
                    <p className="text-stone-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item(s)
                    </p>
                    <p className="text-stone-700">Total: ৳{order.total.toLocaleString()} ({order.paymentMethod.toUpperCase()})</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.orderStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="px-3.5 py-1.5 bg-[#121212] text-white rounded text-[11px] uppercase font-semibold hover:bg-stone-800 transition"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // If customer is NOT LOGGED IN: Show Luxury Sign In & Register Modal Tabs
  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#8a7226] font-semibold">
          RoyLux Member Concierge
        </span>
        <h1 className="text-2xl sm:text-3xl font-light text-[#121212] uppercase tracking-tight font-serif-luxury">
          {activeTab === 'signin' ? 'Sign In to Your Account' : 'Create a RoyLux Account'}
        </h1>
        <p className="text-xs text-stone-500 font-light">
          Manage your orders, track shipments, and access priority winter drops.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-md space-y-6">
        <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-lg text-xs font-semibold uppercase tracking-wider text-center">
          <button
            onClick={() => setActiveTab('signin')}
            className={`py-2 rounded-md transition ${
              activeTab === 'signin' ? 'bg-white text-[#121212] shadow-sm' : 'text-stone-500 hover:text-black'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`py-2 rounded-md transition ${
              activeTab === 'register' ? 'bg-white text-[#121212] shadow-sm' : 'text-stone-500 hover:text-black'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* SIGN IN TAB */}
        {activeTab === 'signin' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}
            {loginSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{loginSuccess}</span>
              </div>
            )}

            <div>
              <label className="block uppercase tracking-wider text-stone-600 mb-1 font-medium">
                Email Address or Mobile Number *
              </label>
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="customer@example.com or 01XXXXXXXXX"
                className="w-full bg-[#faf9f6] border border-stone-300 rounded px-3.5 py-2.5 text-[#121212] placeholder-stone-400 focus:outline-none focus:border-[#121212]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-stone-600 mb-1 font-medium">
                Password *
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#faf9f6] border border-stone-300 rounded px-3.5 py-2.5 text-[#121212] placeholder-stone-400 focus:outline-none focus:border-[#121212]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#121212] hover:bg-black text-white rounded text-xs uppercase font-semibold tracking-[0.2em] transition shadow-md"
            >
              Sign In
            </button>
          </form>
        )}

        {/* REGISTER TAB */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            {regError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}
            {regSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{regSuccess}</span>
              </div>
            )}

            <div>
              <label className="block uppercase tracking-wider text-stone-600 mb-1 font-medium">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                placeholder="e.g. Tanvir Ahmed"
                className="w-full bg-[#faf9f6] border border-stone-300 rounded px-3.5 py-2.5 text-[#121212] placeholder-stone-400 focus:outline-none focus:border-[#121212]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block uppercase tracking-wider text-stone-600 mb-1 font-medium">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full bg-[#faf9f6] border border-stone-300 rounded px-3.5 py-2.5 text-[#121212] placeholder-stone-400 focus:outline-none focus:border-[#121212]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-stone-600 mb-1 font-medium">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={regMobile}
                  onChange={(e) => setRegMobile(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-[#faf9f6] border border-stone-300 rounded px-3.5 py-2.5 text-[#121212] placeholder-stone-400 focus:outline-none focus:border-[#121212]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block uppercase tracking-wider text-stone-600 mb-1 font-medium">
                  Division
                </label>
                <select
                  value={regDivision}
                  onChange={(e) => handleDivisionChange(e.target.value)}
                  className="w-full bg-[#faf9f6] border border-stone-300 rounded px-3 py-2.5 text-[#121212] focus:outline-none focus:border-[#121212]"
                >
                  {BANGLADESH_DIVISIONS.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-stone-600 mb-1 font-medium">
                  District
                </label>
                <select
                  value={regDistrict}
                  onChange={(e) => setRegDistrict(e.target.value)}
                  className="w-full bg-[#faf9f6] border border-stone-300 rounded px-3 py-2.5 text-[#121212] focus:outline-none focus:border-[#121212]"
                >
                  {BANGLADESH_DIVISIONS.find((d) => d.name === regDivision)?.districts.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-stone-600 mb-1 font-medium">
                Full Delivery Address
              </label>
              <input
                type="text"
                value={regFullAddress}
                onChange={(e) => setRegFullAddress(e.target.value)}
                placeholder="House, Road, Area (e.g. House 14, Road 5, Gulshan-1)"
                className="w-full bg-[#faf9f6] border border-stone-300 rounded px-3.5 py-2.5 text-[#121212] placeholder-stone-400 focus:outline-none focus:border-[#121212]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-stone-600 mb-1 font-medium">
                Password *
              </label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Choose a strong password"
                className="w-full bg-[#faf9f6] border border-stone-300 rounded px-3.5 py-2.5 text-[#121212] placeholder-stone-400 focus:outline-none focus:border-[#121212]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#121212] hover:bg-black text-white rounded text-xs uppercase font-semibold tracking-[0.2em] transition shadow-md"
            >
              Create Account &amp; Save
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
