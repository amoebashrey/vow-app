import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import { ResolveContractForm } from "../../../components/contracts/ResolveContractForm";
import { ContractStatusBadge } from "../../../components/contracts/ContractStatusBadge";

interface ContractDetailPageProps {
  params: { id: string };
  searchParams: { created?: string };
}

export default async function ContractDetailPage({
  params,
  searchParams
}: ContractDetailPageProps) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/contracts/${params.id}`);
  }

  const { data: contract } = await supabase
    .from("contracts")
    .select(
      "id, goal_text, deadline, penalty_amount, status, partner_email, creator_id, contract_participants ( role, accepted, user_id )"
    )
    .eq("id", params.id)
    .single();

  if (!contract) {
    return (
      <div className="min-h-screen px-4 py-10">
        <p className="text-sm text-red-400">Contract not found.</p>
      </div>
    );
  }

  const participants = contract.contract_participants || [];
  const creator = participants.find((p: any) => p.role === "creator");
  const partner = participants.find((p: any) => p.role === "partner");
  const allAccepted = participants.every((p: any) => p.accepted);

  const today = new Date();
  const deadlineDate = new Date(contract.deadline as string);
  const pastDeadline = deadlineDate <= today;

  const canResolve =
    contract.status === "active" && pastDeadline && allAccepted;

  const penaltyText = `Contract Failed. Settle your debt: ₹${contract.penalty_amount}.`;

  const remainingDays = Math.ceil(
    (deadlineDate.getTime() - today.setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-3xl border-2 border-black bg-white p-8 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-black uppercase tracking-[0.2em]">
            Contract
          </h1>
          <ContractStatusBadge status={contract.status} />
        </div>

        <div className="mb-6 border border-dashed border-zinc-400 p-4 text-sm">
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">
            Commitment
          </p>
          <p>{contract.goal_text}</p>
        </div>

        <div className="mb-6 grid gap-4 text-xs uppercase text-zinc-700 md:grid-cols-3">
          <div>
            <p className="font-semibold">Deadline</p>
            <p className="mt-1 normal-case">
              {deadlineDate.toLocaleDateString()}
            </p>
            <p className="mt-1 text-[11px] text-zinc-600">
              {pastDeadline
                ? "Deadline reached."
                : `${remainingDays} Days Remaining. Execute.`}
            </p>
          </div>
          <div>
            <p className="font-semibold">Penalty</p>
            <p className="mt-1 normal-case font-black">
              ₹{contract.penalty_amount}
            </p>
          </div>
          <div>
            <p className="font-semibold">Participants</p>
            <p className="mt-1 normal-case">
              Creator:{" "}
              <span className="font-semibold">
                {creator?.accepted ? "Locked In" : "Pending"}
              </span>
            </p>
            <p className="mt-1 normal-case">
              Partner:{" "}
              <span className="font-semibold">
                {partner?.accepted ? "Locked In" : "Pending"}
              </span>
            </p>
          </div>
        </div>

        {searchParams.created === "1" && !partner?.accepted && (() => {
          const h = headers();
          const host = h.get("host") ?? "localhost:3000";
          const proto = h.get("x-forwarded-proto") ?? "http";
          const acceptUrl = `${proto}://${host}/contracts/${contract.id}/accept`;
          return (
            <div className="mb-6 border-2 border-emerald-500 bg-emerald-50 p-4">
              <p className="mb-2 text-xs font-black uppercase text-emerald-800">
                Contract created. Share this link with your partner:
              </p>
              <code className="block break-all text-sm text-emerald-900">
                {acceptUrl}
              </code>
              <p className="mt-2 text-xs text-emerald-700">
                They must sign in with the email you used ({contract.partner_email}).
              </p>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`I've made a VOW. Hold me accountable: ${acceptUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block border-2 border-emerald-700 bg-emerald-600 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-emerald-700"
              >
                Share on WhatsApp.
              </a>
            </div>
          );
        })()}

        {canResolve && (
          <div className="mt-6 border-t border-zinc-200 pt-6">
            <p className="mb-3 text-xs uppercase text-zinc-700">
              The deadline has passed. Call it.
            </p>
            <ResolveContractForm contractId={contract.id} />
          </div>
        )}

        {contract.status === "failed" && (
          <p className="mt-6 text-sm font-black uppercase text-red-600">
            {penaltyText}
          </p>
        )}
      </div>
    </div>
  );
}
