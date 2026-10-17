'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Calendar, MessageSquare, Search, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { StoreSettings } from '@/types';

interface HeroProps {
  settings: StoreSettings;
}

export const Hero: React.FC<HeroProps> = ({ settings }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white border-b border-gray-100">
      {/* Optional video background if configured */}
      {settings.hero_video_url && (
        <div className="absolute inset-0 z-0 overflow-hidden opacity-20 pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={settings.hero_video_url} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px]"></div>
        </div>
      )}

      {/* Decorative gradient blur background */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-green/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Medical Symbols in Background (Authentic Caduceus & Homoeopathy Cross) */}
      <div className="absolute right-4 sm:right-16 top-6 w-64 h-64 sm:w-88 sm:h-88 opacity-[0.05] pointer-events-none select-none z-0">
        <img
          src="/medical-caduceus.png"
          alt=""
          className="w-full h-full object-contain filter grayscale"
        />
      </div>
      <div className="absolute -left-10 bottom-4 w-52 h-52 sm:w-72 sm:h-72 opacity-[0.06] pointer-events-none select-none z-0">
        <img
          src="/homeopathy-cross.png"
          alt=""
          className="w-full h-full object-contain"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Content */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6 text-center lg:text-left">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-green/40 shadow-xs text-xs font-semibold text-brand-charcoal">
              <span className="w-2 h-2 rounded-full bg-brand-green"></span>
              <span className="text-brand-blue font-bold">{settings.tagline}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-600 flex items-center gap-1 font-normal">
                <MapPin className="w-3 h-3 text-brand-green" />
                Bengaluru, Karnataka
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight sm:leading-tight">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-800">
                {settings.clinic_name}
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Explore homoeopathic preparations, healthcare essentials and personal care products in one convenient place. Enjoy fast WhatsApp order inquiries and personalized doctor consultations.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Explore Products</span>
              </Link>

              <Link
                href="/appointment"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <Calendar className="w-5 h-5" />
                <span>Book a Doctor Appointment</span>
              </Link>
            </div>

            {/* Service Indicators */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/80 border border-gray-100 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-brand-green flex-shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-gray-800 leading-tight">
                  Convenient WhatsApp Ordering
                </span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/80 border border-gray-100 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-brand-blue flex-shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-gray-800 leading-tight">
                  Easy Product Search
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center gap-2 p-2 rounded-lg bg-white/80 border border-gray-100 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-brand-blue flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-gray-800 leading-tight">
                  Doctor Appointment Enquiries
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Doctor & Clinic Portrait */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-full max-w-sm bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xl">
              <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-blue-100 to-green-50 overflow-hidden shadow-xs border border-gray-200/80">
                <img
                  src={settings.doctor_photo_url || '/dr-praveen.jpg'}
                  alt="Dr. Praveen - Homoeopathic Physician"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-gray-950/85 via-gray-950/40 to-transparent p-3.5 pt-7 text-white text-left">
                  <h3 className="font-bold text-sm leading-tight text-white drop-shadow-sm">
                    Dr. Praveen
                  </h3>
                  <p className="text-[11px] text-green-300 font-semibold flex items-center gap-1">
                    <span>Homoeopathic Physician & Consultant</span>
                  </p>
                  <p className="text-[10px] text-blue-100 mt-0.5">
                    120, Byappanahalli, Bengaluru 560049
                  </p>
                </div>
              </div>

              {/* Pharmacy Info Card */}
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Pharmacy Counter:</span>
                  <span className="font-semibold text-green-700">Open for Orders</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Primary WhatsApp:</span>
                  <span className="font-mono font-medium text-gray-900">+{settings.primary_whatsapp}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Alternate WhatsApp:</span>
                  <span className="font-mono font-medium text-gray-900">+{settings.alternate_whatsapp}</span>
                </div>
                <div className="pt-1.5 border-t border-gray-100 text-[10px] text-gray-500 text-center">
                  Monthly visiting at Hyderabad &amp; Narasaraopet
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
