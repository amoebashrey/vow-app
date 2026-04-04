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
  const [partnerEmail, setPartnerEmail] = useState("");
  const [goalText, setGoalText] = useState("");

  const isContactsSupported = typeof navigator !== "undefined"
    && "contacts" in navigator
    && "ContactsManager" in (window as any);

  const handlePickContact = async () => {
    try {
      const contacts = await (navigator as any).contacts.select(
        ["name", "email"],
        { multiple: false }
      );
      if (contacts.length && contacts[0].email?.length) {
        setPartnerEmail(contacts[0].email[0]);
      }
    } catch { /* user cancelled */ }
  };

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
          maxLength={500}
          value={goalText}
          onChange={(e) => setGoalText(e.target.value)}
          className="w-full bg-transparent border-0 border-b border-[#48474A] px-0 py-3 text-[#f9f9f9] text-sm outline-none focus:ring-0 focus:border-[#f9f9f9] transition-all placeholder:text-[#767577]/40"
          rows={3}
          placeholder="I VOW TO..."
        />
        <p className="font-epilogue text-[10px] text-[#adaaad]/40 text-right mt-1">{goalText.length}/500</p>
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
        <div className="flex items-center justify-between mb-2">
          <label className="block font-epilogue text-[10px] font-bold uppercase tracking-[0.2em] text-[#adaaad]">
            Your Witness
          </label>
          {isContactsSupported && (
            <button
              type="button"
              onClick={handlePickContact}
              className="w-11 h-11 flex items-center justify-center text-[#adaaad] hover:text-[#f9f9f9] transition-colors"
              aria-label="Pick from contacts"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="10" cy="8" r="4" />
                <path d="M2 20c0-4 3.6-7 8-7s8 3 8 7" />
                <line x1="20" y1="8" x2="20" y2="14" /><line x1="17" y1="11" x2="23" y2="11" />
              </svg>
            </button>
          )}
        </div>
        <input
          type="email"
          name="partner_email"
          required
          value={partnerEmail}
          onChange={(e) => setPartnerEmail(e.target.value)}
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
        {isPending ? "Sealing..." : "Seal the Vow"}
      </button>
      <p className="font-epilogue text-[10px] text-[#adaaad]/50 uppercase tracking-widest text-center">
        Once sealed, terms cannot be changed.
      </p>
    </form>
  );
}
