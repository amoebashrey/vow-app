'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '../../../../../lib/supabase/server';

export async function acceptContract(contractId: string) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in to accept a contract.');
  }

  const { data: contract, error: contractError } = await supabase
    .from('contracts')
    .select(
      'id, contract_participants ( id, role, accepted, user_id )'
    )
    .eq('id', contractId)
    .single();

  if (contractError || !contract) {
    throw new Error(contractError?.message ?? 'Contract not found.');
  }

  const partnerParticipant =
    contract.contract_participants?.find(
      (p: any) => p.role === 'partner'
    ) ?? null;

  if (!partnerParticipant) {
    throw new Error('Partner participant not found.');
  }

  if (partnerParticipant.accepted) {
    throw new Error('already_accepted');
  }

  const { error: updateError } = await supabase
    .from('contract_participants')
    .update({
      user_id: partnerParticipant.user_id ?? user.id,
      accepted: true
    })
    .eq('id', partnerParticipant.id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  redirect(`/contracts/${contractId}/accept?accepted=1`);
}
