'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Video,
} from 'lucide-react';
import { getStoreSettings, saveAppointmentEnquiry } from '@/lib/store';
import { StoreSettings } from '@/types';
import { DEFAULT_STORE_SETTINGS } from '@/lib/initialData';
import { createWhatsAppAppointmentUrl } from '@/lib/whatsapp';

export default function AppointmentPage() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);

  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    preferredDate: '',
    preferredTimeSlot: 'Morning (10:00 AM - 1:30 PM)',
    consultationType: 'in_clinic' as 'in_clinic' | 'online',
    reason: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getStoreSettings().then(setSettings);
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.patientName.trim()) {
      errs.patientName = 'Patient full name is required';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Contact phone number is required';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.preferredDate) {
      errs.preferredDate = 'Please select a preferred date';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Save to store / database
    await saveAppointmentEnquiry({
      patient_name: formData.patientName,
      phone: formData.phone,
      preferred_date: formData.preferredDate,
      preferred_time_slot: formData.preferredTimeSlot,
      consultation_type: formData.consultationType,
      reason: formData.reason,
    });

    // Build and open WhatsApp appointment link
    const waUrl = createWhatsAppAppointmentUrl(settings.primary_whatsapp, {
      patientName: formData.patientName,
      phone: formData.phone,
      preferredDate: formData.preferredDate,
      preferredTimeSlot: formData.preferredTimeSlot,
      consultationType: formData.consultationType,
      reason: formData.reason,
    });

    setSubmitted(true);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 relative overflow-hidden">
      {/* Ambient Medical Symbol Watermarks */}
      <div className="absolute top-10 right-4 w-72 h-72 opacity-[0.035] pointer-events-none select-none z-0">
        <img
          src="/medical-caduceus.png"
          alt=""
          className="w-full h-full object-contain filter grayscale"
        />
      </div>
      <div className="absolute bottom-12 -left-10 w-64 h-64 opacity-[0.04] pointer-events-none select-none z-0">
        <img
          src="/homeopathy-cross.png"
          alt=""
          className="w-full h-full object-contain"
        />
      </div>

      {/* Title */}
      <div className="max-w-3xl relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold mb-2">
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Doctor Consultation Enquiry</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Consult Dr. Praveen, Homoeopathic Physician
        </h1>
        <p className="text-xs sm:text-base text-gray-600 mt-2 leading-relaxed">
          Request an in-clinic consultation at our Bengaluru facility or enquire for an online homoeopathic case evaluation. Send your preferred timing directly to the clinic on WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Left Column: Doctor Profile & Clinic Timings */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-5">
            {/* Doctor Photo / Visual */}
            <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center border border-gray-200 overflow-hidden shadow-xs">
              <img
                src={settings.doctor_photo_url || '/dr-praveen.jpg'}
                alt="Dr. Praveen - Homoeopathic Physician"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-gray-950/80 to-transparent p-3 text-white text-left">
                <div className="font-bold text-sm">Dr. Praveen</div>
                <div className="text-[11px] text-green-300">Homoeopathic Physician &amp; Consultant</div>
              </div>
            </div>

            {/* Clinic Details */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <Clock className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900 font-semibold">Consultation Hours:</strong>
                  <span className="text-gray-600 text-xs">{settings.clinic_hours}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <MapPin className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900 font-semibold">Clinic Address (Bengaluru):</strong>
                  <span className="text-gray-600 text-xs leading-snug block">
                    120, 5th Cross, Kada Agrahara Main Rd, Vinayaka Layout, Byappanahalli, Bengaluru, Karnataka 560049
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <Phone className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900 font-semibold">Direct Telephone:</strong>
                  <a href={`tel:${settings.primary_phone}`} className="text-brand-blue font-medium text-xs">
                    {settings.primary_phone}
                  </a>
                </div>
              </div>

              <div className="p-2.5 bg-blue-50/80 rounded-xl border border-blue-100 text-[11px] text-brand-blue font-semibold text-center">
                Monthly visiting consultations at: Hyderabad &amp; Narasaraopet
              </div>
            </div>
          </div>

          {/* Clinical Ethics Note */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-xs text-blue-900 space-y-1.5 leading-relaxed">
            <h4 className="font-bold flex items-center gap-1.5 text-brand-blue">
              <ShieldCheck className="w-4 h-4" />
              <span>Personalized Homoeopathic Care</span>
            </h4>
            <p>
              Homoeopathic prescription is individualized according to each person’s constitution and history. Submitting this form does not guarantee instant medication without physician review.
            </p>
          </div>
        </div>

        {/* Right Column: Appointment Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Book Appointment Enquiry
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Fill in your details below to submit an appointment enquiry directly to the doctor’s desk.
            </p>
          </div>

          {submitted && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-xs text-green-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-green-800">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Appointment Enquiry Generated!</span>
              </div>
              <p>
                WhatsApp has been launched with your enquiry details. The clinic will review your timing request and contact you to confirm the appointment.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Consultation Type */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Consultation Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, consultationType: 'in_clinic' })}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition-all ${
                    formData.consultationType === 'in_clinic'
                      ? 'border-brand-blue bg-blue-50 text-brand-blue ring-2 ring-brand-blue/20'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-brand-blue" />
                  <span>In-Clinic (Bengaluru)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, consultationType: 'online' })}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition-all ${
                    formData.consultationType === 'online'
                      ? 'border-brand-green bg-green-50 text-green-800 ring-2 ring-brand-green/20'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Video className="w-4 h-4 text-brand-green" />
                  <span>Online Video Consultation</span>
                </button>
              </div>
            </div>

            {/* Patient Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Patient Full Name <strong className="text-red-500">*</strong>
              </label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                placeholder="Enter patient's name"
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 ${
                  errors.patientName ? 'border-red-500 bg-red-50/50' : 'border-gray-300'
                }`}
              />
              {errors.patientName && (
                <p className="text-xs text-red-600 mt-1">{errors.patientName}</p>
              )}
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Contact Phone / WhatsApp Number <strong className="text-red-500">*</strong>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. 9876543210"
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 ${
                  errors.phone ? 'border-red-500 bg-red-50/50' : 'border-gray-300'
                }`}
              />
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Preferred Date <strong className="text-red-500">*</strong>
                </label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 ${
                    errors.preferredDate ? 'border-red-500 bg-red-50/50' : 'border-gray-300'
                  }`}
                />
                {errors.preferredDate && (
                  <p className="text-xs text-red-600 mt-1">{errors.preferredDate}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Preferred Time Slot
                </label>
                <select
                  value={formData.preferredTimeSlot}
                  onChange={(e) => setFormData({ ...formData, preferredTimeSlot: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 bg-white"
                >
                  <option value="Morning (10:00 AM - 1:30 PM)">Morning: 10:00 AM – 1:30 PM</option>
                  <option value="Evening (5:30 PM - 8:30 PM)">Evening: 5:30 PM – 8:30 PM</option>
                  <option value="Sunday Morning (10:00 AM - 1:00 PM)">Sunday: 10:00 AM – 1:00 PM</option>
                </select>
              </div>
            </div>

            {/* Reason for Appointment (Optional) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Reason for Appointment / Brief Health Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Briefly state symptoms or if this is a follow-up consultation..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              ></textarea>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Please do not submit highly sensitive personal medical records through this form.
              </p>
            </div>

            {/* Important Disclaimer Notice */}
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-[11px] text-gray-500 leading-snug">
              <AlertCircle className="w-3.5 h-3.5 text-yellow-600 inline mr-1" />
              <strong>Notice:</strong> This submission constitutes an appointment enquiry, not a confirmed slot. Our clinic staff will review the schedule and contact you to confirm the consultation.
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-brand-green hover:bg-brand-green-hover text-white text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              <span>Send Appointment Enquiry on WhatsApp</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
