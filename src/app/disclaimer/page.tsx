'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, HeartPulse, Stethoscope } from 'lucide-react';

export default function DisclaimerPage() {
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
        <div className="inline-flex items-center gap-1.5 text-yellow-600 text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Healthcare Safety & Compliance</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Medicine & Medical Advice Disclaimer
        </h1>
        <p className="text-xs text-gray-500">
          Dr. Praveen’s Homoeopathy Clinic & Pharmacy • Bengaluru, Karnataka, India
        </p>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs sm:text-sm text-amber-900 space-y-2 leading-relaxed">
        <strong className="font-bold block text-sm text-amber-950 flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-amber-700" />
          <span>Critical Healthcare Notice</span>
        </strong>
        <p>
          The content, catalogue listings, product descriptions, potencies, and information displayed on this website are provided strictly for educational reference and inventory inquiry purposes at Dr. Praveen’s Homoeopathy Clinic & Pharmacy in Bengaluru. It is not intended as medical advice, clinical diagnosis, or treatment instructions.
        </p>
      </div>

      <div className="prose prose-sm max-w-none text-gray-700 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900">1. Individualized Homoeopathic Treatment</h2>
          <p>
            Homoeopathy is a holistic system of medicine based on individual symptom similarity, constitutional assessment, and specific remedy potencies (e.g., 30C, 200C, 1M, LM, Q). Self-prescription without consulting a qualified practitioner is strongly discouraged. We urge all patients to consult <strong>Dr. Praveen, Homoeopathic Physician</strong>, or another qualified registered homoeopathic practitioner before initiating any remedy.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900">2. Emergency Medical Care</h2>
          <p>
            This website, its shopping cart, and its WhatsApp communication channels are not equipped for emergency care, trauma response, or urgent acute distress. In the event of a medical emergency, please proceed immediately to the nearest hospital emergency room or contact local medical emergency services in your area.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900">3. Verified Manufacturer Information</h2>
          <p>
            Remedies stocked in our pharmacy are sourced exclusively from licensed pharmaceutical manufacturers adhering to Good Manufacturing Practices (GMP) and the Homoeopathic Pharmacopoeia of India (HPI) and German Homoeopathic Pharmacopoeia (GHP). If specific batch, expiration, or compositional details are not listed on a product card, please contact the pharmacy counter directly on WhatsApp (<strong>+91 9052523835</strong>) for verified batch documentation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900">4. Storage Guidelines</h2>
          <p>
            Homoeopathic dilutions, globules, and mother tinctures are sensitive to intense light, strong temperatures, and volatile substances. Keep remedies stored in a cool, dry place away from direct sunlight, camphor, eucalyptus, and strong perfumes.
          </p>
        </section>
      </div>
    </div>
  );
}
