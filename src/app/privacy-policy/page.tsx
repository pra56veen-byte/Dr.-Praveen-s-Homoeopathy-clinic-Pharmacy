'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
          <ShieldCheck className="w-4 h-4" />
          <span>Legal & Data Privacy</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-gray-500">
          Dr. Praveen’s Homoeopathy Clinic & Pharmacy • Bengaluru, Karnataka, India
        </p>
      </div>

      <div className="prose prose-sm max-w-none text-gray-700 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900">1. Introduction</h2>
          <p>
            At <strong>Dr. Praveen’s Homoeopathy Clinic & Pharmacy</strong> (“we,” “our,” or “us”), we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy outlines how we handle customer details collected via our website and WhatsApp communication channels.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900">2. Information We Collect</h2>
          <p>
            Because we do not require account registration or login for customers, we only collect information that you voluntarily provide when placing an enquiry:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Customer Name:</strong> Required on the shopping cart order summary to personalize your WhatsApp order enquiry.</li>
            <li><strong>Locality or Delivery Area:</strong> Optional locality notes provided to assess delivery options or in-clinic pickup in Bengaluru.</li>
            <li><strong>Appointment Information:</strong> Name, contact phone number, and preferred consultation timings submitted through our doctor appointment form.</li>
            <li><strong>Shopping Cart Contents:</strong> Product IDs and quantities stored locally in your browser’s localStorage.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900">3. How Your Information is Used</h2>
          <p>
            Your information is used solely to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Generate your pre-filled WhatsApp enquiry message to our pharmacy team.</li>
            <li>Verify medicine availability, batch details, and pricing at our pharmacy counter in Bengaluru.</li>
            <li>Contact you to confirm doctor consultation slots.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900">4. Third-Party Communications & WhatsApp</h2>
          <p>
            Our ordering and appointment inquiries use WhatsApp click-to-chat links (`wa.me`). Once you navigate to WhatsApp, your interaction is governed by WhatsApp LLC’s privacy policy and end-to-end encryption standards. We do not sell, rent, or trade your personal or health data to advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900">5. Contacting Us</h2>
          <p>
            If you have questions regarding this Privacy Policy or your personal information, please contact Dr. Praveen’s Homoeopathy Clinic & Pharmacy at <strong>+91 9052523835</strong> or email <strong>drpraveen.homoeopathy@gmail.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
