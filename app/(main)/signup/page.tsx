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
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md border-2 border-black bg-white p-8 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="mb-6 text-2xl font-black uppercase tracking-[0.2em]">
          Make the Vow
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
          </div>
          {error && (
            <p className="text-xs font-semibold uppercase text-red-600">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="mt-4 w-full border-2 border-black bg-black px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-zinc-800 disabled:opacity-60"
          >
            {isPending ? "Creating..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}
