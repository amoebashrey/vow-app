'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '../../../../lib/supabase/server';

export async function resolveContract(
  contractId: string,
  outcome: 'completed' | 'failed'
) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in to resolve a contract.');
  }

  const { data: contract, error } = await supabase
    .from('contracts')
    .select(
      'id, status, deadline, contract_participants ( role, accepted, user_id )'
    )
    .eq('id', contractId)
    .single();

  if (error || !contract) {
    throw new Error(error?.message ?? 'Contract not found.');
  }

  if (contract.status !== 'active') {
    throw new Error('Contract already resolved.');
  }

  const today = new Date();
  const deadlineDate = new Date(contract.deadline as string);
  if (deadlineDate > today) {
    throw new Error('Cannot resolve before the deadline.');
  }

  const participants = contract.contract_participants || [];

  const isCreator = participants.some(
    (p: any) => p.role === 'creator' && p.user_id === user.id
  );
  if (!isCreator) {
    throw new Error('Only the creator can resolve this contract.');
  }

  const allAccepted = participants.every((p: any) => p.accepted);
  if (!allAccepted) {
    throw new Error('Both participants must accept before resolving.');
  }

  const { error: updateError } = await supabase
    .from('contracts')
    .update({ status: outcome })
    .eq('id', contractId)
    .eq('status', 'active');

  if (updateError) {
    throw new Error(updateError.message);
  }

  redirect(`/contracts/${contractId}`);
}

export async function markAsSettled(contractId: string) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in.' };
  }

  const { data: contract, error } = await supabase
    .from('contracts')
    .select(
      'id, status, contract_participants ( role, user_id )'
    )
    .eq('id', contractId)
    .single();

  if (error || !contract) {
    return { error: error?.message ?? 'Contract not found.' };
  }

  if (contract.status !== 'failed') {
    return { error: 'Only failed contracts can be marked as settled.' };
  }

  const participants = contract.contract_participants || [];
  const isPartner = participants.some(
    (p: any) => p.role === 'partner' && p.user_id === user.id
  );

  if (!isPartner) {
    return { error: 'Only the witness can mark a contract as settled.' };
  }

  const { error: updateError } = await supabase
    .from('contracts')
    .update({ status: 'settled' })
    .eq('id', contractId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath(`/contracts/${contractId}`);
  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteContract(contractId: string) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in.');
  }

  const { error } = await supabase
    .from('contracts')
    .delete()
    .eq('id', contractId)
    .eq('creator_id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  redirect('/dashboard');
}
