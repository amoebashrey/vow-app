import Link from "next/link";
import { ContractStatusBadge } from "./ContractStatusBadge";

interface ParticipantSummary {
  role: "creator" | "partner";
  accepted: boolean;
}

export interface ContractSummary {
  id: string;
  goal_text: string;
  deadline: string;
  penalty_amount: number;
  status: "active" | "completed" | "failed";
  participants: ParticipantSummary[];
}

interface ContractCardProps {
  contract: ContractSummary;
}

function daysRemaining(deadline: string) {
  const today = new Date();
  const end = new Date(deadline);
  const diffMs = end.getTime() - today.setHours(0, 0, 0, 0);
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function ContractCard({ contract }: ContractCardProps) {
  const remaining = daysRemaining(contract.deadline);
  const pastDue = remaining < 0;
  const pendingPartner = contract.participants.some(
    (p) => p.role === "partner" && !p.accepted
  );

  const bloomColor =
    contract.status === "failed" ? "bg-red-500/[0.12]" : "bg-[#EFFF00]/[0.12]";

  return (
    <Link href={`/contracts/${contract.id}`}>
      <article className="relative overflow-hidden bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 text-white transition-all hover:-translate-y-0.5 hover:border-white/[0.15]">
        <div className={`pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full ${bloomColor}`} />
        <div className="mb-3 flex items-center justify-between gap-2">
          <ContractStatusBadge status={contract.status} />
          {pendingPartner && (
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-600">
              Pending Acceptance
            </span>
          )}
        </div>
        <p className="mb-3 line-clamp-2 text-sm font-semibold uppercase">
          {contract.goal_text}
        </p>
        <p className="mb-2 text-xs uppercase text-zinc-400">
          {pastDue
            ? "Deadline passed. Awaiting resolution."
            : `${remaining} Days Remaining. Execute.`}
        </p>
        <div className="my-3 h-px bg-white/[0.06]" />
        <p className="text-xs font-semibold uppercase text-zinc-400">
          Penalty: <span className="text-base font-black text-[#EFFF00]">₹{contract.penalty_amount}</span>
        </p>
      </article>
    </Link>
  );
}
