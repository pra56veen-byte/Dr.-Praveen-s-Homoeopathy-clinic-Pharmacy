'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  Settings,
  Database,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { isUserAdmin, logoutAdmin, getAdminSession } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    // If on the login page itself, do not check authorization
    if (pathname === '/admin/login') {
      setAuthorized(true);
      return;
    }

    if (!isUserAdmin()) {
      router.replace('/admin/login');
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  // If on login page, render children directly without admin chrome
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Products Catalogue', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Store Settings', href: '/admin/settings', icon: Settings },
    { name: 'Database & Supabase', href: '/admin/setup', icon: Database },
  ];

  const handleLogout = () => {
    logoutAdmin();
    router.replace('/admin/login');
  };

  const user = getAdminSession();
  const supabaseConnected = isSupabaseConfigured();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Admin Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-blue text-white flex items-center justify-center font-bold text-xs">
            Dr.P
          </div>
          <span className="font-bold text-sm text-gray-900">Admin Portal</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileNavOpen ? 'block' : 'hidden'
        } md:block md:w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col justify-between h-auto md:h-screen md:sticky md:top-0 z-20`}
      >
        <div className="p-5 space-y-6">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-brand-blue text-white flex items-center justify-center font-bold text-sm shadow-xs">
              Dr.P
            </div>
            <div>
              <h2 className="font-bold text-sm text-gray-900 leading-tight">
                Dr. Praveen’s Clinic
              </h2>
              <span className="text-[11px] font-medium text-brand-green">
                Pharmacy Admin
              </span>
            </div>
          </div>

          {/* Database Mode Pill */}
          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-[11px]">Backend Mode:</span>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  supabaseConnected
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-brand-blue'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    supabaseConnected ? 'bg-green-500' : 'bg-brand-blue'
                  }`}
                ></span>
                {supabaseConnected ? 'Supabase Live' : 'Local Persistent'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-blue text-white font-semibold shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-600 hover:text-brand-blue rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Website</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
