"use client";

import { useTransition, useState } from "react";
import { createContract } from "../../app/(main)/contracts/new/actions";

export function CreateContractForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await createContract(formData);
      } catch (err: any) {
        setError(err.message ?? "Unable to create contract.");
      }
    });
  }

  return (
    <form
      action={onSubmit}
      className="space-y-4 md:space-y-6"
    >
      <div>
        <label className="block text-xs font-black uppercase">
          State your commitment.
        </label>
        <textarea
          name="goal_text"
          required
          className="mt-2 w-full border-b-2 border-black bg-transparent px-0 py-1.5 md:py-2 text-sm text-zinc-50 outline-none placeholder:text-zinc-500"
          rows={3}
          placeholder="I VOW TO..."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-black uppercase">
            Set your deadline.
          </label>
          <input
            type="date"
            name="deadline"
            required
            className="mt-2 w-full border-b-2 border-black bg-transparent px-0 py-1.5 md:py-2 text-sm text-zinc-50 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-black uppercase">
            Price of Failure (₹)
          </label>
          <input
            type="number"
            name="penalty_amount"
            min={1}
            required
            className="mt-2 w-full border-b-2 border-black bg-transparent px-0 py-1.5 md:py-2 text-sm text-zinc-50 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-black uppercase">
          Your partner&apos;s email.
        </label>
        <input
          type="email"
          name="partner_email"
          required
          className="mt-2 w-full border-b-2 border-black bg-transparent px-0 py-1.5 md:py-2 text-sm text-zinc-50 outline-none"
          placeholder="they@example.com"
        />
      </div>

      {error && (
        <p className="text-xs font-semibold uppercase text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-4 w-full border-2 border-black bg-black px-4 py-2.5 md:py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-zinc-800 disabled:opacity-60"
      >
        {isPending ? "Creating..." : "Create Contract"}
      </button>
      <p className="mt-4 text-center text-[9px] uppercase tracking-widest text-zinc-600">
        By creating this contract, you acknowledge the weight of your commitment.
      </p>
    </form>
  );
}
