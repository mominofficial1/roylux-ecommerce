import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-zinc-300 text-xs sm:text-sm font-light leading-relaxed">
      <div className="border-b border-white/10 pb-6">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
          Legal & Trust
        </span>
        <h1 className="text-3xl font-light text-white uppercase tracking-tight font-serif-luxury mt-1">
          Privacy Policy
        </h1>
      </div>

      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">1. Information Collection</h2>
          <p>
            RoyLux collects necessary customer information solely to fulfill orders, process delivery logistics, and provide concierge customer support. Information collected includes customer full name, contact mobile number, delivery address in Bangladesh, and optional email for digital invoice delivery.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">2. Delivery Logistics Sharing</h2>
          <p>
            Your shipping destination details are shared strictly with certified courier logistics partners (such as Steadfast, Pathao, or RedX) solely for the fulfillment of your package.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">3. Payment Security</h2>
          <p>
            Payment transactions made via mobile financial services (bKash, Nagad) or cards are encrypted using industry-standard protocols. RoyLux never stores private PINs or bank credentials.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">4. Contact & Inquiries</h2>
          <p>
            For any inquiries regarding your private data or order history, reach our concierge at <span className="text-white">concierge@roylux.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
