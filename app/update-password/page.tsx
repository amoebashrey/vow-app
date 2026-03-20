"use client";

import { useState, useTransition } from "react";
import { updatePassword } from "./actions";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function UpdatePasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await updatePassword(formData);
      } catch (err: any) {
        setError(err.message ?? "Unable to update password.");
      }
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md border-2 border-zinc-800 bg-zinc-900 p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="mb-2 text-2xl font-black uppercase tracking-[0.2em]">
          Set New Password.
        </h1>
        <p className="mb-6 text-sm uppercase text-zinc-400">
          Enter your new password below.
        </p>
        <form action={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase">
              New Password
            </label>
            <Input name="password" type="password" required />
          </div>
          {error && (
            <p className="text-xs font-semibold uppercase text-red-600">
              {error}
            </p>
          )}
          <Button type="submit" disabled={isPending} className="mt-4 w-full">
            {isPending ? "Updating..." : "Update Password."}
          </Button>
        </form>
      </div>
    </div>
  );
}
