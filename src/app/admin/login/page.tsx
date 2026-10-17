'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, KeyRound, Sparkles } from 'lucide-react';
import { loginAdmin, isUserAdmin } from '@/lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isUserAdmin()) {
      router.replace('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await loginAdmin(email, password);
      if (result.success) {
        router.push('/admin');
      } else {
        setError(result.error || 'Failed to authenticate administrator.');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-200 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-brand-blue text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Administrator Portal
          </h1>
          <p className="text-xs text-gray-500">
            Dr. Praveen’s Homoeopathy Clinic & Pharmacy
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@drpraveenclinic.com"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-sm font-bold shadow-md transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Initial Credentials Hint Box for Clinic Administrator */}
        <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-brand-blue">
            <KeyRound className="w-4 h-4" />
            <span>Initial Clinic Administrator Access</span>
          </div>
          <p className="text-[11px] text-gray-600 leading-snug">
            For initial onboarding, you can log in using:
          </p>
          <div className="p-2 bg-white rounded-lg border border-blue-100 font-mono text-[11px] space-y-1 text-gray-800">
            <div>Email: <strong className="text-brand-blue">admin@drpraveenclinic.com</strong></div>
            <div>Password: <strong className="text-brand-blue">PraveenClinic@2026</strong></div>
          </div>
          <p className="text-[10px] text-gray-500">
            You can also connect Supabase Auth in the setup tab to invite multiple staff members with custom credentials.
          </p>
        </div>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-gray-500 hover:text-brand-blue">
            ← Return to Clinic Website
          </Link>
        </div>
      </div>
    </div>
  );
}
