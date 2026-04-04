import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../../../lib/supabase/server";
import { AcceptContractForm } from "../../../../../components/contracts/AcceptContractForm";
import { InstallPromptBanner } from "../../../../../components/ui/InstallPromptBanner";

interface AcceptPageProps {
  params: { id: string };
  searchParams: { accepted?: string };
}

export default async function AcceptContractPage({
  params,
  searchParams
}: AcceptPageProps) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/onboarding?redirect=/contracts/${params.id}/accept`);
  }

  const { data: contract } = await supabase
    .from("contracts")
    .select(
      "id, goal_text, penalty_amount, status, contract_participants ( role, accepted )"
    )
    .eq("id", params.id)
    .single();

  if (!contract) {
    redirect("/dashboard");
  }

  const partnerParticipant =
    contract.contract_participants?.find(
      (p: any) => p.role === "partner"
    ) ?? null;

  const alreadyAccepted = partnerParticipant?.accepted;
  const isInactive = contract.status !== "active";

  return (
    <div className="min-h-screen bg-[#09090B] px-4 py-10 pb-24">
      <InstallPromptBanner />

      <p className="font-bebas text-2xl tracking-[0.4em] text-[#f9f9f9] text-center mb-8">VOW</p>

      <div className="glass-card p-6 rounded-[8px] max-w-lg mx-auto">
        <p className="font-epilogue text-[10px] uppercase tracking-widest text-[#adaaad] mb-2">Their Vow</p>
        <h1 className="font-bebas text-3xl text-[#f9f9f9] leading-tight mb-6">{contract.goal_text}</h1>

        <p className="font-epilogue text-[10px] uppercase tracking-widest text-[#adaaad]">Penalty</p>
        <p className="font-bebas text-4xl text-[#deed00] leading-none">₹{contract.penalty_amount.toLocaleString("en-IN")}</p>

        <div className="border-t border-[#48474A]/20 my-5" />

        {isInactive && (
          <p className="font-epilogue text-sm text-[#FF3E00]">This vow is no longer active</p>
        )}
        {!isInactive && alreadyAccepted && (
          <p className="font-epilogue text-sm text-[#22c55e]">You are locked in as the witness</p>
        )}
        {!isInactive && !alreadyAccepted && searchParams.accepted === "1" && (
          <p className="font-epilogue text-sm text-[#22c55e]">Locked in. Hold them to it</p>
        )}
        {!isInactive && !alreadyAccepted && searchParams.accepted !== "1" && (
          <div className="mt-2">
            <AcceptContractForm contractId={contract.id} />
          </div>
        )}
      </div>
    </div>
  );
}
