'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, Phone, MessageSquare, ShieldCheck, Stethoscope, Pill } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getStoreSettings } from '@/lib/store';
import { StoreSettings } from '@/types';
import { DEFAULT_STORE_SETTINGS } from '@/lib/initialData';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);

  useEffect(() => {
    getStoreSettings().then(setSettings);
    const handleUpdate = () => {
      getStoreSettings().then(setSettings);
    };
    window.addEventListener('drp_store_updated', handleUpdate);
    return () => window.removeEventListener('drp_store_updated', handleUpdate);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Medicines & Products', href: '/products' },
    { name: 'Doctor Appointment', href: '/appointment' },
    { name: 'Admin', href: '/admin' },
  ];

  const primaryWaUrl = `https://wa.me/${settings.primary_whatsapp}?text=${encodeURIComponent("Hello Dr. Praveen's Homoeopathy Clinic & Pharmacy, I would like to make an enquiry.")}`;

  return (
    <>
      {/* Top Announcement Bar */}
      {settings.is_announcement_active && settings.announcement_banner && (
        <div className="bg-brand-blue text-white text-xs sm:text-sm py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
          <span>{settings.announcement_banner}</span>
          <span className="hidden md:inline text-blue-200">|</span>
          <a
            href={primaryWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-green-200 transition-colors hidden sm:inline"
          >
            WhatsApp Pharmacy: +{settings.primary_whatsapp}
          </a>
        </div>
      )}

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-brand-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24">
            {/* Logo and Brand Title */}
            <Link href="/" className="flex items-center gap-3 sm:gap-4 group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center shadow-md border-2 border-brand-green/30 flex-shrink-0 overflow-hidden p-0.5 group-hover:scale-105 group-hover:border-brand-blue/50 transition-all">
                {settings.logo_url ? (
                  <img
                    src={settings.logo_url}
                    alt={settings.clinic_name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-brand-blue flex flex-col items-center justify-center text-white leading-none">
                    <span className="text-sm font-bold tracking-tight">Dr.P</span>
                    <span className="text-[8px] font-semibold text-green-300">CLINIC</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-xl font-extrabold text-gray-900 leading-tight group-hover:text-brand-blue transition-colors">
                  {settings.clinic_name}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-brand-green tracking-wide flex items-center gap-1.5 flex-wrap mt-0.5">
                  <span>{settings.tagline}</span>
                  <span className="text-gray-300 hidden sm:inline">•</span>
                  <span className="text-gray-500 font-medium hidden sm:inline">Bengaluru</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map(link => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'text-brand-blue bg-brand-blue-light font-semibold'
                        : 'text-gray-700 hover:text-brand-blue hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions: WhatsApp Quick Link + Cart Icon */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={`tel:${settings.primary_phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Call Pharmacy"
              >
                <Phone className="w-3.5 h-3.5 text-brand-blue" />
                <span>Call Pharmacy</span>
              </a>

              <Link
                href="/cart"
                className="relative inline-flex items-center justify-center p-2.5 rounded-xl text-gray-700 hover:text-brand-blue hover:bg-blue-50 transition-colors border border-gray-200"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-green text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Actions: Cart Icon + Menu Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/cart"
                className="relative p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-green text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fadeIn">
            {navLinks.map(link => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                    isActive
                      ? 'text-brand-blue bg-brand-blue-light font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-gray-100 space-y-2">
              <a
                href={`tel:${settings.primary_phone}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gray-100 text-gray-800 text-sm font-medium"
              >
                <Phone className="w-4 h-4 text-brand-blue" />
                Call Pharmacy: {settings.primary_phone}
              </a>
              <a
                href={primaryWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-brand-green text-white text-sm font-semibold hover:bg-brand-green-hover"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp Pharmacy Enquiry
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
