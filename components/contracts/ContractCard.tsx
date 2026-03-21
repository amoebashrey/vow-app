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
      <article className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-white transition-all hover:-translate-y-0.5 hover:border-white/[0.15]">
        <div className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full ${bloomColor}`} />
        <div className="mb-2 flex items-center">
          <ContractStatusBadge status={contract.status} />
          {pendingPartner && (
            <span className="ml-2 text-[9px] font-black uppercase text-amber-400">
              Pending
            </span>
          )}
        </div>
        <p className="mb-2 truncate text-sm font-bold uppercase">
          {contract.goal_text}
        </p>
        <div className="flex items-center justify-between">
          {pastDue ? (
            <span className="text-[10px] uppercase text-red-400">Overdue</span>
          ) : (
            <span className="text-[10px] uppercase text-zinc-500">{remaining} Days</span>
          )}
          <span className="text-sm font-black text-[#EFFF00]">₹{contract.penalty_amount}</span>
        </div>
      </article>
    </Link>
  );
}
