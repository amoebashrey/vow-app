import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import { DashboardContent } from "../../../components/dashboard/DashboardContent";
import { PushSubscribeButton } from "../../../components/ui/PushSubscribeButton";

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
      "role, accepted, contracts:contracts ( id, goal_text, deadline, penalty_amount, status, partner_email, contract_participants ( role, accepted, user_id, profiles ( display_name ) ) )"
    )
    .eq("user_id", user.id);

  const contracts =
    data
      ?.filter((row: any) => row.contracts)
      .map((row: any) => {
        const contract = row.contracts;
        const partnerParticipant = contract.contract_participants?.find(
          (p: any) => p.role === "partner"
        );
        const pp = partnerParticipant?.profiles;
        const rawName = Array.isArray(pp) ? pp[0]?.display_name : pp?.display_name;
        const emailPrefix = (contract.partner_email ?? "partner").split("@")[0];
        const partner_name = rawName || (emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1));
        return {
          id: contract.id,
          goal_text: contract.goal_text,
          deadline: contract.deadline,
          penalty_amount: contract.penalty_amount,
          status: contract.status,
          partner_email: contract.partner_email,
          partner_name,
          role: row.role as "creator" | "partner",
        };
      }) ?? [];

  return (
    <>
      <PushSubscribeButton />
      <DashboardContent contracts={contracts} />
    </>
  );
}
