'use client';

import { supabase, isSupabaseConfigured } from './supabase';

const ADMIN_SESSION_KEY = 'drp_admin_session_v1';

export interface AdminUser {
  email: string;
  role: 'admin';
  name: string;
}

export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  // If Supabase is connected with Supabase Auth
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.user) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(
            ADMIN_SESSION_KEY,
            JSON.stringify({
              email: data.user.email,
              role: 'admin',
              name: data.user.user_metadata?.full_name || 'Dr. Praveen',
            })
          );
        }
        return { success: true };
      } else if (error) {
        // If Supabase Auth returned an error, check if this is the initial admin credential
        console.warn('Supabase Auth error:', error.message);
      }
    } catch (e) {
      console.warn('Supabase Auth failed, checking local credentials', e);
    }
  }

  // Initial Administrator Credentials Verification
  // Default doctor administrator credentials for initial clinic onboarding
  const validEmail = 'admin@drpraveenclinic.com';
  const validPass = 'PraveenClinic@2026';

  if (email.trim().toLowerCase() === validEmail.toLowerCase() && password === validPass) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(
        ADMIN_SESSION_KEY,
        JSON.stringify({
          email: validEmail,
          role: 'admin',
          name: 'Dr. Praveen',
        })
      );
    }
    return { success: true };
  }

  return {
    success: false,
    error: 'Invalid administrator email or password. Please verify credentials.',
  };
}

export function getAdminSession(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function logoutAdmin(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }
  if (isSupabaseConfigured() && supabase) {
    supabase.auth.signOut().catch(() => {});
  }
}

export function isUserAdmin(): boolean {
  return Boolean(getAdminSession());
}
