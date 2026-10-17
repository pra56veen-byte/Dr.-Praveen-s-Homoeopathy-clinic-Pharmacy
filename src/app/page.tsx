'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Clock,
  MapPin,
  MessageSquare,
  Sparkles,
  Phone,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { Hero } from '@/components/Hero';
import { SearchBar } from '@/components/SearchBar';
import { CategoryGrid } from '@/components/CategoryGrid';
import { ProductCard } from '@/components/ProductCard';
import { getCategories, getProducts, getStoreSettings } from '@/lib/store';
import { Category, Product, StoreSettings } from '@/types';
import { DEFAULT_STORE_SETTINGS } from '@/lib/initialData';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, prodsData, storeSet] = await Promise.all([
          getCategories(),
          getProducts(),
          getStoreSettings(),
        ]);
        setCategories(cats);
        setSettings(storeSet);

        // Featured products (is_featured = true & is_published = true)
        const featured = prodsData.products.filter(p => p.is_featured && p.is_published);
        setFeaturedProducts(featured.slice(0, 4));

        // Popular / Recent products
        const popular = prodsData.products.filter(p => p.is_published);
        setPopularProducts(popular.slice(0, 8));
      } catch (err) {
        console.error('Error loading homepage data', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('drp_store_updated', handleUpdate);
    return () => window.removeEventListener('drp_store_updated', handleUpdate);
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Section */}
      <Hero settings={settings} />

      {/* 2. Prominent Search Section Directly Below Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-gray-100">
          <div className="text-center mb-3">
            <h2 className="text-sm sm:text-base font-bold text-gray-800">
              Search Homoeopathic Remedies & Pharmacy Stock
            </h2>
            <p className="text-xs text-gray-500">
              Find dilutions, potencies (30C, 200C), mother tinctures, tablets & healthcare products
            </p>
          </div>
          <SearchBar />

          {/* Quick Search Chips */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-600">
            <span className="font-semibold text-gray-700">Quick Search:</span>
            {['Arnica Montana', 'Nux Vomica', 'Calendula', 'Calcarea Phos', 'Tulsi Q', 'SBL', 'Schwabe', 'Dr. Reckeweg'].map(term => (
              <Link
                key={term}
                href={`/products?search=${encodeURIComponent(term)}`}
                className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-brand-blue-light hover:text-brand-blue transition-colors"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Product Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Ambient Medical Symbol Watermark */}
        <div className="absolute -top-10 -right-8 w-60 h-60 opacity-[0.035] pointer-events-none select-none z-0">
          <img
            src="/medical-caduceus.png"
            alt=""
            className="w-full h-full object-contain filter grayscale"
          />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-brand-green font-bold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Browse By Category</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Homoeopathy & Healthcare Categories
              </h2>
            </div>
            <Link
              href="/products"
              className="mt-2 sm:mt-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-blue hover:text-brand-blue-hover"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <CategoryGrid categories={categories} limit={12} />
        </div>
      </section>

      {/* 4. Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-1">
                Verified In-Stock
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Featured Preparations
              </h2>
            </div>
            <Link
              href="/products?featured=true"
              className="text-xs sm:text-sm font-bold text-brand-blue hover:text-brand-blue-hover flex items-center gap-1"
            >
              <span>See All Featured</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Popular / Recently Added Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs font-bold text-brand-green uppercase tracking-wider mb-1">
              Popular At Pharmacy
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Medicines & Healthcare Essentials
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-brand-blue hover:text-brand-blue-hover flex items-center gap-1"
          >
            <span>Browse Full Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <span>Explore All Medicines & Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 6. Clinic Introduction & Dr. Praveen Bio */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-brand-blue text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-blue-800/40">
          {/* Authentic Pharmacy Shelves Photographic Background */}
          <div className="absolute inset-0 z-0">
            <img
              src="/pharmacy-shelves.png"
              alt="Dr. Praveen's Homoeopathy Pharmacy Shelves"
              className="w-full h-full object-cover object-center opacity-25 filter contrast-125 saturate-125"
            />
            {/* Deep medical glassmorphic gradient overlay for optimal readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/90 to-blue-950/85 backdrop-blur-[1px]"></div>
            {/* Subtle Homoeopathy Cross Watermark */}
            <div className="absolute -right-8 -bottom-8 w-64 h-64 opacity-10 pointer-events-none">
              <img
                src="/homeopathy-cross.png"
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-sm border border-white/10">
                <Stethoscope className="w-3.5 h-3.5 text-brand-green" />
                <span>About Dr. Praveen’s Clinic & Pharmacy</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Dedicated Homoeopathic Healthcare & Verified Pharmacy
              </h2>

              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                At Dr. Praveen’s Homoeopathy Clinic & Pharmacy in Bengaluru, we follow classical homoeopathic principles under the guiding motto <strong>“Treating the root Cause - Not just the symptoms.”</strong> Every remedy is sourced from trusted, licensed manufacturers including SBL, Dr. Willmar Schwabe India, Dr. Reckeweg, and Baksons.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-blue-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0" />
                  <span>Individualized doctor consultation & case analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0" />
                  <span>Standardized dilutions & pure mother tinctures</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0" />
                  <span>Sanitary dispensing of globules and triturations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0" />
                  <span>Convenient WhatsApp order & refill inquiries</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <Link
                  href="/appointment"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white text-sm font-semibold shadow-md transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation Enquiry</span>
                </Link>

                <a
                  href={`tel:${settings.primary_phone}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/15 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Clinic: {settings.primary_phone}</span>
                </a>
              </div>
            </div>

            {/* Timings & Address Card */}
            <div className="lg:col-span-4 bg-white text-gray-900 rounded-2xl p-6 shadow-md border border-white/10 space-y-4">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                <Clock className="w-5 h-5 text-brand-blue" />
                <span>Clinic &amp; Pharmacy Location</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="block font-semibold text-gray-700">Doctor Consultation Hours:</span>
                  <span className="text-gray-600 block mt-0.5">{settings.clinic_hours}</span>
                </div>

                <div>
                  <span className="block font-semibold text-gray-700">Pharmacy Counter:</span>
                  <span className="text-gray-600 block mt-0.5">{settings.pharmacy_hours}</span>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <span className="block font-semibold text-gray-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-green" />
                    <span>Clinic Address (Bengaluru):</span>
                  </span>
                  <span className="text-gray-600 block mt-0.5 leading-snug">
                    120, 5th Cross, Kada Agrahara Main Rd, Vinayaka Layout, Byappanahalli, Bengaluru, Karnataka 560049
                  </span>
                </div>

                <div className="p-2 bg-blue-50/80 rounded-xl text-[11px] text-brand-blue font-semibold">
                  Monthly visiting consultations at: Hyderabad &amp; Narasaraopet
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${settings.primary_whatsapp}?text=${encodeURIComponent("Hello Dr. Praveen's Clinic, I would like to enquire about consultation timings at Byappanahalli, Bengaluru.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-green-50 text-green-700 border border-green-200 text-xs font-bold hover:bg-green-100 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-brand-green" />
                  <span>Enquire Timings on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Conditions We Treat with Homoeopathy (From Official Clinic Poster) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden py-4">
        {/* Ambient Medical Symbol Watermarks */}
        <div className="absolute top-2 -left-8 w-64 h-64 sm:w-80 sm:h-80 opacity-[0.04] pointer-events-none select-none z-0">
          <img
            src="/homeopathy-cross.png"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute bottom-2 -right-8 w-64 h-64 sm:w-80 sm:h-80 opacity-[0.04] pointer-events-none select-none z-0">
          <img
            src="/medical-caduceus.png"
            alt=""
            className="w-full h-full object-contain filter grayscale"
          />
        </div>

        <div className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-brand-green" />
              <span>Healing the Root, Not Just the Symptoms</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Conditions We Treat with Homoeopathy
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Individualized clinical management with natural homoeopathic medicine for acute &amp; chronic conditions.
            </p>
          </div>

        {/* 12 Conditions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              title: 'Diabetes',
              desc: 'Blood Sugar Management, Diabetes-Related Complications & Metabolic Support.',
              color: 'border-blue-200 bg-blue-50/40 text-brand-blue',
            },
            {
              title: 'Respiratory Disorders',
              desc: 'Asthma, Allergic Bronchitis, Sinusitis, Tonsillitis & Recurrent Cold.',
              color: 'border-green-200 bg-green-50/40 text-brand-green',
            },
            {
              title: 'Thyroid Disorders',
              desc: 'Hypothyroidism, Hyperthyroidism, Weight Changes & Chronic Fatigue.',
              color: 'border-blue-200 bg-blue-50/40 text-brand-blue',
            },
            {
              title: 'Migraine & Headaches',
              desc: 'Chronic Migraine, One-Sided Headache, Tension & Sinus Headache Relief.',
              color: 'border-purple-200 bg-purple-50/40 text-purple-700',
            },
            {
              title: 'Kidney Disorders',
              desc: 'Kidney Stones, Urinary Discomfort, Edema/Swelling & Recurrent UTIs.',
              color: 'border-amber-200 bg-amber-50/40 text-amber-700',
            },
            {
              title: 'Skin Disorders',
              desc: 'Pimples (Acne), Eczema, Psoriasis, Allergies, Rashes & Severe Itching.',
              color: 'border-rose-200 bg-rose-50/40 text-rose-700',
            },
            {
              title: 'Joint Problems & Arthritis',
              desc: 'Knee Pain, Neck/Cervical Pain, Arthritis, Joint Inflammation & Stiffness.',
              color: 'border-emerald-200 bg-emerald-50/40 text-emerald-700',
            },
            {
              title: 'Digestive Disorders',
              desc: 'Indigestion, Acidity & Gas, Abdominal Cramps, IBS & Chronic Constipation.',
              color: 'border-orange-200 bg-orange-50/40 text-orange-700',
            },
            {
              title: 'PCOD / PCOS & Female Health',
              desc: 'Irregular Periods, Hormonal Imbalance, Facial Hair & Weight Management.',
              color: 'border-pink-200 bg-pink-50/40 text-pink-700',
            },
            {
              title: 'Sexual Health',
              desc: 'Comprehensive, Confidential Care for Male & Female Reproductive Well-Being.',
              color: 'border-teal-200 bg-teal-50/40 text-teal-700',
            },
            {
              title: 'Piles (Hemorrhoids)',
              desc: 'Bleeding, Severe Pain, Burning Sensation, Fissures & Chronic Constipation.',
              color: 'border-red-200 bg-red-50/40 text-red-700',
            },
            {
              title: 'Mental Health & Sleep',
              desc: 'Anxiety, Chronic Stress, Depression, Insomnia, Restlessness & Phobias.',
              color: 'border-indigo-200 bg-indigo-50/40 text-indigo-700',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-gray-900">{item.title}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.color}`}>
                    Homoeopathy
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <a
                  href={`https://wa.me/${settings.primary_whatsapp}?text=${encodeURIComponent(`Hello Dr. Praveen, I would like to consult regarding homoeopathic treatment for: ${item.title}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-brand-green hover:underline flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Consult via WhatsApp →</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

      {/* 8. How WhatsApp Ordering Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden py-4">
        {/* Subtle Watermark in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 opacity-[0.025] pointer-events-none select-none z-0">
          <img
            src="/medical-caduceus.png"
            alt=""
            className="w-full h-full object-contain filter grayscale"
          />
        </div>
        <div className="relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            How WhatsApp Ordering Works
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Simple, transparent medicine availability inquiries in 3 straightforward steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue font-bold text-lg flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="font-bold text-sm text-gray-900">
              Browse & Add Items
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Explore homoeopathic dilutions, potencies, or personal care essentials and add your needed quantities to your cart.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-brand-green font-bold text-lg flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="font-bold text-sm text-gray-900">
              Enter Name & Review
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Open your Cart, enter your name and optional delivery locality. The system automatically formats your product inquiry list.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue font-bold text-lg flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="font-bold text-sm text-gray-900">
              Send on WhatsApp
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Click “Place Order on WhatsApp”. WhatsApp opens with the formatted message. The pharmacy confirms availability and fulfilment.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
);
}
