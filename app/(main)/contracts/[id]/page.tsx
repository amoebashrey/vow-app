import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";
import { ResolveContractForm } from "../../../../components/contracts/ResolveContractForm";
import { CopyButton } from "../../../../components/ui/CopyButton";
import { DeleteContractButton } from "../../../../components/contracts/DeleteContractButton";
import { MarkAsSettledButton } from "../../../../components/contracts/MarkAsSettledButton";

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
      "id, goal_text, deadline, penalty_amount, status, partner_email, creator_id, contract_participants ( role, accepted, user_id, profiles ( display_name ) )"
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
  const currentUserParticipant = participants.find((p: any) => p.user_id === user.id);
  const isCreator = currentUserParticipant?.role === "creator";
  const isPartner = currentUserParticipant?.role === "partner";
  const partner = participants.find((p: any) => p.role === "partner");
  const creator = participants.find((p: any) => p.role === "creator");
  const allAccepted = participants.every((p: any) => p.accepted);

  const emailPrefix = (contract.partner_email ?? "partner").split("@")[0];
  const partnerProfiles: any = partner?.profiles;
  const partnerDisplayName = Array.isArray(partnerProfiles) ? partnerProfiles[0]?.display_name : partnerProfiles?.display_name;
  const partnerName = partnerDisplayName || (emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1));
  const creatorProfiles: any = creator?.profiles;
  const creatorDisplayName = Array.isArray(creatorProfiles) ? creatorProfiles[0]?.display_name : creatorProfiles?.display_name;
  const creatorName = creatorDisplayName || "Creator";

  const today = new Date();
  const deadlineDate = new Date(contract.deadline as string);
  const daysRemaining = Math.ceil(
    (deadlineDate.getTime() - new Date().setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24)
  );
  const isOverdue = daysRemaining <= 0;
  const formattedDeadline = deadlineDate.toLocaleDateString();
  const partnerInitial = partnerName[0].toUpperCase();

  const pendingAcceptance = partner && !partner.accepted;
  const canResolve = contract.status === "active" && isOverdue && allAccepted;

  // Build accept URL for share section
  const h = headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const acceptUrl = `${proto}://${host}/contracts/${contract.id}/accept`;

  // Status pill
  const statusMap: Record<string, { text: string; cls: string }> = {
    active: { text: "Active", cls: "border border-[#22c55e]/50 text-[#22c55e] bg-[#22c55e]/10" },
    completed: { text: "Kept", cls: "border border-[#22c55e]/50 text-[#22c55e] bg-[#22c55e]/10" },
    failed: { text: "Failed", cls: "bg-[#FF3E00]/15 text-[#FF3E00] border border-[#FF3E00]/30" },
    settled: { text: "Settled", cls: "border border-[#adaaad]/30 text-[#adaaad]/60" },
  };
  const { text: statusText, cls: statusPillClass } = statusMap[contract.status] ?? statusMap.active;

  /* ═══ PARTNER / WITNESS VIEW ═══ */
  if (isPartner) {
    return (
      <div className="min-h-screen bg-[#09090B] px-4 py-4 pb-24">
        <div className="py-2 text-center border-b border-[#48474A]/10 mb-6">
          <p className="font-epilogue text-[10px] uppercase tracking-widest text-[#adaaad]">You Are the Witness</p>
        </div>

        <p className="font-epilogue text-[10px] uppercase tracking-widest text-[#adaaad] mb-2">Their Vow</p>
        <h1 className="font-bebas text-3xl md:text-4xl text-[#f9f9f9] leading-tight uppercase mb-6">
          {contract.goal_text}
        </h1>

        <div className="glass-card p-5 rounded-[8px] mb-4">
          <p className="font-epilogue text-[10px] uppercase tracking-widest text-[#adaaad]">Your Stake</p>
          <p className="font-bebas text-5xl text-[#deed00] leading-none mt-1">₹{contract.penalty_amount.toLocaleString("en-IN")}</p>
        </div>

        <div className="glass-card p-5 rounded-[8px] mb-4">
          <p className="font-epilogue text-[10px] uppercase tracking-widest text-[#adaaad]">Deadline</p>
          <p className="font-bebas text-2xl text-[#f9f9f9] leading-none mt-1">{formattedDeadline}</p>
        </div>

        <div className="glass-card p-5 rounded-[8px] mb-6">
          <p className="font-epilogue text-[10px] uppercase tracking-widest text-[#adaaad] mb-3">Creator</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[rgba(38,37,40,0.8)] border border-[#48474A]/30 flex items-center justify-center">
              <span className="font-bebas text-sm text-[#deed00]">{creatorName[0].toUpperCase()}</span>
            </div>
            <p className="font-bebas text-lg text-[#f9f9f9]">{creatorName}</p>
          </div>
        </div>

        {contract.status === "failed" && (
          <div className="p-5 rounded-[8px] bg-[rgba(255,62,0,0.12)] border border-[#FF3E00]/30">
            <p className="font-bebas text-2xl text-[#f9f9f9]">Vow Failed</p>
            <p className="font-epilogue text-sm text-[#adaaad] mt-1">₹{contract.penalty_amount.toLocaleString("en-IN")} is owed to you.</p>
            <a
              href={`upi://pay?am=${contract.penalty_amount}&cu=INR&tn=VOW+Contract+Settlement`}
              className="mt-4 inline-block w-full bg-[#f9f9f9] text-[#09090B] font-bebas text-lg tracking-widest py-4 text-center uppercase active:scale-[0.98] transition-all"
            >
              Collect via UPI →
            </a>
            <MarkAsSettledButton contractId={contract.id} />
          </div>
        )}
      </div>
    );
  }

  /* ═══ CREATOR VIEW ═══ */
  return (
    <div className="min-h-screen bg-[#09090B] px-4 py-4 md:py-8 pb-24">
      {/* Top bar */}
      <header className="h-14 flex items-center mb-6">
        <div className="flex-1 flex justify-end">
          <span className={`px-2 py-0.5 font-epilogue text-[10px] uppercase tracking-widest rounded-[2px] ${statusPillClass}`}>
            {statusText}
          </span>
        </div>
      </header>

      {/* Goal text */}
      <h1 className="font-bebas text-4xl md:text-5xl text-[#f9f9f9] leading-tight uppercase mb-6">
        {contract.goal_text}
      </h1>

      {/* Penalty card */}
      <div className="glass-card p-5 rounded-[8px] mb-4">
        <p className="font-epilogue text-[10px] uppercase tracking-widest text-[#adaaad]">Forfeit if Failed</p>
        <p className="font-bebas text-5xl text-[#deed00] leading-none mt-1">₹{contract.penalty_amount.toLocaleString("en-IN")}</p>
      </div>

      {/* Deadline card */}
      <div className="glass-card p-5 rounded-[8px] mb-4">
        <p className="font-epilogue text-[10px] uppercase tracking-widest text-[#adaaad]">Time Remaining</p>
        <p className={`font-bebas text-3xl leading-none mt-1 ${isOverdue ? "text-[#FF3E00]" : "text-[#f9f9f9]"}`}>
          {isOverdue ? `Overdue by ${Math.abs(daysRemaining)} Days` : `${daysRemaining} Days Remaining`}
        </p>
        <p className="font-epilogue text-xs text-[#adaaad] mt-1">Due: {formattedDeadline}</p>
      </div>

      {/* Witnessed By card */}
      <div className="glass-card p-5 rounded-[8px] mb-6">
        <p className="font-epilogue text-[10px] uppercase tracking-widest text-[#adaaad] mb-3">Witnessed By</p>
        {pendingAcceptance ? (
          <>
            <p className="font-epilogue text-sm text-[#adaaad]">{contract.partner_email}</p>
            <span className="inline-block mt-2 px-2 py-0.5 font-epilogue text-[10px] uppercase tracking-widest rounded-[2px] border border-[#adaaad]/30 text-[#adaaad]">
              Awaiting Acceptance
            </span>
            <div className="mt-4">
                <p className="font-epilogue text-[10px] uppercase tracking-widest text-[#adaaad] mb-2">Share Link</p>
                <code className="block text-xs text-[#adaaad]/70 break-all font-epilogue">{acceptUrl}</code>
                <CopyButton text={acceptUrl} />
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`I've made a VOW. Hold me accountable: ${acceptUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 font-epilogue text-sm text-[#adaaad] hover:text-[#f9f9f9] transition-colors"
                >
                  Share via WhatsApp →
                </a>
              </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[rgba(38,37,40,0.8)] border border-[#48474A]/30 flex items-center justify-center">
              <span className="font-bebas text-sm text-[#deed00]">{partnerInitial}</span>
            </div>
            <div>
              <p className="font-bebas text-lg text-[#f9f9f9]">{partnerName}</p>
              <span className="px-2 py-0.5 font-epilogue text-[10px] uppercase tracking-widest rounded-[2px] border border-[#22c55e]/50 text-[#22c55e] bg-[#22c55e]/10">
                Locked In
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Resolve section */}
      {canResolve && (
        <div className="mt-6">
          <p className="font-bebas text-xl tracking-widest text-[#f9f9f9] mb-4">The Verdict</p>
          <ResolveContractForm contractId={contract.id} />
          <p className="font-epilogue text-[10px] text-[#adaaad]/50 uppercase tracking-widest text-center mt-3">This action is irreversible.</p>
        </div>
      )}

      {/* Failed state */}
      {contract.status === "failed" && (
        <div className="mt-6 p-5 rounded-[8px] bg-[rgba(255,62,0,0.08)] border border-[#FF3E00]/20">
          <p className="font-epilogue text-[10px] uppercase tracking-widest text-[#adaaad]">Vow Failed</p>
          <p className="font-bebas text-5xl text-[#deed00] leading-none mt-1">₹{contract.penalty_amount.toLocaleString("en-IN")}</p>
          <p className="font-epilogue text-xs text-[#adaaad] mt-2">Settle directly with your partner.</p>
          <a
            href={`upi://pay?am=${contract.penalty_amount}&cu=INR&tn=VOW+Contract+Settlement`}
            className="mt-4 inline-block w-full bg-[#f9f9f9] text-[#09090B] font-bebas text-lg tracking-widest py-4 text-center uppercase active:scale-[0.98] transition-all"
          >
            Pay via UPI →
          </a>
          <p className="font-epilogue text-[9px] text-[#adaaad]/50 uppercase tracking-widest text-center mt-2">Opens any UPI app on your device</p>
        </div>
      )}

      {/* Delete — creator only, pending acceptance only */}
      {isCreator && pendingAcceptance && (
        <DeleteContractButton contractId={contract.id} />
      )}
    </div>
  );
}
