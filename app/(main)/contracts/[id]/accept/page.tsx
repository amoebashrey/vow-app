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
      "id, goal_text, status, contract_participants ( role, accepted )"
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
    <div className="min-h-screen px-4 py-10">
      <InstallPromptBanner />
      <div className="mx-auto max-w-2xl border-2 border-black bg-zinc-900/60 p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="mb-2 text-2xl font-black uppercase tracking-[0.2em]">
          Accept Contract
        </h1>
        <p className="mb-6 text-sm text-zinc-300">
          Your partner has drawn a line. Read it carefully, then decide.
        </p>
        <div className="mb-6 border border-dashed border-zinc-700 p-4 text-sm text-zinc-200">
          <p className="mb-1 text-xs font-semibold uppercase text-zinc-500">
            Commitment
          </p>
          <p>{contract.goal_text}</p>
        </div>
        {isInactive && (
          <p className="text-xs font-semibold uppercase text-red-400">
            This vow is no longer active
          </p>
        )}
        {!isInactive && alreadyAccepted && (
          <p className="text-xs font-semibold uppercase text-emerald-400">
            You have already accepted this vow
          </p>
        )}
        {!isInactive && !alreadyAccepted && searchParams.accepted === "1" && (
          <p className="text-xs font-semibold uppercase text-emerald-400">
            Contract accepted. Hold them to it.
          </p>
        )}
        {!isInactive && !alreadyAccepted && searchParams.accepted !== "1" && (
          <div className="mt-6">
            <AcceptContractForm contractId={contract.id} />
          </div>
        )}
      </div>
    </div>
  );
}
