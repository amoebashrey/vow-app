"use client";

import { useTransition, useState } from "react";
import { deleteAccount } from "../../app/(main)/profile/actions";

export function DeleteAccountForm() {
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await deleteAccount(formData);
      } catch (err: any) {
        setError(err.message ?? "Unable to delete account.");
      }
    });
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <p className="text-xs font-black uppercase text-red-400">
        This cannot be undone. All your contracts will be deleted.
      </p>
      <div>
        <label className="block text-xs font-semibold uppercase text-zinc-400">
          Type DELETE to confirm.
        </label>
        <input
          name="confirm"
          type="text"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="DELETE"
          className="mt-2 w-full border-b-2 border-zinc-600 bg-transparent px-0 py-2 text-sm text-zinc-50 outline-none placeholder:text-zinc-600 focus:border-red-500"
        />
      </div>
      {error && (
        <p className="text-xs font-semibold uppercase text-red-400">{error}</p>
      )}
      <button
        type="submit"
        disabled={confirm !== "DELETE" || isPending}
        className="border-2 border-red-600 bg-red-600 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-red-700 disabled:opacity-40"
      >
        {isPending ? "Deleting..." : "Delete My Account."}
      </button>
    </form>
  );
}
