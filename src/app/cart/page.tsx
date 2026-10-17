'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trash2,
  Plus,
  Minus,
  MessageSquare,
  ShoppingBag,
  ArrowLeft,
  Phone,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  MapPin,
  User,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getStoreSettings } from '@/lib/store';
import { StoreSettings } from '@/types';
import { DEFAULT_STORE_SETTINGS } from '@/lib/initialData';
import { createWhatsAppOrderUrl } from '@/lib/whatsapp';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalDiscount,
    estimatedTotal,
    revalidateCart,
  } = useCart();

  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [customerName, setCustomerName] = useState('');
  const [customerLocality, setCustomerLocality] = useState('');
  const [selectedWaNumber, setSelectedWaNumber] = useState<'primary' | 'alternate'>('primary');
  const [nameError, setNameError] = useState('');
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [revalidationNotice, setRevalidationNotice] = useState<string | null>(null);

  useEffect(() => {
    getStoreSettings().then(setSettings);
  }, []);

  // Revalidate cart on first mount
  useEffect(() => {
    if (items.length > 0) {
      setIsRevalidating(true);
      revalidateCart().then((res) => {
        setIsRevalidating(false);
        if (res.hasChanges && res.message) {
          setRevalidationNotice(res.message);
        }
      });
    }
  }, []);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || customerName.trim().length === 0) {
      setNameError('Please enter your full name before placing an order enquiry.');
      return;
    }
    setNameError('');

    const targetNumber =
      selectedWaNumber === 'primary' ? settings.primary_whatsapp : settings.alternate_whatsapp;

    const url = createWhatsAppOrderUrl(targetNumber, {
      customerName: customerName.trim(),
      customerLocality: customerLocality.trim(),
      items,
      subtotal,
      discount: totalDiscount,
      total: estimatedTotal,
    });

    // Open WhatsApp in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 text-brand-blue flex items-center justify-center mx-auto shadow-xs">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Your Cart is Empty</h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto mt-2">
            You haven’t added any medicines or healthcare essentials to your cart yet. Explore our homoeopathic preparations to start your order enquiry.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-sm font-semibold shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore Medicines & Products</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Shopping Cart & WhatsApp Order
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review your selected homoeopathic preparations, enter your name, and send your availability enquiry directly to the pharmacy.
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-semibold self-start sm:self-auto py-1.5 px-3 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Entire Cart</span>
        </button>
      </div>

      {/* Notice if prices/stock changed during revalidation */}
      {revalidationNotice && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{revalidationNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setRevalidationNotice(null)}
            className="text-amber-700 font-bold ml-2 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2-Column Layout on Desktop, Stacked on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Product List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs divide-y divide-gray-100 overflow-hidden">
            {items.map((item) => {
              const lineTotal = item.selling_price * item.quantity;
              const hasDiscount = item.mrp && item.mrp > item.selling_price;

              return (
                <div key={item.product_id} className="p-4 sm:p-5 flex gap-4 items-start sm:items-center">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Item info */}
                  <div className="flex-grow min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.product_id}`}
                        className="font-bold text-sm text-gray-900 hover:text-brand-blue truncate block"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-lg transition-colors flex-shrink-0"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-gray-500 flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-brand-blue">{item.brand}</span>
                      {item.potency && (
                        <span className="text-[11px] bg-blue-50 text-brand-blue px-1.5 py-0.5 rounded">
                          {item.potency}
                        </span>
                      )}
                      {item.pack_size && <span>• {item.pack_size}</span>}
                    </div>

                    {/* Price & Quantity Controls */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 border border-gray-200 rounded-xl p-0.5 bg-gray-50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-xs text-gray-700 hover:bg-gray-100"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-bold text-xs text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-xs text-gray-700 hover:bg-gray-100"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-sm sm:text-base text-gray-900">
                          ₹{lineTotal}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          ₹{item.selling_price} each
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-blue hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>

            <a
              href={`tel:${settings.primary_phone}`}
              className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-brand-blue" />
              <span>Questions? Call Pharmacy: {settings.primary_phone}</span>
            </a>
          </div>
        </div>

        {/* Right Column: Order Summary & WhatsApp Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-sm space-y-6 sticky top-24">
          <h2 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center justify-between">
            <span>Order Summary</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-brand-blue">
              WhatsApp Enquiry
            </span>
          </h2>

          {/* Customer Details Form */}
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-brand-blue" />
                <span>Customer Name <strong className="text-red-500">*</strong></span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (nameError) setNameError('');
                }}
                placeholder="Enter your full name (required)"
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 ${
                  nameError ? 'border-red-500 bg-red-50/50' : 'border-gray-300 bg-white'
                }`}
              />
              {nameError && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{nameError}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-green" />
                <span>Locality / Delivery Area (Optional)</span>
              </label>
              <input
                type="text"
                value={customerLocality}
                onChange={(e) => setCustomerLocality(e.target.value)}
                placeholder="e.g. Indiranagar, Bengaluru / Pickup at Clinic"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 bg-white"
              />
            </div>

            {/* WhatsApp Contact Selection */}
            <div className="pt-1">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Send to WhatsApp Number:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedWaNumber('primary')}
                  className={`p-2 rounded-xl border text-left transition-colors ${
                    selectedWaNumber === 'primary'
                      ? 'border-brand-blue bg-blue-50/70 text-brand-blue font-bold ring-1 ring-brand-blue'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="block text-[10px] text-gray-400">Primary</span>
                  <span>+{settings.primary_whatsapp}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedWaNumber('alternate')}
                  className={`p-2 rounded-xl border text-left transition-colors ${
                    selectedWaNumber === 'alternate'
                      ? 'border-brand-blue bg-blue-50/70 text-brand-blue font-bold ring-1 ring-brand-blue'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="block text-[10px] text-gray-400">Alternate</span>
                  <span>+{settings.alternate_whatsapp}</span>
                </button>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-gray-100 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal (Verified MRP):</span>
                <span>₹{subtotal}</span>
              </div>

              {totalDiscount > 0 && (
                <div className="flex justify-between text-brand-green font-semibold">
                  <span>Applicable Discount:</span>
                  <span>- ₹{totalDiscount}</span>
                </div>
              )}

              <div className="pt-2 border-t border-gray-100 flex justify-between items-baseline font-bold text-base sm:text-lg text-gray-900">
                <span>Estimated Final Total:</span>
                <span className="text-brand-blue">₹{estimatedTotal}</span>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-[11px] text-gray-500 leading-snug">
              <ShieldCheck className="w-4 h-4 text-brand-green inline mr-1" />
              Displayed totals are based on current catalogue information. The pharmacy will confirm medicine availability, batch details, and applicable delivery charges before order dispatch.
            </div>

            {/* Primary Order Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-brand-green hover:bg-brand-green-hover text-white text-sm sm:text-base font-extrabold shadow-md hover:shadow-lg transition-all"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              <span>Place Order on WhatsApp</span>
            </button>

            {/* Secondary Direct Call Pharmacy */}
            <a
              href={`tel:${settings.primary_phone}`}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-semibold transition-colors"
            >
              <Phone className="w-4 h-4 text-brand-blue" />
              <span>Call Pharmacy Directly: {settings.primary_phone}</span>
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
