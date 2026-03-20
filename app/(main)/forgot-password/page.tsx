"use client";

import { useState, useTransition } from "react";
import { sendPasswordReset } from "./actions";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

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
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md border-2 border-zinc-800 bg-zinc-900 p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="mb-2 text-2xl font-black uppercase tracking-[0.2em]">
          Reset Your Password.
        </h1>
        <p className="mb-6 text-sm uppercase text-zinc-400">
          Enter your email. We&apos;ll send a reset link.
        </p>
        <form action={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase">
              Email
            </label>
            <Input name="email" type="email" required />
          </div>
          {success && (
            <p className="text-xs font-semibold uppercase text-emerald-400">
              Check your email. Reset link sent.
            </p>
          )}
          {error && (
            <p className="text-xs font-semibold uppercase text-red-600">
              {error}
            </p>
          )}
          <Button type="submit" disabled={isPending} className="mt-4 w-full">
            {isPending ? "Sending..." : "Send Reset Link."}
          </Button>
        </form>
      </div>
    </div>
  );
}
