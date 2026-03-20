"use client";

import { useTransition, useState } from "react";
import { updateDisplayName } from "../../app/profile/actions";

interface UpdateDisplayNameFormProps {
  displayName: string | null;
  updated: boolean;
}

export function UpdateDisplayNameForm({
  displayName,
  updated
}: UpdateDisplayNameFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await updateDisplayName(formData);
      } catch (err: any) {
        setError(err.message ?? "Unable to update name.");
      }
    });
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-black uppercase">
          Your Name.
        </label>
        <input
          name="display_name"
          type="text"
          defaultValue={displayName ?? ""}
          placeholder="How should we address you?"
          className="mt-2 w-full border-b-2 border-zinc-600 bg-transparent px-0 py-2 text-sm text-zinc-50 outline-none placeholder:text-zinc-500 focus:border-zinc-300"
        />
      </div>
      {updated && !error && (
        <p className="text-xs font-semibold uppercase text-emerald-400">
          Name updated.
        </p>
      )}
      {error && (
        <p className="text-xs font-semibold uppercase text-red-400">{error}</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="border-2 border-white bg-transparent px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-white hover:text-black disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save."}
      </button>
    </form>
  );
}
