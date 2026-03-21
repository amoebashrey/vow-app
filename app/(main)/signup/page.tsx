"use client";

import { useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";
import { signup } from "./actions";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    formData.set("redirect", redirectTo);
    startTransition(async () => {
      try {
        await signup(formData);
      } catch (err: any) {
        setError(err.message ?? "Unable to sign up.");
      }
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#09090B]">
      {/* Background blooms */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-1/4 w-[400px] h-[400px] bg-[#deed00]/5 blur-[100px] rounded-full" />
      </div>

      <main className="w-full max-w-md relative z-10">
        {/* Brand header */}
        <div className="mb-12 text-center">
          <h1 className="font-['Bebas_Neue'] text-4xl tracking-[0.2em] text-[#f9f9f9]">VOW</h1>
        </div>

        {/* Glass card */}
        <div
          className="relative overflow-hidden rounded-xl border border-[#48474A]/15 p-8 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)', backdropFilter: 'blur(24px)' }}
        >
          {/* Bloom inside card */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 blur-[60px] pointer-events-none rounded-full" />

          <header className="mb-10 text-center">
            <h2 className="font-['Bebas_Neue'] text-5xl tracking-[0.1em] text-[#f9f9f9] leading-none">JOIN THE VOW.</h2>
            <p className="font-['Epilogue'] text-xs tracking-widest text-[#adaaad] mt-4 opacity-70 uppercase">Execute the sovereign verdict.</p>
          </header>

          <form action={onSubmit} className="space-y-8">
            <div>
              <label className="block font-['Epilogue'] text-[10px] tracking-[0.2em] text-[#adaaad] uppercase mb-2">
                Your Name
              </label>
              <input
                name="display_name"
                type="text"
                className="w-full bg-transparent border-0 border-b border-[#48474A] py-3 px-0 text-[#f9f9f9] focus:ring-0 focus:border-[#f9f9f9] transition-all text-sm tracking-wide outline-none"
              />
            </div>
            <div>
              <label className="block font-['Epilogue'] text-[10px] tracking-[0.2em] text-[#adaaad] uppercase mb-2">
                Account Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full bg-transparent border-0 border-b border-[#48474A] py-3 px-0 text-[#f9f9f9] focus:ring-0 focus:border-[#f9f9f9] transition-all text-sm tracking-wide outline-none"
              />
            </div>
            <div>
              <label className="block font-['Epilogue'] text-[10px] tracking-[0.2em] text-[#adaaad] uppercase mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full bg-transparent border-0 border-b border-[#48474A] py-3 px-0 text-[#f9f9f9] focus:ring-0 focus:border-[#f9f9f9] transition-all text-sm tracking-wide outline-none"
              />
            </div>

            {error && (
              <p className="text-xs font-semibold uppercase text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#f9f9f9] text-black font-['Bebas_Neue'] text-xl tracking-[0.15em] py-4 mt-4 uppercase active:scale-[0.98] transition-all hover:shadow-[0_0_20px_rgba(249,249,249,0.3)] disabled:opacity-60"
            >
              {isPending ? "Creating..." : "Create Account."}
            </button>
          </form>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center">
          <a
            href="/login"
            className="font-['Epilogue'] text-sm tracking-wide text-[#adaaad] hover:text-[#f9f9f9] transition-colors"
          >
            Already have an account? <span className="text-[#f9f9f9] hover:underline">Login →</span>
          </a>
        </footer>
      </main>
    </div>
  );
}
