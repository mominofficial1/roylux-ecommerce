import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-zinc-300 text-xs sm:text-sm font-light leading-relaxed">
      <div className="border-b border-white/10 pb-6">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
          Legal & Operations
        </span>
        <h1 className="text-3xl font-light text-white uppercase tracking-tight font-serif-luxury mt-1">
          Terms & Conditions
        </h1>
      </div>

      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">1. Orders & Pricing</h2>
          <p>
            All prices listed on RoyLux are in Bangladeshi Taka (BDT) and inclusive of applicable taxes. An order is confirmed upon submission, and our fulfillment team initiates verification promptly.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">2. Delivery Policy</h2>
          <p>
            Standard deliveries inside Dhaka are fulfilled within 24 to 48 hours for ৳60. Outside Dhaka deliveries are fulfilled within 2 to 4 business days for ৳120. In the event of unforeseen regional disruptions, customer will be notified via phone.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">3. Exchange & Returns</h2>
          <p>
            Customers may request a size exchange or return within 7 calendar days from delivery, provided the garment remains unwashed, unworn, and with all original RoyLux tags intact.
          </p>
        </section>
      </div>
    </div>
  );
}
