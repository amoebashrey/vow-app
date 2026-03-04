"use client";

import { useTransition, useState } from "react";
import { acceptContract } from "../../app/contracts/[id]/accept/actions";

interface AcceptContractFormProps {
  contractId: string;
}

export function AcceptContractForm({ contractId }: AcceptContractFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onAccept() {
    setError(null);
    startTransition(async () => {
      try {
        await acceptContract(contractId);
      } catch (err: any) {
        if (err.message === "not_partner") {
          setError("You are not the partner on this contract.");
          return;
        }
        if (err.message === "already_accepted") {
          setError("You have already accepted this contract.");
          return;
        }
        setError(err.message ?? "Unable to accept contract.");
      }
    });
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-xs font-semibold uppercase text-red-400">{error}</p>
      )}
      <button
        type="button"
        onClick={onAccept}
        disabled={isPending}
        className="border-2 border-black bg-black px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-zinc-800 disabled:opacity-60"
      >
        {isPending ? "Accepting..." : "Accept Contract"}
      </button>
    </div>
  );
}
