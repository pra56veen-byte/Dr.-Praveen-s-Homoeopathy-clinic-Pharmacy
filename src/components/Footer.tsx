'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, MapPin, Clock, ShieldAlert, Heart, ExternalLink } from 'lucide-react';
import { getStoreSettings } from '@/lib/store';
import { StoreSettings } from '@/types';
import { DEFAULT_STORE_SETTINGS } from '@/lib/initialData';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);

  useEffect(() => {
    getStoreSettings().then(setSettings);
    const handleUpdate = () => {
      getStoreSettings().then(setSettings);
    };
    window.addEventListener('drp_store_updated', handleUpdate);
    return () => window.removeEventListener('drp_store_updated', handleUpdate);
  }, []);

  const primaryWa = `https://wa.me/${settings.primary_whatsapp}?text=${encodeURIComponent("Hello Dr. Praveen's Homoeopathy Clinic & Pharmacy, I would like to enquire about products.")}`;
  const alternateWa = `https://wa.me/${settings.alternate_whatsapp}?text=${encodeURIComponent("Hello Dr. Praveen's Homoeopathy Clinic & Pharmacy, I would like to enquire about products.")}`;

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-gray-800">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-0.5 overflow-hidden flex-shrink-0 shadow-xs border border-gray-700">
                {settings.logo_url ? (
                  <img src={settings.logo_url} alt="" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full rounded-full bg-brand-blue flex items-center justify-center text-white font-bold text-sm">
                    Dr.P
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-white font-bold text-base leading-tight">
                  {settings.clinic_name}
                </h3>
                <p className="text-brand-green text-xs font-semibold">
                  {settings.tagline}
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Trusted homoeopathic healthcare, authentic dilutions, mother tinctures, and wellness essentials serving Bengaluru, Karnataka, and beyond through convenient WhatsApp order enquiries.
            </p>
            <div className="pt-2 space-y-1 text-xs text-gray-400">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-green flex-shrink-0 mt-0.5" />
                <span>120, 5th Cross, Kada Agrahara Main Rd, Vinayaka Layout, Byappanahalli, Bengaluru 560049</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Medicines & Products
                </Link>
              </li>
              <li>
                <Link href="/appointment" className="hover:text-white transition-colors">
                  Doctor Appointment Enquiry
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Shopping Cart & WhatsApp Order
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-400 hover:text-brand-blue transition-colors flex items-center gap-1">
                  <span>Administrator Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details & WhatsApp */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Pharmacy & Clinic Contact
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-gray-400">Primary WhatsApp:</span>
                  <a
                    href={primaryWa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-medium hover:text-brand-green transition-colors"
                  >
                    +{settings.primary_whatsapp}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-brand-green/80 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-gray-400">Alternate WhatsApp:</span>
                  <a
                    href={alternateWa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-brand-green transition-colors"
                  >
                    +{settings.alternate_whatsapp}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-gray-400">Direct Telephone:</span>
                  <a
                    href={`tel:${settings.primary_phone}`}
                    className="text-white font-medium hover:text-brand-blue transition-colors"
                  >
                    {settings.primary_phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-gray-400">Clinic Timings:</span>
                  <span className="text-xs text-gray-300 leading-snug block">
                    {settings.clinic_hours}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Policies & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/returns-policy" className="hover:text-white transition-colors">
                  Returns & Cancellation
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white transition-colors">
                  Healthcare & Medicine Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Medicine & Medical Safety Disclaimer */}
        <div className="mt-8 p-4 rounded-xl bg-gray-950 border border-gray-800/80 text-xs text-gray-400 space-y-2">
          <div className="flex items-center gap-2 text-yellow-400 font-semibold">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>Important Healthcare Information & Medicine Disclaimer</span>
          </div>
          <p className="leading-relaxed">
            Homoeopathic remedies and formulations listed on this website are intended for verified prescription fulfilment and availability inquiries at Dr. Praveen’s Homoeopathy Clinic & Pharmacy, Bengaluru. This platform does not provide automated self-medication, medical diagnosis, or emergency treatments. All product availability and final prices are confirmed directly by the pharmacy team before fulfilment. Always consult a qualified registered homoeopathic practitioner for health evaluation.
          </p>
        </div>

        {/* Copyright and signature */}
        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} {settings.clinic_name}. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-gray-400 flex-wrap justify-center">
            <span>{settings.tagline}</span>
            <span>•</span>
            <span>Bengaluru, Karnataka, India</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
