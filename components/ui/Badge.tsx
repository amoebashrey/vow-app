import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-block border border-black px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${className}`}
    >
      {children}
    </span>
  );
}

