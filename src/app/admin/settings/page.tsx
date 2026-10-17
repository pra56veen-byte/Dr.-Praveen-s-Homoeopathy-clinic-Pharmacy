'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Sparkles,
  Video,
  Image as ImageIcon,
  AlertCircle,
  Lock,
  KeyRound,
} from 'lucide-react';
import { getStoreSettings, saveStoreSettings } from '@/lib/store';
import { StoreSettings } from '@/types';
import { DEFAULT_STORE_SETTINGS } from '@/lib/initialData';
import { sanitizeWhatsAppNumber } from '@/lib/whatsapp';
import { getCurrentAdminEmail, updateAdminCredentials } from '@/lib/auth';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Admin Credential Management State
  const [adminEmail, setAdminEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [credError, setCredError] = useState('');
  const [credSuccess, setCredSuccess] = useState('');

  useEffect(() => {
    getStoreSettings().then(setSettings);
    setAdminEmail(getCurrentAdminEmail());
  }, []);

  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setCredError('');
    setCredSuccess('');

    if (!adminEmail.trim()) {
      setCredError('Please enter a valid administrator email.');
      return;
    }
    if (!newPassword) {
      setCredError('Please enter a new password.');
      return;
    }
    if (newPassword.length < 6) {
      setCredError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setCredError('Passwords do not match. Please re-enter.');
      return;
    }

    updateAdminCredentials(adminEmail.trim(), newPassword);
    setCredSuccess('Administrator credentials updated successfully! Please save your new password.');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setCredSuccess(''), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Normalize WhatsApp numbers
      const cleanedPrimary = sanitizeWhatsAppNumber(settings.primary_whatsapp);
      const cleanedAlternate = sanitizeWhatsAppNumber(settings.alternate_whatsapp);

      const updated = await saveStoreSettings({
        ...settings,
        primary_whatsapp: cleanedPrimary,
        alternate_whatsapp: cleanedAlternate,
      });

      setSettings(updated);
      setSuccessToast('Clinic & Pharmacy settings successfully updated and saved.');
      setTimeout(() => setSuccessToast(''), 3500);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Store & Clinic Settings
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Configure WhatsApp numbers, telephone hotline, clinic hours, Bengaluru address, hero video, and announcement banners.
        </p>
      </div>

      {successToast && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-2 text-xs text-green-800 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. WhatsApp Configuration (CRITICAL REQUIREMENT) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <MessageSquare className="w-5 h-5 text-brand-green" />
            <h2 className="font-bold text-base text-gray-900">
              Pharmacy WhatsApp Numbers (Dynamic Ordering)
            </h2>
          </div>

          <p className="text-xs text-gray-500">
            These numbers receive customer cart order enquiries and doctor appointment requests. Customer messages will be dynamically formatted and routed to these lines.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Primary WhatsApp Number <strong className="text-red-500">*</strong>
              </label>
              <input
                type="text"
                required
                value={settings.primary_whatsapp}
                onChange={(e) => setSettings({ ...settings, primary_whatsapp: e.target.value })}
                placeholder="e.g. 919052523835"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Default: 919052523835 (+91 9052523835)
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Alternate WhatsApp Number <strong className="text-red-500">*</strong>
              </label>
              <input
                type="text"
                required
                value={settings.alternate_whatsapp}
                onChange={(e) => setSettings({ ...settings, alternate_whatsapp: e.target.value })}
                placeholder="e.g. 917732062291"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Alternate line: 917732062291 (+91 7732062291)
              </span>
            </div>
          </div>
        </div>

        {/* 2. Clinic Identity & Contact */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Sparkles className="w-5 h-5 text-brand-blue" />
            <h2 className="font-bold text-base text-gray-900">
              Clinic & Pharmacy Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Website & Clinic Name
              </label>
              <input
                type="text"
                value={settings.clinic_name}
                onChange={(e) => setSettings({ ...settings, clinic_name: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Direct Telephone (Hotline)
              </label>
              <input
                type="text"
                value={settings.primary_phone}
                onChange={(e) => setSettings({ ...settings, primary_phone: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* 3. Address & Timings */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Clock className="w-5 h-5 text-yellow-600" />
            <h2 className="font-bold text-base text-gray-900">
              Location & Operating Hours
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Doctor Consultation Hours
              </label>
              <input
                type="text"
                value={settings.clinic_hours}
                onChange={(e) => setSettings({ ...settings, clinic_hours: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Pharmacy Operating Hours
              </label>
              <input
                type="text"
                value={settings.pharmacy_hours}
                onChange={(e) => setSettings({ ...settings, pharmacy_hours: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Clinic Address (Bengaluru, Karnataka)
              </label>
              <input
                type="text"
                value={settings.address_line1}
                onChange={(e) => setSettings({ ...settings, address_line1: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* 4. Visual Media & Video Fallback */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Video className="w-5 h-5 text-brand-blue" />
            <h2 className="font-bold text-base text-gray-900">
              Branding Assets & Hero Media
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Hero Video Background URL (Optional)
              </label>
              <input
                type="url"
                value={settings.hero_video_url || ''}
                onChange={(e) => setSettings({ ...settings, hero_video_url: e.target.value })}
                placeholder="https://example.com/clinic-hero-loop.mp4"
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                When provided, displays as a subtle, muted, looping hero background with graceful fallback.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Doctor Photograph URL (Placeholder or Supabase Storage)
                </label>
                <input
                  type="url"
                  value={settings.doctor_photo_url || ''}
                  onChange={(e) => setSettings({ ...settings, doctor_photo_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Clinic Logo URL (Placeholder or Supabase Storage)
                </label>
                <input
                  type="url"
                  value={settings.logo_url || ''}
                  onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 5. Announcement Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="font-bold text-base text-gray-900">
              Top Announcement Banner
            </h2>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={settings.is_announcement_active}
                onChange={(e) => setSettings({ ...settings, is_announcement_active: e.target.checked })}
                className="w-4 h-4 text-brand-blue rounded"
              />
              <span>Banner Active</span>
            </label>
          </div>

          <div>
            <input
              type="text"
              value={settings.announcement_banner || ''}
              onChange={(e) => setSettings({ ...settings, announcement_banner: e.target.value })}
              placeholder="e.g. Welcome to Dr. Praveen’s Homoeopathy Clinic & Pharmacy..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl"
            />
          </div>
        </div>

        {/* 6. Administrator Security & Login Credentials */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Lock className="w-5 h-5 text-brand-blue" />
            <h2 className="font-bold text-base text-gray-900">
              Administrator Security &amp; Login Credentials
            </h2>
          </div>

          <p className="text-xs text-gray-500">
            Change your administrator email and login password. These credentials are used to securely sign in to your dashboard at <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800">/admin/login</code>.
          </p>

          {credError && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{credError}</span>
            </div>
          )}

          {credSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 text-xs text-green-800 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>{credSuccess}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@drpraveenclinic.com"
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleUpdateCredentials}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-xs transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Update Admin Credentials</span>
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-blue hover:bg-brand-blue-hover text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
