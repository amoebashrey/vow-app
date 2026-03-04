import type { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`mt-2 w-full border-b-2 border-black bg-transparent px-0 py-2 text-sm text-zinc-50 outline-none placeholder:text-zinc-500 ${props.className ?? ""}`}
    />
  );
}

