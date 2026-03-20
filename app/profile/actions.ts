'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '../../lib/supabase/server';

export async function updateDisplayName(formData: FormData) {
  const display_name = String(formData.get('display_name') || '').trim();

  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in.');
  }

  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, display_name, updated_at: new Date().toISOString() });

  if (error) {
    throw new Error(error.message);
  }

  redirect('/profile?updated=1');
}

export async function deleteAccount(_formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in.');
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await adminClient.auth.admin.deleteUser(user.id);

  if (error) {
    throw new Error(error.message);
  }

  redirect('/login');
}
