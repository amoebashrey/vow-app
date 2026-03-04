import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`border-2 border-black bg-black px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-zinc-800 disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}

