'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '../../../../lib/supabase/server';

export async function createContract(formData: FormData) {
  const goalText = String(formData.get('goal_text') || '').trim();
  const deadline = String(formData.get('deadline') || '').trim();
  const penaltyRaw = String(formData.get('penalty_amount') || '').trim();
  const partnerEmail = String(formData.get('partner_email') || '').trim();

  if (!goalText || !deadline || !penaltyRaw || !partnerEmail) {
    throw new Error('All fields are required.');
  }

  if (!partnerEmail.includes('@')) {
    throw new Error('Please enter a valid email address for your witness.');
  }

  const penaltyAmount = Number(penaltyRaw);
  if (!Number.isFinite(penaltyAmount) || penaltyAmount <= 0) {
    throw new Error('Penalty must be a positive number.');
  }

  const today = new Date();
  const deadlineDate = new Date(deadline);
  if (Number.isNaN(deadlineDate.getTime()) || deadlineDate <= today) {
    throw new Error('Deadline must be in the future.');
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in to create a contract.');
  }

  const { data: contract, error: contractError } = await supabase
    .from('contracts')
    .insert({
      goal_text: goalText,
      deadline,
      penalty_amount: penaltyAmount,
      creator_id: user.id,
      partner_email: partnerEmail
    })
    .select('id')
    .single();

  if (contractError || !contract) {
    throw new Error(contractError?.message ?? 'Failed to create contract.');
  }

  const { error: participantsError } = await supabase
    .from('contract_participants')
    .insert([
      {
        contract_id: contract.id,
        user_id: user.id,
        role: 'creator',
        accepted: true
      },
      {
        contract_id: contract.id,
        user_id: null,
        role: 'partner',
        accepted: false
      }
    ]);

  if (participantsError) {
    throw new Error(participantsError.message);
  }

  redirect(`/contracts/${contract.id}?created=1`);
}
