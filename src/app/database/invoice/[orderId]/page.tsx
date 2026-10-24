'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Printer, ArrowLeft, CheckCircle2, Download } from 'lucide-react';
import RoyLuxStore from '@/lib/store';
import { Order, SiteSettings } from '@/lib/types';
import { generateInvoicePDF } from '@/lib/pdfInvoice';

export const dynamic = 'force-dynamic';

export default function InvoicePrintPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(RoyLuxStore.getSettings());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      const found = RoyLuxStore.getOrderById(orderId);
      if (found) {
        setOrder(found);
      }
      setSettings(RoyLuxStore.getSettings());
    }
    setLoading(false);
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center text-sm">
        Generating official invoice...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white text-black p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Invoice Not Found</h2>
        <p className="text-sm text-gray-600">The requested order &quot;{orderId}&quot; could not be located.</p>
        <Link
          href="/database/dashboard"
          className="inline-block px-4 py-2 bg-black text-white text-xs rounded uppercase tracking-wider"
        >
          Return to Database
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 py-6 sm:py-10 px-4 print:bg-white print:p-0">
      {/* Top Controls Bar (Hidden during print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/database/dashboard"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Database</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => generateInvoicePDF(order, settings)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#164e32] hover:bg-[#1f6643] text-white font-semibold text-xs tracking-wider uppercase transition shadow-lg border border-green-500/30"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#d4af37] hover:bg-[#b8952b] text-black font-semibold text-xs tracking-wider uppercase transition shadow-lg"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Sheet (Standard A4 Proportion) */}
      <div className="max-w-4xl mx-auto bg-white text-black p-8 sm:p-12 rounded-xl shadow-2xl print:shadow-none print:p-6 print:rounded-none border border-gray-200 print:border-none">
        {/* Brand Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between pb-8 border-b-2 border-black gap-6">
          <div className="space-y-2">
            <div className="relative w-40 h-10">
              <Image
                src="/images/logo/roylux-logo.png"
                alt="RoyLux"
                fill
                className="object-contain filter invert"
                priority
              />
            </div>
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-gray-700">
              Premium Lifestyle &amp; Apparel
            </p>
            <div className="text-xs text-gray-600 space-y-0.5 pt-1">
              <p>{settings.address || 'Dhaka, Bangladesh'}</p>
              <p>Hotline: {settings.phone || '+880 1700-000000'} | Web: roylux.com</p>
              <p>Email: {settings.email || 'support@roylux.com'}</p>
            </div>
          </div>

          <div className="text-right space-y-1 sm:self-center">
            <h1 className="text-2xl sm:text-3xl font-serif tracking-tight uppercase font-bold text-black">
              INVOICE
            </h1>
            <div className="text-xs text-gray-700 space-y-0.5">
              <p>
                <span className="font-semibold text-black">Invoice #:</span> {order.orderNumber}
              </p>
              <p>
                <span className="font-semibold text-black">Date:</span>{' '}
                {new Date(order.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
              <p>
                <span className="font-semibold text-black">Payment:</span>{' '}
                <span className="uppercase font-medium">
                  {order.paymentMethod.replace(/_/g, ' ')} ({order.paymentStatus})
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Bill To & Delivery Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-6 border-b border-gray-200 text-xs">
          <div>
            <h3 className="font-bold uppercase tracking-wider text-black text-[11px] mb-2">
              Billed &amp; Delivered To:
            </h3>
            <div className="text-gray-800 space-y-1">
              <p className="text-sm font-bold text-black">{order.customer.fullName}</p>
              <p className="font-medium text-gray-900">Phone: {order.customer.mobile}</p>
              {order.customer.email && <p>Email: {order.customer.email}</p>}
              <p className="pt-1">{order.customer.fullAddress}</p>
              <p>
                {order.customer.area ? `${order.customer.area}, ` : ''}
                {order.customer.district}, {order.customer.division}
                {order.customer.postalCode ? ` - ${order.customer.postalCode}` : ''}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold uppercase tracking-wider text-black text-[11px] mb-2">
              Dispatch &amp; Handling Information:
            </h3>
            <div className="text-gray-700 text-xs space-y-1">
              <p>
                <span className="font-medium text-black">Delivery Zone:</span>{' '}
                {order.deliveryArea === 'dhaka' ? 'Inside Dhaka City' : 'Outside Dhaka Nationwide'}
              </p>
              <p>
                <span className="font-medium text-black">Order Channel:</span>{' '}
                {order.source === 'manual_employee'
                  ? `Manual Staff Entry (${order.employeeName || 'Staff'})`
                  : 'RoyLux Online Storefront'}
              </p>
              <p>
                <span className="font-medium text-black">Order Status:</span>{' '}
                <span className="uppercase font-semibold text-black">
                  {order.orderStatus.replace(/_/g, ' ')}
                </span>
              </p>
              {order.customer.notes && (
                <p className="pt-2 text-gray-500 italic">
                  Note: &quot;{order.customer.notes}&quot;
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-6 border-b border-gray-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-black text-black uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-2">#</th>
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3 text-center">Size</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 px-2 text-gray-500">{idx + 1}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-black">{item.name}</div>
                    {item.color && (
                      <div className="text-[10px] text-gray-500">Color: {item.color}</div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-medium text-gray-900">
                    {item.size}
                  </td>
                  <td className="py-3 px-3 text-right text-gray-700">
                    ৳{item.price.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-center text-gray-700">{item.quantity}</td>
                  <td className="py-3 px-3 text-right font-semibold text-black">
                    ৳{item.subtotal.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculations / Summary */}
        <div className="py-6 flex justify-end">
          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Items Subtotal:</span>
              <span className="font-medium text-black">৳{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee ({order.deliveryArea === 'dhaka' ? 'Dhaka' : 'Outside Dhaka'}):</span>
              <span className="font-medium text-black">৳{order.deliveryCharge.toLocaleString()}</span>
            </div>
            {order.discountAmount ? (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Discount Applied:</span>
                <span>- ৳{order.discountAmount.toLocaleString()}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-base font-bold text-black pt-3 border-t-2 border-black">
              <span>Total Payable:</span>
              <span>৳{order.total.toLocaleString()}</span>
            </div>
            <div className="text-[11px] text-right text-gray-500 italic pt-1">
              Payment Status:{' '}
              <span className="font-semibold uppercase text-black">{order.paymentStatus}</span>
            </div>
          </div>
        </div>

        {/* Terms & Return Policy */}
        <div className="pt-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-[10px] text-gray-500">
          <div>
            <h4 className="font-semibold text-black uppercase tracking-wider mb-1">
              RoyLux Return &amp; Exchange Guarantee
            </h4>
            <p>
              Items may be exchanged for size or returned within 7 days of delivery provided all
              hangtags, labels, and original protective packaging remain uncompromised. Submit return
              requests online at roylux.com/return.
            </p>
          </div>
          <div className="flex flex-col justify-end items-end sm:text-right pt-4 sm:pt-0">
            <div className="w-48 border-b border-black pb-1 mb-1 text-center font-serif text-xs text-black">
              RoyLux Authorized
            </div>
            <p className="text-[9px] uppercase tracking-widest text-gray-500">
              Authorized Signature &amp; Stamp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
