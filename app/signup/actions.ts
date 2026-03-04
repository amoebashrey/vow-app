'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '../../lib/supabase/server';

export async function signup(formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const redirectTo = String(formData.get('redirect') || '/dashboard');

  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=${encodeURIComponent(redirectTo)}` }
  });

  if (error) {
    throw new Error(error.message);
  }

  // If email confirmation is ON, session is null – user must click link in email
  if (data.user && !data.session) {
    redirect(`/login?message=confirm_email&email=${encodeURIComponent(email)}`);
  }

  redirect(redirectTo || '/dashboard');
}
