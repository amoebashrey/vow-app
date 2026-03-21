import Link from "next/link";
import { ReactNode } from "react";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import { NavDropdown } from "./NavDropdown";

interface ShellProps {
  children: ReactNode;
}

export async function Shell({ children }: ShellProps) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background text-zinc-50">
      <header className="border-b border-zinc-800 px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Link
            href={user ? "/dashboard" : "/"}
            className="text-lg font-black uppercase tracking-[0.3em]"
          >
            Vow
          </Link>
          <nav className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="hover:text-zinc-100"
                >
                  Dashboard
                </Link>
                <Link
                  href="/contracts/new"
                  className="hover:text-zinc-100"
                >
                  New Contract
                </Link>
                <NavDropdown
                  userEmail={user.email!}
                  userInitial={user.email![0].toUpperCase()}
                />
              </>
            )}
            {!user && (
              <>
                <Link
                  href="/login"
                  className="hover:text-zinc-100"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="hover:text-zinc-100"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl">{children}</main>
      <footer className="py-6 text-center">
        <Link
          href="/privacy"
          className="text-[10px] uppercase tracking-widest text-zinc-600 hover:text-zinc-400"
        >
          Privacy Policy
        </Link>
      </footer>
    </div>
  );
}

