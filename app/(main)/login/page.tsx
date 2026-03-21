"use client";

import { useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";
import { login, resendConfirmation } from "./actions";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/dashboard";
  const message = searchParams.get("message");
  const emailParam = searchParams.get("email") ?? "";
  const [error, setError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [resendPending, setResendPending] = useState(false);

  const isEmailNotConfirmed = error === "EMAIL_NOT_CONFIRMED";

  function onSubmit(formData: FormData) {
    setError(null);
    setResendSuccess(false);
    formData.set("redirect", redirectTo);
    startTransition(async () => {
      try {
        await login(formData);
      } catch (err: any) {
        setError(err.message ?? "Unable to sign in.");
      }
    });
  }

  function onResend() {
    const email = (document.querySelector('input[name="email"]') as HTMLInputElement)?.value || emailParam;
    if (!email) return;
    setResendPending(true);
    setResendSuccess(false);
    resendConfirmation(email).then(
      () => {
        setResendSuccess(true);
        setResendPending(false);
      },
      () => setResendPending(false)
    );
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
            <h2 className="font-['Bebas_Neue'] text-5xl tracking-[0.1em] text-[#f9f9f9] leading-none">ENTER THE VOW.</h2>
            <p className="font-['Epilogue'] text-xs tracking-widest text-[#adaaad] mt-4 opacity-70 uppercase">Access your sovereign ledger.</p>
          </header>

          <form action={onSubmit} className="space-y-8">
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
              <a
                href="/forgot-password"
                className="text-[10px] font-['Epilogue'] text-[#adaaad] text-right block mt-2 hover:text-[#f9f9f9]"
              >
                Forgot your password?
              </a>
            </div>

            {message === "confirm_email" && (
              <p className="text-xs font-semibold uppercase text-emerald-400">
                Check your email and click the confirmation link to sign in.
              </p>
            )}
            {error && (
              <p className="text-xs font-semibold uppercase text-red-400">
                {isEmailNotConfirmed
                  ? "Email not confirmed. Check your inbox and click the confirmation link."
                  : error}
              </p>
            )}
            {isEmailNotConfirmed && (
              <button
                type="button"
                onClick={onResend}
                disabled={resendPending}
                className="text-xs font-semibold uppercase text-[#adaaad] underline hover:text-[#f9f9f9] disabled:opacity-50"
              >
                {resendPending ? "Sending..." : "Resend confirmation email"}
              </button>
            )}
            {resendSuccess && (
              <p className="text-xs font-semibold uppercase text-emerald-400">
                Confirmation email sent. Check your inbox.
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#f9f9f9] text-black font-['Bebas_Neue'] text-xl tracking-[0.15em] py-4 mt-4 uppercase active:scale-[0.98] transition-all hover:shadow-[0_0_20px_rgba(249,249,249,0.3)] disabled:opacity-60"
            >
              {isPending ? "Entering..." : "Enter."}
            </button>
          </form>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center">
          <a
            href="/signup"
            className="font-['Epilogue'] text-sm tracking-wide text-[#adaaad] hover:text-[#f9f9f9] transition-colors"
          >
            Don&apos;t have an account? <span className="text-[#f9f9f9] hover:underline">Join the VOW →</span>
          </a>
        </footer>
      </main>
    </div>
  );
}
