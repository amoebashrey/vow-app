"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

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

  const gradients = [
    "radial-gradient(circle at 50% 0%, rgba(239,255,0,0.10), transparent 60%)",
    "radial-gradient(circle at 50% 0%, rgba(239,255,0,0.10), transparent 60%)",
    "radial-gradient(circle at 50% 0%, rgba(255,62,0,0.10), transparent 60%)",
  ];

  return (
    <div
      className="flex min-h-screen flex-col justify-between px-8 py-16"
      style={{ background: `${gradients[screen]}, #09090B` }}
      onClick={advance}
    >
      {/* Top: wordmark + skip */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-[0.4em] text-white">VOW</p>
        <button
          onClick={(e) => { e.stopPropagation(); finish(); }}
          className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-zinc-300"
        >
          Skip
        </button>
      </div>

      {/* Middle: content */}
      <div className="flex-1 flex flex-col justify-center">
        {screen === 0 && (
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
              Introducing Vow.
            </p>
            <h1 className="text-7xl font-black uppercase leading-none text-white">
              A Vow Is Not A Goal.
            </h1>
            <p className="mt-6 text-lg text-zinc-400">
              Goals are forgotten. Vows have consequences.
            </p>
          </div>
        )}

        {screen === 1 && (
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
              How It Works.
            </p>
            <h1 className="mb-8 text-6xl font-black uppercase leading-none text-white">
              Three Steps. No Exceptions.
            </h1>
            <div className="space-y-3">
              {[
                ["01", "Write your commitment and name the penalty."],
                ["02", "Your partner accepts. The clock starts."],
                ["03", "On the deadline — success or failure. No exceptions."],
              ].map(([num, desc]) => (
                <div
                  key={num}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4"
                >
                  <p className="text-sm font-black text-[#EFFF00]">{num}</p>
                  <p className="mt-1 text-sm text-zinc-300">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {screen === 2 && (
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
              Are You Ready.
            </p>
            <h1 className="text-7xl font-black uppercase leading-none text-white">
              Your Word. On The Line.
            </h1>
            <p className="mt-6 text-lg text-zinc-400">
              The people who keep their vows are rare. Prove you&apos;re one of them.
            </p>
          </div>
        )}
      </div>

      {/* Bottom: dots + button */}
      <div onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${i === screen ? "bg-white" : "bg-zinc-700"}`}
            />
          ))}
        </div>
        <button
          onClick={screen < 2 ? () => setScreen(screen + 1) : finish}
          className="w-full bg-white py-5 text-sm font-black uppercase tracking-[0.2em] text-black"
        >
          {screen < 2 ? "Next" : "Begin."}
        </button>
      </div>
    </div>
  );
}
