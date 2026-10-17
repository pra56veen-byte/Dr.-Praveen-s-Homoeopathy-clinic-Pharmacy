'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Homepage</span>
      </Link>

      <div className="space-y-2 border-b border-gray-200 pb-6">
        <div className="inline-flex items-center gap-1.5 text-brand-blue text-xs font-bold uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Terms of Use</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Terms and Conditions
        </h1>
        <p className="text-xs text-gray-500">
          Dr. Praveen’s Homoeopathy Clinic & Pharmacy • Bengaluru, Karnataka
        </p>
      </div>

      <div className="prose prose-sm max-w-none text-gray-700 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900">1. Nature of the Website</h2>
          <p>
            The website for <strong>Dr. Praveen’s Homoeopathy Clinic & Pharmacy</strong> serves as an informational catalogue, doctor appointment enquiry portal, and WhatsApp product enquiry service. Browsing this site or launching WhatsApp does not establish an automatic contractual order until verified and accepted by the pharmacy staff.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900">2. Medicine Availability and Pricing</h2>
          <p>
            All listed MRPs, selling prices, and pack sizes are verified according to manufacturer packaging (SBL, Dr. Reckeweg, Schwabe, Baksons, etc.). However, product availability in homoeopathic potencies (e.g., 30C, 200C, 1M, Q) may fluctuate. All orders and applicable local delivery or courier charges are confirmed directly over WhatsApp or telephone prior to dispatch or clinic collection.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900">3. Prescription Compliance</h2>
          <p>
            Certain homoeopathic remedies and formulations may require a valid prescription from a registered medical practitioner under applicable Indian drug regulations. The pharmacy reserves the right to request a copy of a physician prescription prior to dispensing regulated preparations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900">4. WhatsApp Click-to-Chat Service</h2>
          <p>
            When you click “Place Order on WhatsApp” or “Book Appointment Enquiry”, you are redirected to WhatsApp with a pre-filled enquiry. The pharmacy team will interact directly with you to verify items, batch numbers, and fulfilment arrangements.
          </p>
        </section>
      </div>
    </div>
  );
}
