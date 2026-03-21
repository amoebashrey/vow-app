import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import { ProfileContent } from "../../../components/profile/ProfileContent";

export default async function ProfilePage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/profile");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  // Fetch user's contracts for stats
  const { data: participantData } = await supabase
    .from("contract_participants")
    .select("role, contracts:contracts ( id, goal_text, deadline, status )")
    .eq("user_id", user.id)
    .eq("role", "creator");

  const contracts = participantData
    ?.filter((row: any) => row.contracts)
    .map((row: any) => ({
      id: row.contracts.id,
      goal_text: row.contracts.goal_text,
      deadline: row.contracts.deadline,
      status: row.contracts.status as string,
    })) ?? [];

  const keptCount = contracts.filter((c) => c.status === "completed").length;
  const failedCount = contracts.filter((c) => c.status === "failed").length;
  const pastVows = contracts.filter((c) => c.status === "completed" || c.status === "failed");

  const displayName = profile?.display_name ?? user.email?.split("@")[0] ?? "User";
  const initials = displayName.slice(0, 2).toUpperCase();
  const memberSince = user.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase() : "N/A";

  return (
    <ProfileContent
      displayName={displayName}
      email={user.email ?? ""}
      initials={initials}
      memberSince={memberSince}
      keptCount={keptCount}
      failedCount={failedCount}
      pastVows={pastVows}
    />
  );
}
