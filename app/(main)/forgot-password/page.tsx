"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { sendPasswordReset } from "./actions";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      try {
        await sendPasswordReset(formData);
        setSuccess(true);
      } catch (err: any) {
        setError(err.message ?? "Unable to send reset link.");
      }
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#09090B]">
      {/* Background blooms */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-1/4 w-[400px] h-[400px] bg-[#deed00]/5 blur-[100px] rounded-full" />
      </div>

      <main className="w-full max-w-md relative z-10">
        {/* Brand header */}
        <div className="mb-6 md:mb-12 text-center">
          <h1 className="font-bebas text-4xl tracking-[0.2em] text-[#f9f9f9]">VOW</h1>
        </div>

        {/* Glass card */}
        <div
          className="relative overflow-hidden rounded-xl border border-[#48474A]/15 p-6 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
        >
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 blur-[60px] pointer-events-none rounded-full" />

          <header className="mb-5 md:mb-8 text-center">
            <h2 className="font-bebas text-4xl tracking-[0.1em] text-[#f9f9f9] leading-none">Reset Your Vow Access.</h2>
            <p className="font-epilogue text-xs tracking-widest text-[#adaaad] mt-3 uppercase">Enter your email. We will send a reset link.</p>
          </header>

          <form action={onSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label className="block font-epilogue text-[10px] tracking-[0.2em] text-[#adaaad] uppercase mb-2">
                Account Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full bg-transparent border-0 border-b border-[#48474A] py-2 md:py-3 px-0 text-[#f9f9f9] focus:ring-0 focus:border-[#f9f9f9] transition-all text-sm tracking-wide outline-none"
              />
            </div>

            {success && (
              <p className="text-xs font-semibold uppercase text-emerald-400">
                Check your email. Reset link sent.
              </p>
            )}
            {error && (
              <p className="text-xs font-semibold uppercase text-[#FF3E00]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#f9f9f9] text-black font-bebas text-xl tracking-[0.15em] py-4 uppercase active:scale-[0.98] transition-all hover:shadow-[0_0_20px_rgba(249,249,249,0.3)] disabled:opacity-60"
            >
              {isPending ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>

        <footer className="mt-6 md:mt-8 text-center">
          <p className="font-epilogue text-sm text-[#adaaad]">
            Remembered it?{" "}
            <Link href="/login" className="text-[#f9f9f9] hover:underline">Login →</Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
