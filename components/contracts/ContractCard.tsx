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

  const borderAccent =
    contract.status === "failed"
      ? "border-l-4 border-l-red-500"
      : pastDue && contract.status === "active"
        ? "border-l-4 border-l-amber-500"
        : "";

  return (
    <Link href={`/contracts/${contract.id}`}>
      <article className={`group border-2 border-zinc-700 bg-zinc-900 p-6 text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] transition-all group-hover:-translate-y-0.5 group-hover:border-l-4 group-hover:border-l-[#EFFF00] ${borderAccent}`}>
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
        <p className="text-xs font-semibold uppercase text-zinc-400">
          Penalty: <span className="font-black text-[#EFFF00]">₹{contract.penalty_amount}</span>
        </p>
      </article>
    </Link>
  );
}

