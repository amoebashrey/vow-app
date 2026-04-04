'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '../../../../../lib/supabase/server';
import { sendPushToUser } from '../../../../../lib/push/sendPush';

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

  const { error: updateError, count } = await supabase
    .from('contract_participants')
    .update({
      user_id: partnerParticipant.user_id ?? user.id,
      accepted: true
    })
    .eq('id', partnerParticipant.id)
    .eq('accepted', false);

  if (updateError) {
    throw new Error(updateError.message);
  }

  if (count === 0) {
    throw new Error('already_accepted');
  }

  // Notify the creator that their partner accepted
  const creatorParticipant = contract.contract_participants?.find(
    (p: any) => p.role === 'creator'
  );
  if (creatorParticipant?.user_id) {
    sendPushToUser(supabase, creatorParticipant.user_id, {
      title: 'Witness locked in',
      body: 'Your partner has accepted the vow. The clock starts now.',
      url: `/contracts/${contractId}`
    }).catch(() => {});
  }

  redirect(`/contracts/${contractId}/accept?accepted=1`);
}
