'use client';

import React, { useState } from 'react';
import {
  Database,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Key,
  Server,
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function AdminSetupPage() {
  const [copied, setCopied] = useState(false);
  const isConnected = isSupabaseConfigured();

  const sqlSchema = `-- =========================================================================
-- Dr. Praveen’s Homoeopathy Clinic & Pharmacy
-- Supabase Schema & Row-Level Security
-- =========================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_name TEXT DEFAULT 'Sparkles',
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name TEXT,
    potency TEXT,
    pack_size TEXT NOT NULL,
    mrp NUMERIC(10, 2) NOT NULL DEFAULT 0,
    selling_price NUMERIC(10, 2) NOT NULL,
    discount_percentage INTEGER DEFAULT 0,
    image_url TEXT,
    is_in_stock BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    is_sample BOOLEAN DEFAULT FALSE,
    description TEXT,
    manufacturer TEXT,
    ingredients TEXT,
    directions_for_use TEXT,
    warnings_and_storage TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    clinic_name TEXT NOT NULL DEFAULT 'Dr. Praveen’s Homoeopathy clinic & Pharmacy',
    tagline TEXT NOT NULL DEFAULT 'Treating the root Cause - Not just the symptoms',
    primary_whatsapp TEXT NOT NULL DEFAULT '919052523835',
    alternate_whatsapp TEXT NOT NULL DEFAULT '917732062291',
    primary_phone TEXT NOT NULL DEFAULT '+91 9052523835',
    email TEXT DEFAULT 'drpraveen.homoeopathy@gmail.com',
    address_line1 TEXT DEFAULT '120, 5th Cross, Kada Agrahara Main Rd',
    address_line2 TEXT DEFAULT 'Vinayaka Layout, Byappanahalli',
    city TEXT DEFAULT 'Bengaluru',
    state TEXT DEFAULT 'Karnataka',
    pincode TEXT DEFAULT '560001',
    clinic_hours TEXT DEFAULT 'Mon – Sat: 10:00 AM – 1:30 PM & 5:30 PM – 8:30 PM | Sunday: 10:00 AM – 1:00 PM',
    pharmacy_hours TEXT DEFAULT 'Mon – Sat: 9:30 AM – 9:00 PM | Sunday: 10:00 AM – 2:00 PM',
    announcement_banner TEXT,
    is_announcement_active BOOLEAN DEFAULT TRUE,
    hero_video_url TEXT,
    logo_url TEXT,
    doctor_photo_url TEXT,
    pharmacy_photo_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.appointment_enquiries (
    id TEXT PRIMARY KEY,
    patient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time_slot TEXT NOT NULL,
    consultation_type TEXT NOT NULL DEFAULT 'in_clinic',
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active categories" ON public.categories FOR SELECT USING (is_active = TRUE OR auth.role() = 'authenticated');
CREATE POLICY "Admins full manage categories" ON public.categories FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Public read published products" ON public.products FOR SELECT USING (is_published = TRUE OR auth.role() = 'authenticated');
CREATE POLICY "Admins full manage products" ON public.products FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Public read store settings" ON public.store_settings FOR SELECT USING (TRUE);
CREATE POLICY "Admins update store settings" ON public.store_settings FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Public create appointment enquiries" ON public.appointment_enquiries FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins view appointment enquiries" ON public.appointment_enquiries FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Supabase & Database Configuration Wizard
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Connect your live Supabase cloud database, configure storage buckets for product images, and review security policies.
        </p>
      </div>

      {/* Current Connection Status Box */}
      <div
        className={`p-6 rounded-3xl border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isConnected
            ? 'bg-green-50/80 border-green-200 text-green-900'
            : 'bg-blue-50/80 border-blue-200 text-blue-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs ${
              isConnected ? 'bg-green-600' : 'bg-brand-blue'
            }`}
          >
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-base">
              {isConnected
                ? 'Supabase Cloud Database Connected'
                : 'Running in Hybrid Persistent Mode'}
            </h2>
            <p className="text-xs opacity-90 mt-0.5">
              {isConnected
                ? 'Your website is actively reading and writing to your Supabase PostgreSQL cluster with Row-Level Security enabled.'
                : 'All changes made in this dashboard persist locally in browser storage. To synchronize across multiple devices or team members, follow the steps below to connect your Supabase project.'}
            </p>
          </div>
        </div>

        <a
          href="https://supabase.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-gray-800 text-xs font-bold border border-gray-200 shadow-xs hover:bg-gray-50 transition-colors whitespace-nowrap"
        >
          <span>Open Supabase.com</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Step by step guide */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
          <Server className="w-5 h-5 text-brand-blue" />
          <span>Quick 3-Step Setup Instructions</span>
        </h2>

        <div className="space-y-6 text-xs sm:text-sm text-gray-700">
          {/* Step 1 */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-brand-blue text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              1
            </div>
            <div className="space-y-1">
              <strong className="block text-gray-900 font-bold text-sm">
                Create a Free Supabase Project
              </strong>
              <p className="text-gray-500 text-xs">
                Log into <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-brand-blue underline">supabase.com</a>, create an organization, and create a new project (e.g. <code>dr-praveen-pharmacy</code>).
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-brand-green text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              2
            </div>
            <div className="space-y-2 flex-grow">
              <strong className="block text-gray-900 font-bold text-sm">
                Run the Database SQL Schema
              </strong>
              <p className="text-gray-500 text-xs">
                In your Supabase project dashboard, navigate to the <strong>SQL Editor</strong> tab, click <strong>New Query</strong>, paste the script below, and click <strong>Run</strong>.
              </p>

              <div className="relative mt-2">
                <button
                  type="button"
                  onClick={copySql}
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 text-gray-800 text-xs font-bold hover:bg-white shadow-xs border border-gray-200"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-brand-blue" />
                      <span>Copy SQL Schema</span>
                    </>
                  )}
                </button>
                <pre className="p-4 bg-gray-900 text-gray-200 rounded-2xl overflow-x-auto text-[11px] font-mono leading-relaxed max-h-60">
                  {sqlSchema}
                </pre>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-brand-blue text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              3
            </div>
            <div className="space-y-1">
              <strong className="block text-gray-900 font-bold text-sm">
                Set Environment Variables
              </strong>
              <p className="text-gray-500 text-xs">
                From your Supabase Project Settings → <strong>API</strong>, copy your <strong>Project URL</strong> and <strong>Anon Public Key</strong>, and add them to your <code>.env.local</code> file (or in your Vercel Project Settings for live hosting):
              </p>
              <div className="p-3 bg-gray-100 rounded-xl font-mono text-[11px] text-gray-800 space-y-1 mt-1">
                <div>NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co</div>
                <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
