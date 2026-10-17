'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Phone, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { getStoreSettings } from '@/lib/store';
import { StoreSettings } from '@/types';
import { DEFAULT_STORE_SETTINGS } from '@/lib/initialData';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [selectedNumber, setSelectedNumber] = useState<'primary' | 'alternate'>('primary');

  useEffect(() => {
    getStoreSettings().then(setSettings);
    const handleUpdate = () => getStoreSettings().then(setSettings);
    window.addEventListener('drp_store_updated', handleUpdate);
    return () => window.removeEventListener('drp_store_updated', handleUpdate);
  }, []);

  const activeNumber =
    selectedNumber === 'primary' ? settings.primary_whatsapp : settings.alternate_whatsapp;

  const getChatUrl = (customText: string) => {
    return `https://wa.me/${activeNumber}?text=${encodeURIComponent(customText)}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 print:hidden">
      {/* Expanded Quick Contact Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-blue to-blue-700 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-brand-green flex items-center justify-center text-white font-bold">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">Dr. Praveen’s Clinic</h4>
                  <p className="text-[11px] text-green-200 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-ping"></span>
                    Direct WhatsApp Support
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Number Switcher */}
            <div className="mt-3 pt-2 border-t border-white/15 flex items-center justify-between text-xs">
              <span className="text-blue-100 text-[11px]">Chat via:</span>
              <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setSelectedNumber('primary')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    selectedNumber === 'primary'
                      ? 'bg-brand-green text-white font-semibold'
                      : 'text-blue-100 hover:text-white'
                  }`}
                >
                  Primary
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedNumber('alternate')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    selectedNumber === 'alternate'
                      ? 'bg-brand-green text-white font-semibold'
                      : 'text-blue-100 hover:text-white'
                  }`}
                >
                  Alternate
                </button>
              </div>
            </div>
            <div className="text-[11px] text-blue-200 mt-1 font-mono">
              Active: +{activeNumber}
            </div>
          </div>

          {/* Quick Action Options */}
          <div className="p-3 space-y-2 bg-gray-50">
            <a
              href={getChatUrl("Hello Dr. Praveen's Pharmacy, I would like to enquire about the availability of medicines.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 bg-white hover:bg-green-50 rounded-xl border border-gray-100 transition-colors text-left group"
            >
              <div>
                <span className="block text-xs font-semibold text-gray-900 group-hover:text-green-700">
                  Medicine Availability Enquiry
                </span>
                <span className="block text-[11px] text-gray-500">
                  Ask if specific remedies/potencies are in stock
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
            </a>

            <a
              href={getChatUrl("Hello Dr. Praveen's Clinic, I would like to enquire about booking a doctor consultation.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 bg-white hover:bg-blue-50 rounded-xl border border-gray-100 transition-colors text-left group"
            >
              <div>
                <span className="block text-xs font-semibold text-gray-900 group-hover:text-brand-blue">
                  Doctor Appointment Enquiry
                </span>
                <span className="block text-[11px] text-gray-500">
                  Request consultation in Bengaluru or online
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-blue" />
            </a>

            <a
              href={`tel:${settings.primary_phone}`}
              className="flex items-center justify-between p-2.5 bg-white hover:bg-gray-100 rounded-xl border border-gray-100 transition-colors text-left group"
            >
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-blue" />
                <span className="text-xs font-medium text-gray-800">
                  Call Clinic Directly: {settings.primary_phone}
                </span>
              </div>
            </a>
          </div>

          <div className="px-3 py-2 bg-gray-100 text-[10px] text-gray-500 text-center border-t border-gray-200">
            Verified Homoeopathic Healthcare • Bengaluru, Karnataka
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Contact on WhatsApp"
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-brand-green hover:bg-brand-green-hover text-white shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 group"
      >
        <MessageSquare className="w-6 h-6 fill-current" />
        <span className="hidden sm:inline font-semibold text-sm">
          WhatsApp Pharmacy
        </span>
      </button>
    </div>
  );
};
