import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-stone-700 text-xs sm:text-sm font-light leading-relaxed">
      <div className="border-b border-stone-200 pb-6">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#8a7226] font-semibold">
          Legal & Operations
        </span>
        <h1 className="text-3xl font-light text-[#121212] uppercase tracking-tight font-serif-luxury mt-1">
          Terms & Conditions
        </h1>
      </div>

      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#121212]">1. Orders & Pricing</h2>
          <p>
            All prices listed on RoyLux are in Bangladeshi Taka (BDT) and inclusive of applicable taxes. An order is confirmed upon submission, and our fulfillment team initiates verification promptly.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#121212]">2. Delivery Policy</h2>
          <p>
            Standard deliveries inside Dhaka are fulfilled within 24 to 48 hours for ৳60. Outside Dhaka deliveries are fulfilled within 2 to 4 business days for ৳120. In the event of unforeseen regional disruptions, customer will be notified via phone.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#121212]">3. Exchange & Returns</h2>
          <p>
            Customers may request a size exchange or return within 7 calendar days from delivery, provided the garment remains unwashed, unworn, and with all original RoyLux tags intact.
          </p>
        </section>
      </div>
    </div>
  );
}
