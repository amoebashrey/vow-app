"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface NavDropdownProps {
  userEmail: string;
  userInitial: string;
}

export function NavDropdown({ userEmail, userInitial }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-600 bg-zinc-800 text-[11px] font-bold text-white cursor-pointer"
      >
        {userInitial}
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-50 min-w-[160px] rounded-sm border border-zinc-800 bg-zinc-950">
          <p className="px-4 py-2 text-[10px] text-zinc-500">{userEmail}</p>
          <div className="border-t border-zinc-800" />
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 hover:text-zinc-100"
          >
            Profile
          </Link>
          <form action="/auth/logout" method="POST">
            <button
              type="submit"
              className="block w-full px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 hover:text-zinc-100"
            >
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
