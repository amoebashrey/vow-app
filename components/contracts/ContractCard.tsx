import Link from "next/link";

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
  const shortId = contract.id.slice(0, 8).toUpperCase();

  return (
    <Link href={`/contracts/${contract.id}`}>
      <article className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 text-white transition-all hover:-translate-y-0.5 hover:border-white/[0.15]">
        {/* Top row: dot + contract ID */}
        <div className="flex items-center">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#EFFF00]" />
          <span className="text-[10px] uppercase tracking-widest text-zinc-500">
            Contract #{shortId}
          </span>
        </div>

        {/* Goal text */}
        <h3 className="mb-3 mt-2 text-2xl font-black uppercase">
          {contract.goal_text}
        </h3>

        {/* Bottom row */}
        <div className="flex items-end justify-between">
          <div>
            <span className="block text-[9px] uppercase tracking-[0.2em] text-zinc-500">
              Penalty
            </span>
            <span className="text-2xl font-black text-[#EFFF00]">
              ₹{contract.penalty_amount.toLocaleString()}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-[9px] uppercase tracking-[0.2em] text-zinc-500">
              Remaining
            </span>
            {pastDue ? (
              <span className="text-lg font-black text-red-400">Overdue</span>
            ) : (
              <span className="text-lg font-black text-white">
                {String(remaining).padStart(2, "0")} Days
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
