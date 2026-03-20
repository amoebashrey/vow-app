import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import { UpdateDisplayNameForm } from "../../components/profile/UpdateDisplayNameForm";
import { DeleteAccountForm } from "../../components/profile/DeleteAccountForm";

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
        <div className="border-2 border-zinc-800 bg-zinc-900 p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="mb-1 text-2xl font-black uppercase tracking-[0.2em]">
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
        <div className="border-2 border-red-900 bg-zinc-900 p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-6 text-xs font-black uppercase tracking-[0.18em] text-red-500">
            Danger Zone.
          </p>
          <DeleteAccountForm />
        </div>

      </div>
    </div>
  );
}
