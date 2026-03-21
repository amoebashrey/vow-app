import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import { UpdateDisplayNameForm } from "../../../components/profile/UpdateDisplayNameForm";
import { DeleteAccountForm } from "../../../components/profile/DeleteAccountForm";

interface ProfilePageProps {
  searchParams: { updated?: string };
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
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

  const updated = searchParams.updated === "1";

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-8">

        {/* Identity section */}
        <div className="glass-card rounded-xl border border-[#48474A]/15 p-8">
          <h1 className="font-bebas mb-1 text-4xl font-black uppercase">
            Your Profile.
          </h1>
          <p className="mb-6 text-xs uppercase text-zinc-400">
            {user.email}
          </p>
          <p className="mb-6 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
            Your Identity.
          </p>
          <UpdateDisplayNameForm
            displayName={profile?.display_name ?? null}
            updated={updated}
          />
        </div>

        {/* Danger zone section */}
        <div className="flex items-center gap-4 my-8">
          <div className="h-px flex-grow bg-red-800/30" />
          <h2 className="text-2xl font-black text-red-500 uppercase tracking-widest">DANGER ZONE.</h2>
          <div className="h-px flex-grow bg-red-800/30" />
        </div>
        <div className="glass-card rounded-xl border border-red-900/30 p-8">
          <DeleteAccountForm />
        </div>

      </div>
    </div>
  );
}
