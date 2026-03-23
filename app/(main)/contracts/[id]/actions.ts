'use server';

import { redirect } from 'next/navigation';
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
  const allAccepted = participants.every((p: any) => p.accepted);
  if (!allAccepted) {
    throw new Error('Both participants must accept before resolving.');
  }

  const { error: updateError } = await supabase
    .from('contracts')
    .update({ status: outcome })
    .eq('id', contractId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  redirect(`/contracts/${contractId}`);
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
