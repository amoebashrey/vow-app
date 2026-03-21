"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

const screens = [
  {
    gradient: "radial-gradient(circle at 50% 20%, rgba(239,255,0,0.12), transparent 60%)",
    eyebrow: "INTRODUCING VOW.",
    headline: "A VOW IS NOT A GOAL.",
    content: (
      <p className="mx-auto max-w-sm text-center text-lg text-zinc-400">
        Goals are forgotten. Vows have consequences.
      </p>
    ),
  },
  {
    gradient: "radial-gradient(circle at 50% 50%, rgba(239,255,0,0.08), transparent 60%)",
    eyebrow: "HOW IT WORKS.",
    headline: "TWO PEOPLE. ONE CONTRACT. REAL STAKES.",
    content: (
      <div className="mx-auto max-w-sm space-y-6 text-left">
        {[
          ["01", "Write your commitment and name the penalty."],
          ["02", "Your partner accepts. The clock starts."],
          ["03", "On the deadline — success or failure. No exceptions."],
        ].map(([num, desc]) => (
          <div key={num} className="flex gap-4">
            <span className="text-2xl font-black text-[#EFFF00]">{num}</span>
            <p className="pt-1 text-zinc-400">{desc}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    gradient: "radial-gradient(circle at 50% 50%, rgba(255,62,0,0.08), transparent 60%)",
    eyebrow: "ARE YOU READY.",
    headline: "YOUR WORD. ON THE LINE.",
    content: (
      <p className="mx-auto max-w-sm text-center text-lg text-zinc-400">
        The people who keep their vows are rare. Prove you&apos;re one of them.
      </p>
    ),
  },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [screen, setScreen] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function check() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace("/dashboard");
        return;
      }
      if (localStorage.getItem("vow_onboarded")) {
        router.replace("/signup");
      } else {
        setReady(true);
      }
    }
    check();
  }, [router]);

  function finish() {
    localStorage.setItem("vow_onboarded", "1");
    router.push("/signup");
  }

  function advance() {
    if (screen < 2) {
      setScreen(screen + 1);
    } else {
      finish();
    }
  }

  if (!ready) return null;

  const s = screens[screen];

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center px-6"
      style={{ background: `${s.gradient}, #09090B` }}
      onClick={advance}
    >
      {/* Skip */}
      <button
        onClick={(e) => { e.stopPropagation(); finish(); }}
        className="absolute right-6 top-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 hover:text-zinc-300"
      >
        Skip.
      </button>

      {/* Content */}
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
          {s.eyebrow}
        </p>
        <h1 className="text-6xl font-black uppercase tracking-tight text-white">
          {s.headline}
        </h1>
        {s.content}
        {screen === 2 && (
          <button
            onClick={(e) => { e.stopPropagation(); finish(); }}
            className="mt-4 bg-white px-12 py-4 text-sm font-black uppercase tracking-[0.2em] text-black"
          >
            Begin.
          </button>
        )}
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-8 flex w-full items-center justify-between px-6">
        {/* Dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${i === screen ? "bg-white" : "bg-zinc-700"}`}
            />
          ))}
        </div>
        {/* Next */}
        {screen < 2 && (
          <button
            onClick={(e) => { e.stopPropagation(); setScreen(screen + 1); }}
            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 hover:text-zinc-300"
          >
            Next.
          </button>
        )}
      </div>
    </div>
  );
}
