"use client";

import { useState, useTransition } from "react";
import { deleteContract } from "../../app/(main)/contracts/[id]/actions";

export function DeleteContractButton({ contractId }: { contractId: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      try {
        await deleteContract(contractId);
      } catch (err: any) {
        setError(err.message ?? "Unable to delete.");
      }
    });
  }

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="font-epilogue text-sm text-[#FF3E00] cursor-pointer mt-6"
      >
        Delete Vow
      </button>
    );
  }

  return (
    <div className="mt-6 p-5 rounded-[8px] border border-[#FF3E00]/20 bg-[rgba(255,62,0,0.05)]">
      <p className="font-bebas text-xl text-[#f9f9f9] mb-2">Delete This Vow?</p>
      <p className="font-epilogue text-sm text-[#adaaad] mb-4">
        This contract hasn&apos;t been accepted yet. Deleting it is permanent.
      </p>
      {error && <p className="font-epilogue text-xs text-[#FF3E00] mb-2">{error}</p>}
      <div className="flex gap-3">
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="flex-1 bg-[#FF3E00] text-white font-bebas text-lg tracking-widest py-3 uppercase active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {isPending ? "Deleting..." : "Delete"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="flex-1 border border-[#48474A]/30 text-[#adaaad] font-bebas text-lg tracking-widest py-3 uppercase hover:text-[#f9f9f9] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
