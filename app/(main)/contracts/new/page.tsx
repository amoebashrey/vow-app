import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";
import { CreateContractForm } from "../../../../components/contracts/CreateContractForm";

export default async function NewContractPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/contracts/new");
  }

  return (
    <div className="min-h-screen px-4 py-8 pb-24">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-2 text-6xl font-black uppercase leading-none">NEW CONTRACT.</h1>
        <p className="mb-8 text-sm uppercase tracking-widest text-[#adaaad] opacity-70">
          Define the terms of your sovereignty.
        </p>
        <div className="glass-card rounded-xl border border-[#48474A]/15 p-8">
          <CreateContractForm />
        </div>
      </div>
    </div>
  );
}
