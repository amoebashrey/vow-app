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
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md border-2 border-black bg-white p-8 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="mb-6 text-2xl font-black uppercase tracking-[0.2em]">
          Enter the Vow
        </h1>
        <form
          action={onSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold uppercase">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full border-b-2 border-black bg-transparent px-0 py-2 text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 w-full border-b-2 border-black bg-transparent px-0 py-2 text-sm outline-none"
            />
            <a
              href="/forgot-password"
              className="mt-1 inline-block text-[10px] uppercase tracking-widest text-zinc-500 hover:text-zinc-300"
            >
              Forgot your password?
            </a>
          </div>
          {message === "confirm_email" && (
            <p className="text-xs font-semibold uppercase text-emerald-700">
              Check your email and click the confirmation link to sign in.
            </p>
          )}
          {error && (
            <p className="text-xs font-semibold uppercase text-red-600">
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
              className="text-xs font-semibold uppercase text-zinc-600 underline hover:text-black disabled:opacity-50"
            >
              {resendPending ? "Sending..." : "Resend confirmation email"}
            </button>
          )}
          {resendSuccess && (
            <p className="text-xs font-semibold uppercase text-emerald-700">
              Confirmation email sent. Check your inbox.
            </p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="mt-4 w-full border-2 border-black bg-black px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-zinc-800 disabled:opacity-60"
          >
            {isPending ? "Entering..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
