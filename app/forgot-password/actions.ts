'use server';

import { createSupabaseServerClient } from '../../lib/supabase/server';

export async function sendPasswordReset(formData: FormData) {
  const email = String(formData.get('email') || '').trim();

  if (!email) {
    throw new Error('Email is required.');
  }

  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/auth/callback?next=/update-password',
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
