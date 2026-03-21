import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import { DashboardContent } from "../../../components/dashboard/DashboardContent";

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

  const contracts =
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
          role: row.role as "creator" | "partner",
        };
      }) ?? [];

  return <DashboardContent contracts={contracts} />;
}
