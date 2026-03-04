import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import { CreateContractForm } from "../../../components/contracts/CreateContractForm";

export default async function NewContractPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/contracts/new");
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-2xl border-2 border-black bg-zinc-900/60 p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="mb-2 text-2xl font-black uppercase tracking-[0.2em]">
          New Contract
        </h1>
        <p className="mb-8 text-xs uppercase text-zinc-400">
          Declare the commitment. Set the stakes. Invite your partner.
        </p>
        <CreateContractForm />
      </div>
    </div>
  );
}
