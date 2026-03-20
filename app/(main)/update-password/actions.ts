'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '../../../lib/supabase/server';

export async function updatePassword(formData: FormData) {
  const password = String(formData.get('password') || '');

  if (!password) {
    throw new Error('Password is required.');
  }

  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    throw new Error(error.message);
  }

  redirect('/dashboard');
}
