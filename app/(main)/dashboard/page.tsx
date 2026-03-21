import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import {
  ContractCard,
  type ContractSummary
} from "../../../components/contracts/ContractCard";
import { Button } from "../../../components/ui/Button";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  const { data } = await supabase
    .from("contract_participants")
    .select(
      "role, accepted, contracts:contracts ( id, goal_text, deadline, penalty_amount, status, partner_email, contract_participants ( role, accepted ) )"
    )
    .eq("user_id", user.id);

  const summaries: ContractSummary[] =
    data
      ?.filter((row: any) => row.contracts)
      .map((row: any) => {
        const contract = row.contracts;
        return {
          id: contract.id,
          goal_text: contract.goal_text,
          deadline: contract.deadline,
          penalty_amount: contract.penalty_amount,
          status: contract.status,
          partner_email: contract.partner_email,
          participants:
            contract.contract_participants?.map((p: any) => ({
              role: p.role,
              accepted: p.accepted
            })) ?? []
        } satisfies ContractSummary;
      }) ?? [];

  const active = summaries.filter((c) => c.status === "active");
  const completed = summaries.filter((c) => c.status === "completed");
  const failed = summaries.filter((c) => c.status === "failed");
  const totalExposure = active.reduce((sum, c) => sum + c.penalty_amount, 0);
  const resolved = completed.length + failed.length;
  const successRate = resolved > 0 ? Math.round((completed.length / resolved) * 100) : null;
  const overdue = active.filter((c) => new Date(c.deadline) < new Date());

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-zinc-500">
          Sovereign Accountability
        </p>
        <h1 className="mb-8 text-5xl font-black uppercase">Your Vows.</h1>

        {summaries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-4xl font-black uppercase">No Vows Yet.</h2>
            <p className="mt-2 text-xs uppercase tracking-widest text-zinc-500">
              Your word means nothing until you put it on the line.
            </p>
            <Link href="/contracts/new" className="mt-6">
              <Button>Make Your First Vow.</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Stats cards — responsive grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="glass-card border border-[#48474A]/15 p-8 flex flex-col justify-between h-44 rounded-xl">
                <span className="text-[10px] tracking-widest text-[#adaaad] font-bold uppercase font-['Epilogue']">Total Liability</span>
                <span className="text-4xl font-['Bebas_Neue'] text-[#deed00] tracking-widest">₹{totalExposure.toLocaleString()}</span>
              </div>
              <div className="glass-card border border-[#48474A]/15 p-8 flex flex-col justify-between h-44 rounded-xl">
                <span className="text-[10px] tracking-widest text-[#adaaad] font-bold uppercase font-['Epilogue']">Active Contracts</span>
                <span className="text-4xl font-['Bebas_Neue'] text-[#f9f9f9] tracking-widest">{String(active.length).padStart(2, "0")}</span>
              </div>
              <div className="glass-card border border-[#48474A]/15 p-8 flex flex-col justify-between h-44 rounded-xl">
                <span className="text-[10px] tracking-widest text-[#adaaad] font-bold uppercase font-['Epilogue']">Success Rate</span>
                <span className="text-4xl font-['Bebas_Neue'] text-[#f9f9f9] tracking-widest">{successRate !== null ? `${successRate}%` : "—"}</span>
              </div>
            </div>

            {/* Section label */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Epilogue'] text-xs font-bold tracking-[0.2em] text-[#48474A] uppercase">Active Commitments</h3>
              <div className="h-px bg-[#48474A]/20 flex-grow ml-6"></div>
            </div>

            {/* Nudge bar */}
            {overdue.length > 0 && (
              <div className="mb-4 flex items-center justify-between rounded-lg border border-[#EFFF00]/10 bg-[#EFFF00]/[0.04] px-4 py-2">
                <p className="text-[10px] uppercase tracking-widest text-zinc-400">
                  {overdue.length} contract{overdue.length > 1 ? "s" : ""} awaiting resolution.
                </p>
                <Link
                  href={`/contracts/${overdue[0].id}`}
                  className="text-[10px] font-bold uppercase tracking-widest text-[#EFFF00]"
                >
                  Resolve →
                </Link>
              </div>
            )}

            {/* Contract list — single column */}
            <div className="flex flex-col gap-4">
              {summaries.map((c) => (
                <ContractCard key={c.id} contract={c} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
