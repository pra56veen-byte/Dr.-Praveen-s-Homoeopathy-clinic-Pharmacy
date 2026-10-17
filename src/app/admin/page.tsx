'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Layers,
  Sparkles,
  AlertCircle,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { getCategories, getProducts, getStoreSettings, saveProduct } from '@/lib/store';
import { Category, Product, StoreSettings } from '@/types';
import { DEFAULT_STORE_SETTINGS } from '@/lib/initialData';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [prodsData, cats, st] = await Promise.all([
        getProducts(),
        getCategories(),
        getStoreSettings(),
      ]);
      setProducts(prodsData.products);
      setCategories(cats);
      setSettings(st);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('drp_store_updated', loadData);
    return () => window.removeEventListener('drp_store_updated', loadData);
  }, []);

  const totalProducts = products.length;
  const inStockCount = products.filter(p => p.is_in_stock).length;
  const outOfStockCount = totalProducts - inStockCount;
  const featuredCount = products.filter(p => p.is_featured).length;
  const sampleCount = products.filter(p => p.is_sample).length;
  const activeCategoriesCount = categories.filter(c => c.is_active).length;

  const handleToggleStock = async (product: Product) => {
    await saveProduct({
      ...product,
      is_in_stock: !product.is_in_stock,
    });
    loadData();
  };

  const handleToggleFeatured = async (product: Product) => {
    await saveProduct({
      ...product,
      is_featured: !product.is_featured,
    });
    loadData();
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
            Pharmacy Control Panel
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Overview & Catalogue Analytics
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Dr. Praveen’s Homoeopathy Clinic & Pharmacy • Bengaluru, Karnataka
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products?action=new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Verification Notice for Sample Records */}
      {sampleCount > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <strong className="font-bold">Initial Sample Records Detected ({sampleCount}):</strong>
              <p className="text-[11px] text-amber-800">
                You have initial demo records marked as unverified samples. You can review them, verify genuine stock prices and potencies, or replace them with your actual clinic inventory.
              </p>
            </div>
          </div>
          <Link
            href="/admin/products"
            className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-semibold text-xs hover:bg-amber-700 whitespace-nowrap"
          >
            Review Sample Records
          </Link>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Total Medicines</span>
            <Package className="w-4 h-4 text-brand-blue" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {totalProducts}
          </div>
          <div className="text-[11px] text-gray-400">
            Across {activeCategoriesCount} active categories
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>In Stock</span>
            <CheckCircle2 className="w-4 h-4 text-brand-green" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-brand-green">
            {inStockCount}
          </div>
          <div className="text-[11px] text-gray-400">
            {outOfStockCount} out of stock
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Featured On Home</span>
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-yellow-600">
            {featuredCount}
          </div>
          <div className="text-[11px] text-gray-400">
            Highlighted for customers
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Active Categories</span>
            <Layers className="w-4 h-4 text-brand-blue" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-brand-blue">
            {activeCategoriesCount}
          </div>
          <div className="text-[11px] text-gray-400">
            Homoeopathy & Healthcare
          </div>
        </div>
      </div>

      {/* Quick Settings & WhatsApp Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-green" />
              <span>Active WhatsApp Ordering Routing</span>
            </h2>
            <Link
              href="/admin/settings"
              className="text-xs font-bold text-brand-blue hover:underline"
            >
              Configure Numbers
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
              <span className="text-gray-400 block font-medium">Primary WhatsApp Number:</span>
              <span className="font-bold text-sm text-gray-900">+{settings.primary_whatsapp}</span>
              <p className="text-[11px] text-gray-500">Default destination for customer cart orders</p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
              <span className="text-gray-400 block font-medium">Alternate WhatsApp Number:</span>
              <span className="font-bold text-sm text-gray-900">+{settings.alternate_whatsapp}</span>
              <p className="text-[11px] text-gray-500">Secondary line selectable by customers</p>
            </div>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 flex items-center gap-2">
            <Phone className="w-4 h-4 text-brand-blue flex-shrink-0" />
            <span>Direct Phone Call Hotline: <strong>{settings.primary_phone}</strong></span>
          </div>
        </div>

        {/* Database Quick Health */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-base text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-blue" />
              <span>Database Status</span>
            </h2>
            <div className="pt-3 space-y-2 text-xs">
              <p className="text-gray-600">
                All modifications (products, categories, pricing, stock, settings) are persistently stored.
              </p>
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Local Persistence:</span>
                  <span className="font-bold text-green-700">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Supabase Sync:</span>
                  <span className="font-semibold text-brand-blue">Configurable in Setup</span>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/admin/setup"
            className="w-full text-center py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
          >
            Open Database Setup Guide →
          </Link>
        </div>
      </div>

      {/* Recent Products Table */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-base text-gray-900">
              Medicines & Stock Overview
            </h2>
            <p className="text-xs text-gray-500">
              Toggle stock availability and featured status with one click
            </p>
          </div>
          <Link
            href="/admin/products"
            className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1"
          >
            <span>Manage All ({totalProducts})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-3 rounded-l-xl">Product</th>
                <th className="py-3 px-3">Brand</th>
                <th className="py-3 px-3">Potency / Pack</th>
                <th className="py-3 px-3">MRP / Price</th>
                <th className="py-3 px-3 text-center">In Stock</th>
                <th className="py-3 px-3 text-center">Featured</th>
                <th className="py-3 px-3 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {products.slice(0, 6).map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50/70">
                  <td className="py-3 px-3 font-medium text-gray-900 max-w-xs truncate">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        <img src={prod.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="truncate">{prod.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">{prod.brand}</td>
                  <td className="py-3 px-3 font-mono text-[11px]">
                    {prod.potency || prod.pack_size}
                  </td>
                  <td className="py-3 px-3 font-bold text-gray-900">
                    ₹{prod.selling_price}
                    {prod.mrp > prod.selling_price && (
                      <span className="text-[10px] text-gray-400 line-through ml-1 font-normal">
                        ₹{prod.mrp}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleStock(prod)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        prod.is_in_stock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {prod.is_in_stock ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(prod)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        prod.is_featured
                          ? 'bg-blue-100 text-brand-blue'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {prod.is_featured ? 'Featured' : 'Standard'}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href={`/admin/products?edit=${prod.id}`}
                      className="text-brand-blue hover:underline font-semibold"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
