'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '../../../lib/supabase/server';

export async function signup(formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const display_name = String(formData.get('display_name') || '').trim();
  const redirectTo = String(formData.get('redirect') || '/dashboard');

  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=${encodeURIComponent((redirectTo?.startsWith('/') && !redirectTo?.startsWith('//')) ? redirectTo : '/dashboard')}` }
  });

  if (error) {
    throw new Error(error.message);
  }

  // Write display_name to profiles table
  if (data.user && display_name) {
    await supabase
      .from('profiles')
      .upsert({
        id: data.user.id,
        display_name,
        updated_at: new Date().toISOString()
      });
  }

  // If email confirmation is ON, session is null – user must click link in email
  if (data.user && !data.session) {
    redirect(`/login?message=confirm_email&email=${encodeURIComponent(email)}`);
  }

  const safeRedirect = (redirectTo?.startsWith('/') && !redirectTo?.startsWith('//')) ? redirectTo : '/dashboard';
  redirect(safeRedirect);
}
