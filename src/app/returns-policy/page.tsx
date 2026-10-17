'use client';

import React from 'react';
import Link from 'next/link';
import { RotateCcw, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function ReturnsPolicyPage() {
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
          <RotateCcw className="w-4 h-4" />
          <span>Pharmacy Fulfilment</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Returns and Cancellation Policy
        </h1>
        <p className="text-xs text-gray-500">
          Dr. Praveen’s Homoeopathy Clinic & Pharmacy • Bengaluru, Karnataka
        </p>
      </div>

      <div className="prose prose-sm max-w-none text-gray-700 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900">1. Pharmaceutical Product Integrity</h2>
          <p>
            In accordance with Indian pharmaceutical regulations, hygiene guidelines, and clinical safety standards, homoeopathic medicines, dilutions, mother tinctures, and medicated globules cannot be returned or restocked once dispensed and opened, in order to prevent contamination and safeguard public health.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900">2. Order Cancellations</h2>
          <p>
            Because orders are coordinated directly via WhatsApp or phone, you may cancel or modify your requested items at any time before the pharmacy packages and dispatches the products or before in-clinic pickup.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900">3. Damaged or Discrepant Deliveries</h2>
          <p>
            If any sealed manufacturer product arrives damaged in transit or differs from the verified item requested in your WhatsApp confirmation, please photograph the package and notify the pharmacy on WhatsApp (<strong>+91 9052523835</strong>) within 24 hours of receipt. We will promptly inspect and issue an appropriate replacement.
          </p>
        </section>
      </div>
    </div>
  );
}
