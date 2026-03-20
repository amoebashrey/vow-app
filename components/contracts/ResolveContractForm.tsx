"use client";

import { useTransition, useState } from "react";
import { resolveContract } from "../../app/(main)/contracts/[id]/actions";

interface ResolveContractFormProps {
  contractId: string;
}

export function ResolveContractForm({ contractId }: ResolveContractFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onResolve(outcome: "completed" | "failed") {
    setError(null);
    startTransition(async () => {
      try {
        await resolveContract(contractId, outcome);
      } catch (err: any) {
        setError(err.message ?? "Unable to resolve contract.");
      }
    });
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-xs font-semibold uppercase text-red-400">{error}</p>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() => onResolve("completed")}
          className="flex-1 border-2 border-emerald-500 bg-emerald-600 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          Mark as Success
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => onResolve("failed")}
          className="flex-1 border-2 border-red-600 bg-red-700 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white hover:bg-red-600 disabled:opacity-60"
        >
          Mark as Failed
        </button>
      </div>
    </div>
  );
}

