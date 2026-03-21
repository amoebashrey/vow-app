"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UpdateDisplayNameForm } from "./UpdateDisplayNameForm";
import { DeleteAccountForm } from "./DeleteAccountForm";

interface PastVow {
  id: string;
  goal_text: string;
  deadline: string;
  status: string;
}

interface ProfileContentProps {
  displayName: string;
  email: string;
  initials: string;
  memberSince: string;
  keptCount: number;
  failedCount: number;
  pastVows: PastVow[];
}

export function ProfileContent({
  displayName,
  email,
  initials,
  memberSince,
  keptCount,
  failedCount,
  pastVows,
}: ProfileContentProps) {
  const router = useRouter();
  const [showPast, setShowPast] = useState(false);
  const [showEditName, setShowEditName] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090B] px-4 py-8 pb-24">
      {/* Avatar */}
      <div className="flex flex-col items-center py-8">
        <div className="w-20 h-20 rounded-full bg-[rgba(38,37,40,0.8)] border border-[#48474A]/30 flex items-center justify-center">
          <span className="font-bebas text-3xl text-[#deed00]">{initials}</span>
        </div>
        <h1 className="font-bebas text-3xl text-[#f9f9f9] mt-4">{displayName}</h1>
        <p className="font-epilogue text-xs text-[#adaaad] mt-1">Contract Member Since {memberSince}</p>
      </div>

      {/* My Record */}
      <div className="mb-8">
        <p className="font-bebas text-sm tracking-widest text-[#adaaad] uppercase mb-3">My Record</p>
        <div className="glass-card p-5 rounded-[8px]">
          <div className="flex gap-6">
            <div className="flex-1 text-center border-r border-[#48474A]/20">
              <p className="font-bebas text-4xl text-[#22c55e]">{keptCount}</p>
              <p className="font-epilogue text-[10px] uppercase tracking-widest text-[#adaaad] mt-1">Kept</p>
            </div>
            <div className="flex-1 text-center">
              <p className="font-bebas text-4xl text-[#FF3E00]">{failedCount}</p>
              <p className="font-epilogue text-[10px] uppercase tracking-widest text-[#adaaad] mt-1">Failed</p>
            </div>
          </div>
        </div>

        {/* Past vows toggle */}
        {pastVows.length > 0 && (
          <>
            <button
              onClick={() => setShowPast(!showPast)}
              className="w-full flex items-center justify-between py-3 border-t border-[#48474A]/15 mt-4 min-h-[48px] text-[#adaaad] hover:text-[#f9f9f9] transition-colors"
            >
              <span className="font-bebas text-sm tracking-widest uppercase">Past Vows ({pastVows.length})</span>
              <span className={`transition-transform duration-200 ${showPast ? "rotate-90" : ""}`}>›</span>
            </button>
            {showPast && (
              <div className="space-y-2 mt-2">
                {pastVows.map((vow) => (
                  <div
                    key={vow.id}
                    className={`glass-card p-4 rounded-[8px] flex items-center justify-between border-l-2 ${vow.status === "completed" ? "border-[#22c55e]" : "border-[#FF3E00]"}`}
                  >
                    <div>
                      <p className="font-bebas text-base text-[#f9f9f9] line-clamp-1">{vow.goal_text}</p>
                      <p className="font-epilogue text-[10px] text-[#adaaad]">{new Date(vow.deadline).toLocaleDateString()}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 font-epilogue text-[10px] uppercase tracking-widest rounded-[2px] ${vow.status === "completed" ? "border border-[#22c55e]/50 text-[#22c55e] bg-[#22c55e]/10" : "bg-[#FF3E00]/15 text-[#FF3E00] border border-[#FF3E00]/30"}`}
                    >
                      {vow.status === "completed" ? "Kept" : "Failed"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Account section */}
      <div className="border-t border-[#48474A]/15 pt-6">
        <p className="font-bebas text-sm tracking-widest text-[#adaaad] uppercase mb-4">Account</p>

        <button
          onClick={() => setShowEditName(!showEditName)}
          className="w-full text-left py-4 font-epilogue text-sm text-[#f9f9f9] border-b border-[#48474A]/10"
        >
          Edit Display Name
        </button>
        {showEditName && (
          <div className="py-4 border-b border-[#48474A]/10">
            <UpdateDisplayNameForm displayName={displayName} updated={false} />
          </div>
        )}

        <form action="/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full text-left py-4 font-epilogue text-sm text-[#adaaad] border-b border-[#48474A]/10"
          >
            Logout
          </button>
        </form>

        <button
          onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
          className="w-full text-left py-4 font-epilogue text-sm text-[#FF3E00]"
        >
          Delete Account
        </button>
        {showDeleteConfirm && (
          <div className="py-4">
            <DeleteAccountForm />
          </div>
        )}
      </div>
    </div>
  );
}
