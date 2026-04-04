"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center px-8 text-center relative overflow-hidden">
      <div
        className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[120vw] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(circle at center, rgba(255,62,0,0.15) 0%, rgba(9,9,11,0) 70%)" }}
      />
      <div className="relative z-10">
        <p className="font-bebas text-[120px] leading-none text-[#FF3E00]">500</p>
        <h1 className="font-bebas text-3xl text-[#f9f9f9] mt-2">SOMETHING BROKE</h1>
        <p className="font-epilogue text-sm text-[#adaaad] mt-3 max-w-xs mx-auto">
          An unexpected error occurred. Try again.
        </p>
        <button
          onClick={reset}
          className="mt-8 block w-full max-w-xs mx-auto bg-[#f9f9f9] text-[#09090B] font-bebas text-xl tracking-[0.15em] py-4 uppercase text-center active:scale-[0.98] transition-all"
        >
          Try Again
        </button>
        <Link
          href="/dashboard"
          className="font-epilogue text-xs text-[#adaaad]/50 mt-3 inline-block"
        >
          Go to Dashboard →
        </Link>
      </div>
    </div>
  );
}
