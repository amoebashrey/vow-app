"use client";

import { useTransition, useState } from "react";
import { createContract } from "../../app/(main)/contracts/new/actions";

type DeadlinePreset = "1W" | "1M" | "3M" | "CUSTOM";

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function CreateContractForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deadlinePreset, setDeadlinePreset] = useState<DeadlinePreset | null>(null);
  const [customDate, setCustomDate] = useState("");

  const presetDays: Record<Exclude<DeadlinePreset, "CUSTOM">, number> = {
    "1W": 7,
    "1M": 30,
    "3M": 90,
  };

  const deadlineValue =
    deadlinePreset === "CUSTOM"
      ? customDate
      : deadlinePreset
        ? addDays(presetDays[deadlinePreset])
        : "";

  function onSubmit(formData: FormData) {
    setError(null);
    if (!deadlineValue) {
      setError("Select a deadline.");
      return;
    }
    formData.set("deadline", deadlineValue);
    startTransition(async () => {
      try {
        await createContract(formData);
      } catch (err: any) {
        setError(err.message ?? "Unable to create contract.");
      }
    });
  }

  const chipBase = "px-4 py-2 font-bebas text-sm tracking-widest uppercase border rounded-[4px] transition-all";
  const chipActive = "border-[#deed00] text-[#deed00] bg-[rgba(222,237,0,0.08)]";
  const chipInactive = "border-[#48474A]/50 text-[#adaaad] hover:border-[#adaaad]";

  return (
    <form action={onSubmit} className="space-y-6">
      {/* YOUR VOW */}
      <div>
        <label className="block font-epilogue text-[10px] font-bold uppercase tracking-[0.2em] text-[#adaaad] mb-2">
          Your Vow
        </label>
        <textarea
          name="goal_text"
          required
          className="w-full bg-transparent border-0 border-b border-[#48474A] px-0 py-3 text-[#f9f9f9] text-sm outline-none focus:ring-0 focus:border-[#f9f9f9] transition-all placeholder:text-[#767577]/40"
          rows={3}
          placeholder="I VOW TO..."
        />
      </div>

      {/* THE DEADLINE */}
      <div>
        <label className="block font-epilogue text-[10px] font-bold uppercase tracking-[0.2em] text-[#adaaad] mb-3">
          The Deadline
        </label>
        <div className="flex gap-2 mb-3">
          {(["1W", "1M", "3M", "CUSTOM"] as DeadlinePreset[]).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setDeadlinePreset(preset)}
              className={`${chipBase} ${deadlinePreset === preset ? chipActive : chipInactive}`}
            >
              {preset}
            </button>
          ))}
        </div>
        {deadlinePreset === "CUSTOM" && (
          <input
            type="date"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-[#48474A] px-0 py-3 text-[#f9f9f9] text-sm outline-none focus:ring-0 focus:border-[#f9f9f9] transition-all"
          />
        )}
      </div>

      {/* THE STAKE */}
      <div>
        <label className="block font-epilogue text-[10px] font-bold uppercase tracking-[0.2em] text-[#adaaad] mb-2">
          The Stake
        </label>
        <div className="flex items-center border-b border-[#48474A] focus-within:border-[#deed00] transition-all">
          <span className="font-bebas text-3xl text-[#deed00] mr-2">₹</span>
          <input
            type="number"
            name="penalty_amount"
            min={1}
            required
            placeholder="0"
            className="w-full bg-transparent border-0 px-0 py-2 font-bebas text-5xl text-[#deed00] outline-none focus:ring-0 placeholder:text-[#deed00]/20"
          />
        </div>
        <p className="font-epilogue text-xs text-[#adaaad]/70 mt-2">Typical: ₹500–₹5,000. Set it where it hurts.</p>
      </div>

      {/* YOUR WITNESS */}
      <div>
        <label className="block font-epilogue text-[10px] font-bold uppercase tracking-[0.2em] text-[#adaaad] mb-2">
          Your Witness
        </label>
        <input
          type="email"
          name="partner_email"
          required
          placeholder="witness@email.com"
          className="w-full bg-transparent border-0 border-b border-[#48474A] px-0 py-3 text-[#f9f9f9] text-sm outline-none focus:ring-0 focus:border-[#f9f9f9] transition-all placeholder:text-[#767577]/40"
        />
        <p className="font-epilogue text-xs text-[#adaaad]/70 mt-2">They must accept before the vow is active.</p>
      </div>

      {error && (
        <p className="text-xs font-semibold uppercase text-[#FF3E00]">{error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#f9f9f9] text-[#09090B] font-bebas text-xl tracking-[0.15em] py-4 uppercase active:scale-[0.98] transition-all hover:shadow-[0_0_20px_rgba(249,249,249,0.3)] disabled:opacity-60"
      >
        {isPending ? "Sealing..." : "Seal the Vow."}
      </button>
      <p className="font-epilogue text-[10px] text-[#adaaad]/50 uppercase tracking-widest text-center">
        Once sealed, terms cannot be changed.
      </p>
    </form>
  );
}
