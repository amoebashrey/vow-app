"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ContractItem {
  id: string;
  goal_text: string;
  deadline: string;
  penalty_amount: number;
  status: "active" | "completed" | "failed";
  partner_email?: string;
  partner_name?: string;
  role: "creator" | "partner";
}

function daysRemaining(deadline: string) {
  const today = new Date();
  const end = new Date(deadline);
  const diffMs = end.getTime() - today.setHours(0, 0, 0, 0);
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function PastVowsToggle({ items, label }: { items: ContractItem[]; label: string }) {
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;
  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 border-t border-[#48474A]/15 mt-4 min-h-[48px] text-[#adaaad] hover:text-[#f9f9f9] transition-colors"
      >
        <span className="font-bebas text-sm tracking-widest uppercase">{label} ({items.length})</span>
        <span className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}>›</span>
      </button>
      {open && (
        <div className="space-y-2 mt-2">
          {items.map((v) => (
            <div
              key={v.id}
              className={`glass-card p-4 rounded-[8px] flex items-center justify-between border-l-2 ${v.status === "completed" ? "border-[#22c55e]" : "border-[#FF3E00]"}`}
            >
              <div>
                <p className="font-bebas text-base text-[#f9f9f9] line-clamp-1">{v.goal_text}</p>
                <p className="font-epilogue text-[10px] text-[#adaaad]">{new Date(v.deadline).toLocaleDateString()}</p>
              </div>
              <span
                className={`px-2 py-0.5 font-epilogue text-[10px] uppercase tracking-widest rounded-[2px] ${v.status === "completed" ? "border border-[#22c55e]/50 text-[#22c55e] bg-[#22c55e]/10" : "bg-[#FF3E00]/15 text-[#FF3E00] border border-[#FF3E00]/30"}`}
              >
                {v.status === "completed" ? "KEPT" : "FAILED"}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export function DashboardContent({ contracts }: { contracts: ContractItem[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"vows" | "stakes">("vows");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const myVows = contracts.filter((c) => c.role === "creator");
  const stakes = contracts.filter((c) => c.role === "partner");

  // My Vows stats
  const activeVows = myVows.filter((c) => c.status === "active");
  const pastVows = myVows.filter((c) => c.status === "completed" || c.status === "failed");
  const totalAtStake = activeVows.reduce((sum, c) => sum + c.penalty_amount, 0);
  const resolved = pastVows.length;
  const kept = myVows.filter((c) => c.status === "completed").length;
  const successRate = resolved > 0 ? Math.round((kept / resolved) * 100) : 0;

  // Stakes
  const activeStakes = stakes.filter((c) => c.status === "active");
  const pastStakes = stakes.filter((c) => c.status === "completed" || c.status === "failed");

  return (
    <div className="min-h-screen bg-[#09090B] pb-24">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="font-bebas text-5xl text-[#f9f9f9] uppercase">Your Vows</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#48474A]/10 bg-[#09090B]">
        <button
          className={`font-bebas text-sm tracking-widest uppercase flex-1 py-3 border-b-2 transition-all duration-150 ${activeTab === "vows" ? "text-[#f9f9f9] border-[#deed00]" : "text-[#adaaad] border-transparent"}`}
          onClick={() => setActiveTab("vows")}
        >
          My Vows
        </button>
        <button
          className={`font-bebas text-sm tracking-widest uppercase flex-1 py-3 border-b-2 transition-all duration-150 ${activeTab === "stakes" ? "text-[#f9f9f9] border-[#deed00]" : "text-[#adaaad] border-transparent"}`}
          onClick={() => setActiveTab("stakes")}
        >
          Stakes
        </button>
      </div>

      {/* MY VOWS TAB */}
      {activeTab === "vows" && (
        <div className="px-4 pt-4">
          {activeVows.length === 0 && pastVows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <h3 className="font-bebas text-4xl text-[#adaaad]">No Active Vows</h3>
              <p className="font-epilogue text-sm text-[#adaaad]/60 mt-2">Make one</p>
              <button
                onClick={() => router.push("/contracts/new")}
                className="mt-8 w-full bg-[#f9f9f9] text-[#09090B] font-bebas text-xl tracking-[0.15em] py-4 uppercase active:scale-[0.98] transition-all"
              >
                Make One
              </button>
            </div>
          ) : (
            <>
              {/* Stat bar */}
              <div className="flex gap-3 py-4">
                <div className="glass-card flex-1 p-4 rounded-[8px]">
                  <p className="font-epilogue text-[10px] uppercase tracking-widest text-[#adaaad]">At Stake</p>
                  <h4 className="font-bebas text-3xl text-[#deed00] leading-none mt-1">₹{totalAtStake.toLocaleString("en-IN")}</h4>
                </div>
                <div className="glass-card flex-1 p-4 rounded-[8px]">
                  <p className="font-epilogue text-[10px] uppercase tracking-widest text-[#adaaad]">Active</p>
                  <h4 className="font-bebas text-3xl text-[#f9f9f9] leading-none mt-1">{activeVows.length}</h4>
                </div>
                <div className="glass-card flex-1 p-4 rounded-[8px]">
                  <p className="font-epilogue text-[10px] uppercase tracking-widest text-[#adaaad]">Success Rate</p>
                  <h4 className="font-bebas text-3xl text-[#f9f9f9] leading-none mt-1">{successRate}%</h4>
                </div>
              </div>

              {/* Active contract cards */}
              <div className="space-y-3">
                {activeVows.map((contract) => {
                  const days = daysRemaining(contract.deadline);
                  const isOverdue = days <= 0;
                  const partnerInitial = (contract.partner_name ?? contract.partner_email ?? "?")[0].toUpperCase();
                  return (
                    <div
                      key={contract.id}
                      className={`glass-card p-5 rounded-[8px] cursor-pointer transition-all hover:border-[rgba(72,71,74,0.4)] ${isOverdue ? "border-l-[3px] border-[#FF3E00]" : ""}`}
                      onClick={() => router.push(`/contracts/${contract.id}`)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bebas text-xl text-[#f9f9f9] leading-tight line-clamp-2 flex-1">{contract.goal_text}</h3>
                        {isOverdue && (
                          <span className="px-2 py-0.5 font-epilogue text-[10px] uppercase tracking-widest rounded-[2px] bg-[#FF3E00] text-white shrink-0">Overdue</span>
                        )}
                      </div>
                      <div className="flex items-end justify-between mt-3">
                        <div>
                          <p className="font-epilogue text-[10px] uppercase tracking-widest text-[#adaaad]">Penalty</p>
                          <p className="font-bebas text-2xl text-[#deed00] leading-none">₹{contract.penalty_amount.toLocaleString("en-IN")}</p>
                        </div>
                        {!isOverdue && <p className="font-bebas text-sm text-[#f9f9f9]">{days} Days Left</p>}
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="w-6 h-6 rounded-full bg-[rgba(38,37,40,0.8)] border border-[#48474A]/30 flex items-center justify-center">
                          <span className="font-bebas text-[10px] text-[#deed00]">{partnerInitial}</span>
                        </div>
                        <span className="font-epilogue text-xs text-[#adaaad]">Watched by {contract.partner_name ?? (contract.partner_email ?? "partner").split("@")[0]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Past vows toggle */}
              <PastVowsToggle items={pastVows} label="Past Vows" />
            </>
          )}
        </div>
      )}

      {/* STAKES TAB */}
      {activeTab === "stakes" && (
        <div className="px-4 pt-4">
          {stakes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <h3 className="font-bebas text-4xl text-[#adaaad]">No Stakes Yet</h3>
              <p className="font-epilogue text-sm text-[#adaaad]/60 mt-2 max-w-xs">When someone names you as their witness, it appears here.</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {activeStakes.map((contract) => {
                  const days = daysRemaining(contract.deadline);
                  const isOverdue = days <= 0;
                  return (
                    <div
                      key={contract.id}
                      className="glass-card p-5 rounded-[8px] cursor-pointer transition-all hover:border-[rgba(72,71,74,0.4)]"
                      onClick={() => router.push(`/contracts/${contract.id}`)}
                    >
                      <h3 className="font-bebas text-lg text-[#f9f9f9]">Watching</h3>
                      <p className="font-bebas text-4xl text-[#deed00] leading-none mt-1">₹{contract.penalty_amount.toLocaleString("en-IN")}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-epilogue text-sm text-[#adaaad]">{new Date(contract.deadline).toLocaleDateString()}</span>
                        <span className={`px-2 py-0.5 font-epilogue text-[10px] uppercase tracking-widest rounded-[2px] ${isOverdue ? "bg-[#FF3E00] text-white" : "border border-[#22c55e]/50 text-[#22c55e] bg-[#22c55e]/10"}`}>
                          {isOverdue ? "Overdue" : "Active"}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Failed stakes */}
                {stakes.filter((c) => c.status === "failed").map((contract) => (
                  <div key={contract.id} className="p-5 rounded-[8px] bg-[rgba(255,62,0,0.12)] border border-[#FF3E00]/30">
                    <h3 className="font-bebas text-lg text-[#f9f9f9]">Failed Vow</h3>
                    <p className="font-bebas text-4xl text-[#deed00] leading-none mt-1">₹{contract.penalty_amount.toLocaleString("en-IN")}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-epilogue text-sm text-[#adaaad]">{new Date(contract.deadline).toLocaleDateString()}</span>
                      <span className="px-2 py-0.5 font-epilogue text-[10px] uppercase tracking-widest rounded-[2px] bg-[#FF3E00] text-white">Failed</span>
                    </div>
                    <button
                      onClick={() => router.push(`/contracts/${contract.id}`)}
                      className="mt-4 w-full bg-[#f9f9f9] text-[#09090B] font-bebas text-lg tracking-widest py-3 uppercase active:scale-[0.98] transition-all"
                    >
                      Mark as Settled
                    </button>
                  </div>
                ))}
              </div>

              <PastVowsToggle items={pastStakes.filter((c) => c.status === "completed")} label="Past Stakes" />
            </>
          )}
        </div>
      )}
    </div>
  );
}
