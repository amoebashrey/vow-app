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
  partner_email?: string;
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
      <article className="glass-card group border border-[#48474A]/15 rounded-xl p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between transition-all duration-300 hover:border-white/20">
        {/* Left: contract info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#deed00] shadow-[0_0_10px_#EFFF00]" />
            <span className="text-[10px] tracking-widest text-[#adaaad] font-bold uppercase font-['Epilogue']">
              Contract #{shortId}
            </span>
          </div>
          <h3 className="font-['Bebas_Neue'] text-3xl md:text-4xl text-[#f9f9f9] tracking-[0.05em] uppercase">
            {contract.goal_text}
          </h3>
          <p className="text-xs text-[#adaaad] max-w-md font-['Inter'] leading-relaxed tracking-wide">
            Witness: {contract.partner_email ?? "Pending"}
          </p>
        </div>
        {/* Right: penalty + remaining */}
        <div className="mt-8 md:mt-0 flex flex-row md:flex-col items-end justify-between md:justify-center gap-2 md:text-right">
          <div className="flex flex-col items-start md:items-end">
            <span className="text-[10px] tracking-widest text-[#adaaad] font-bold uppercase font-['Epilogue'] mb-1">Penalty</span>
            <span className="text-4xl font-['Bebas_Neue'] text-[#deed00] tracking-widest leading-none">
              ₹{contract.penalty_amount.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] tracking-widest text-[#48474A] font-bold uppercase font-['Epilogue']">Remaining</span>
            {pastDue ? (
              <span className="text-xl font-['Bebas_Neue'] text-[#ff3e00] tracking-widest uppercase">Overdue</span>
            ) : (
              <span className="text-xl font-['Bebas_Neue'] text-[#f9f9f9] tracking-widest uppercase">
                {String(remaining).padStart(2, "0")} Days
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
