"use client";

import { useTransition } from "react";
import { markAsSettled } from "../../app/(main)/contracts/[id]/actions";

export function MarkAsSettledButton({ contractId }: { contractId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await markAsSettled(contractId);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="mt-3 w-full font-epilogue text-sm text-[#adaaad] hover:text-[#f9f9f9] transition-colors py-2 disabled:opacity-50"
    >
      {isPending ? "Settling..." : "Mark as Settled"}
    </button>
  );
}
