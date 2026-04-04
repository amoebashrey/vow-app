"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center px-8 text-center relative overflow-hidden">
      <div
        className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-full h-[500px] opacity-80 pointer-events-none"
        style={{ background: "radial-gradient(circle at center, rgba(222,237,0,0.15) 0%, rgba(9,9,11,0) 70%)" }}
      />
      <div className="relative z-10">
        <p className="font-bebas text-[120px] leading-none text-[#deed00]">404</p>
        <h1 className="font-bebas text-3xl text-[#f9f9f9] mt-2">VOW NOT FOUND</h1>
        <p className="font-epilogue text-sm text-[#adaaad] mt-3 max-w-xs mx-auto">
          This vow doesn&apos;t exist or has been removed
        </p>
        <Link
          href="/dashboard"
          className="mt-8 block w-full max-w-xs mx-auto bg-[#f9f9f9] text-[#09090B] font-bebas text-xl tracking-[0.15em] py-4 uppercase text-center active:scale-[0.98] transition-all"
        >
          Go to Dashboard
        </Link>
        <button
          onClick={() => router.back()}
          className="font-epilogue text-xs text-[#adaaad]/50 mt-3"
        >
          Or go back
        </button>
      </div>
    </div>
  );
}
