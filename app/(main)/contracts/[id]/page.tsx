import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";
import { ResolveContractForm } from "../../../../components/contracts/ResolveContractForm";
import { ContractStatusBadge } from "../../../../components/contracts/ContractStatusBadge";
import { CopyButton } from "../../../../components/ui/CopyButton";

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

  const remainingDays = Math.ceil(
    (deadlineDate.getTime() - today.setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen px-4 py-4 md:py-10">
      <div className="mx-auto max-w-3xl">
        {/* Status badge */}
        <div className="mb-4">
          <ContractStatusBadge status={contract.status} />
        </div>

        {/* Goal text — hero */}
        <h1 className="mb-6 text-3xl md:text-5xl font-black uppercase leading-tight text-white">
          {contract.goal_text}
        </h1>

        {/* Penalty card */}
        <div className="mb-6 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 md:p-6">
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
            Potential Forfeit
          </p>
          <p className="text-4xl font-black text-[#EFFF00]">
            ₹{contract.penalty_amount}
          </p>
          <p className="mt-1 text-[9px] uppercase tracking-widest text-zinc-500">
            Collateral Locked
          </p>
        </div>

        {/* Details grid */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              Deadline
            </p>
            <p className="mt-1 text-sm text-zinc-300">
              {deadlineDate.toLocaleDateString()}
            </p>
            <p className="mt-1 text-[10px] text-zinc-500">
              {pastDeadline
                ? "Deadline reached."
                : `${remainingDays} Days Remaining.`}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              Creator
            </p>
            <p className="mt-1 text-sm text-zinc-300">
              {creator?.accepted ? "Locked In" : "Pending"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              Witness
            </p>
            <p className="mt-1 text-sm text-zinc-300">
              {partner?.accepted ? "Locked In" : "Pending"}
            </p>
          </div>
        </div>

        {/* Share link section */}
        {searchParams.created === "1" && !partner?.accepted && (() => {
          const h = headers();
          const host = h.get("host") ?? "localhost:3000";
          const proto = h.get("x-forwarded-proto") ?? "http";
          const acceptUrl = `${proto}://${host}/contracts/${contract.id}/accept`;
          return (
            <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-950/40 p-4">
              <p className="mb-2 text-xs font-black uppercase text-emerald-400">
                Contract created. Share this link with your witness:
              </p>
              <div className="flex items-start gap-2">
                <code className="block flex-1 break-all text-sm text-emerald-300">
                  {acceptUrl}
                </code>
              </div>
              <CopyButton text={acceptUrl} />
              <p className="mt-2 text-xs text-zinc-400">
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

        {/* Resolve section */}
        {canResolve && (
          <div className="mt-6 border-t border-zinc-800 pt-6">
            <p className="mb-3 text-xs uppercase text-zinc-400">
              The deadline has passed. Call it.
            </p>
            <ResolveContractForm contractId={contract.id} />
          </div>
        )}

        {/* Failed state */}
        {contract.status === "failed" && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-950/40 p-6 text-center">
            <p className="text-2xl font-black uppercase text-red-400">Contract Failed.</p>
            <p className="mt-1 text-sm uppercase text-zinc-400">Settle Your Debt:</p>
            <p className="mt-2 text-5xl font-black text-[#EFFF00]">₹{contract.penalty_amount}</p>
            <p className="mt-3 text-xs text-[#adaaad] uppercase tracking-widest">Settle directly with your partner.</p>
            <a
              href={`upi://pay?am=${contract.penalty_amount}&cu=INR&tn=VOW+Contract+Settlement`}
              className="mt-4 inline-block w-full bg-[#f9f9f9] text-black font-bebas text-lg tracking-widest py-4 text-center uppercase"
            >
              Pay via UPI →
            </a>
            <p className="mt-2 text-[9px] text-[#adaaad]/60 uppercase tracking-widest text-center">Opens any UPI app on your device</p>
          </div>
        )}
      </div>
    </div>
  );
}
