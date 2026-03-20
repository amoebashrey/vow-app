import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import {
  ContractCard,
  type ContractSummary
} from "../../components/contracts/ContractCard";
import { Button } from "../../components/ui/Button";

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
      "role, accepted, contracts:contracts ( id, goal_text, deadline, penalty_amount, status, contract_participants ( role, accepted ) )"
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
          participants:
            contract.contract_participants?.map((p: any) => ({
              role: p.role,
              accepted: p.accepted
            })) ?? []
        } satisfies ContractSummary;
      }) ?? [];

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 pb-6">
        <div>
          <h1 className="mb-1 text-2xl font-black uppercase tracking-[0.2em]">
            Your Vows
          </h1>
          <p className="text-xs uppercase text-zinc-400">
            Contracts you have made or agreed to uphold.
          </p>
        </div>
        <a
          href="/contracts/new"
          className="border-2 border-black bg-black px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-zinc-800"
        >
          New Contract
        </a>
      </div>
      <div className="mx-auto max-w-4xl space-y-4">
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
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              {summaries.filter((c) => c.status === "active").length} Active
              {" · "}
              {summaries.filter((c) => c.status === "completed").length} Completed
              {" · "}
              {summaries.filter((c) => c.status === "failed").length} Failed
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {summaries.map((c) => (
                <ContractCard
                  key={c.id}
                  contract={c}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
