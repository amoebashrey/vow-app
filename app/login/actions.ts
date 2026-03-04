'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '../../lib/supabase/server';

export async function login(formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const redirectTo = String(formData.get('redirect') || '/dashboard');

  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    // Friendly message when Supabase has "Confirm email" turned on
    if (error.message?.toLowerCase().includes('email') && error.message?.toLowerCase().includes('confirm')) {
      throw new Error('EMAIL_NOT_CONFIRMED');
    }
    throw new Error(error.message);
  }

  redirect(redirectTo || '/dashboard');
}

/**
 * Resend confirmation email. Use when user sees "Email not confirmed" on login.
 * Supabase Dashboard: Authentication → Providers → Email → "Confirm email" must be ON.
 */
export async function resendConfirmation(email: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email.trim()
  });
  if (error) throw new Error(error.message);
}
