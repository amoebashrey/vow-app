"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

const steps = [
  { label: "01", title: "The Commitment", text: "Write your commitment and name the penalty." },
  { label: "02", title: "The Agreement", text: "Your partner accepts. The clock starts." },
  { label: "03", title: "The Verdict", text: "On the deadline — success or failure. No exceptions." },
];

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
      if (localStorage.getItem("vow_onboarding_seen") === "true") {
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get("redirect");
        router.replace(redirectTo ? `/signup?redirect=${encodeURIComponent(redirectTo)}` : "/signup");
      } else {
        setReady(true);
      }
    }
    check();
  }, [router]);

  function finish() {
    localStorage.setItem("vow_onboarding_seen", "true");
    const params = new URLSearchParams(window.location.search);
    const redirectTo = params.get("redirect");
    if (redirectTo) {
      router.push(`/signup?redirect=${encodeURIComponent(redirectTo)}`);
    } else {
      router.push("/signup");
    }
  }

  function advance() {
    if (screen < 2) {
      setScreen(screen + 1);
    } else {
      finish();
    }
  }

  if (!ready) return null;

  /* ───── SCREEN 1: A VOW IS NOT A GOAL ───── */
  if (screen === 0) {
    return (
      <div
        className="relative min-h-screen flex flex-col justify-between px-6 py-12 bg-[#09090B] overflow-hidden"
        onClick={advance}
      >
        {/* Volt bloom */}
        <div
          className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-full h-[500px] opacity-80 pointer-events-none"
          style={{ background: "radial-gradient(circle at center, rgba(222,237,0,0.15) 0%, rgba(9,9,11,0) 70%)" }}
        />

        {/* Top: wordmark + skip */}
        <div className="relative z-10 flex items-center justify-between">
          <p className="font-bebas text-2xl tracking-[0.4em] text-white">VOW</p>
          <button onClick={(e) => { e.stopPropagation(); finish(); }} className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-zinc-300">
            Skip
          </button>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-epilogue uppercase tracking-[0.4em] text-white opacity-60">Introducing Vow.</span>
          <h1 className="font-bebas text-7xl md:text-9xl tracking-tighter leading-[0.9] text-white mt-4">
            A Vow Is Not<br />A Goal.
          </h1>
          <p className="font-epilogue text-base text-[#adaaad] mt-4">
            Goals are forgotten. Vows have consequences.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
          </div>
          <button
            onClick={() => setScreen(1)}
            className="w-full h-16 bg-white text-black font-bebas text-xl tracking-[0.2em] uppercase active:scale-[0.98] transition-transform"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  /* ───── SCREEN 2: HOW IT WORKS ───── */
  if (screen === 1) {
    return (
      <div
        className="relative min-h-screen flex flex-col bg-[#09090B] overflow-hidden"
        onClick={advance}
      >
        {/* Volt bloom */}
        <div
          className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-full h-[500px] opacity-80 pointer-events-none"
          style={{ background: "radial-gradient(circle at center, rgba(222,237,0,0.15) 0%, rgba(9,9,11,0) 70%)" }}
        />

        {/* Top bar */}
        <header className="relative z-10 px-6 h-16 flex items-center justify-between border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-xl">
          <p className="font-bebas text-2xl tracking-[0.2em] text-white">VOW</p>
          <button onClick={(e) => { e.stopPropagation(); finish(); }} className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-zinc-300">
            Skip
          </button>
        </header>

        {/* Main content */}
        <main className="relative z-10 flex-grow flex flex-col justify-center px-6 pt-8 pb-32 max-w-2xl mx-auto w-full">
          <h1 className="font-bebas text-6xl md:text-7xl tracking-tight leading-none text-white mb-8">
            Three Steps.<br />No Exceptions.
          </h1>

          <div className="space-y-4">
            {steps.map((step, i) => (
              <div
                key={step.label}
                className={`glass-card p-6 rounded-lg flex flex-col gap-3 ${i === 1 ? "border-l-2 border-[#deed00]" : ""}`}
              >
                <span className="font-bebas text-4xl text-[#deed00]">{step.label}</span>
                <div>
                  <p className="font-epilogue text-[10px] uppercase tracking-widest text-[#767577] mb-1">{step.title}</p>
                  <p className="font-epilogue text-base md:text-lg text-[#f9f9f9] leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Fixed footer */}
        <footer className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#09090B] via-[#09090B] to-transparent z-20" onClick={(e) => e.stopPropagation()}>
          <div className="max-w-2xl mx-auto flex flex-col gap-6">
            <div className="flex justify-center items-center gap-3">
              <div className="h-1 w-8 bg-[#767577]/30 rounded-full" />
              <div className="h-1.5 w-12 bg-[#deed00] rounded-full" />
              <div className="h-1 w-8 bg-[#767577]/30 rounded-full" />
            </div>
            <button
              onClick={() => setScreen(2)}
              className="w-full h-16 bg-white text-black font-bebas text-xl tracking-[0.2em] uppercase active:scale-[0.98] transition-transform shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              Next
            </button>
          </div>
        </footer>
      </div>
    );
  }

  /* ───── SCREEN 3: YOUR WORD. ON THE LINE. ───── */
  return (
    <div
      className="relative min-h-screen flex flex-col bg-[#09090B] overflow-hidden"
      onClick={advance}
    >
      {/* Background layers */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Red bloom */}
        <div
          className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[120vw] h-[400px]"
          style={{ background: "radial-gradient(circle at center, rgba(255,62,0,0.15) 0%, rgba(9,9,11,0) 70%)" }}
        />
        {/* Gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/80 to-transparent z-20" />
      </div>

      {/* Main content — pinned to bottom */}
      <main className="relative z-30 flex-grow flex flex-col justify-end px-8 pb-12 max-w-2xl mx-auto w-full" onClick={(e) => e.stopPropagation()}>
        {/* Progress dots */}
        <div className="mb-12 flex items-center space-x-3">
          <div className="h-1 w-8 bg-[#262528]" />
          <div className="h-1 w-8 bg-[#262528]" />
          <div className="h-1 w-12 bg-white" />
        </div>

        {/* Headline */}
        <div className="space-y-6 mb-16">
          <p className="font-epilogue text-[10px] uppercase tracking-[0.4em] text-[#adaaad]">Are You Ready.</p>
          <h1 className="font-bebas text-6xl md:text-8xl leading-none tracking-[0.05em] uppercase">
            Your Word.<br />
            <span className="text-[#FF3E00]">On The Line.</span>
          </h1>
          <p className="font-epilogue text-lg text-[#adaaad] max-w-sm leading-relaxed">
            The people who keep their vows are rare. Prove you&apos;re one of them.
          </p>
        </div>

        {/* Glass action card */}
        <div className="rounded-sm border border-white/5 p-1" style={{ backdropFilter: "blur(24px)", background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)" }}>
          <button
            onClick={finish}
            className="w-full bg-[#f9f9f9] text-black font-bebas text-2xl py-5 tracking-[0.2em] uppercase active:scale-[0.98] transition-all hover:bg-white"
          >
            Begin.
          </button>
        </div>

        {/* Footer details */}
        <div className="mt-12 flex justify-between items-end">
          <div className="flex flex-col">
            <span className="font-bebas text-xs tracking-[0.3em] text-[#767577]/50 uppercase">Access Protocol</span>
            <span className="font-epilogue text-[10px] text-[#767577]/40 uppercase tracking-widest mt-1">Sovereign Verdict v1.0.4</span>
          </div>
          <div className="w-12 h-12 flex items-center justify-center border border-[#48474A]/30 rounded-full opacity-50">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 2a5 5 0 015 5v3H7V7a5 5 0 015-5z" />
              <rect x="3" y="10" width="18" height="12" rx="2" />
            </svg>
          </div>
        </div>
      </main>
    </div>
  );
}
