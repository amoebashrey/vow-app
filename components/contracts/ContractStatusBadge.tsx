interface ContractStatusBadgeProps {
  status: "active" | "completed" | "failed";
}

export function ContractStatusBadge({ status }: ContractStatusBadgeProps) {
  const label =
    status === "active" ? "Active" : status === "completed" ? "Completed" : "Failed";

  const colorClasses =
    status === "active"
      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
      : status === "completed"
        ? "bg-zinc-500/10 border-zinc-500/20 text-zinc-300"
        : "bg-red-500/10 border-red-500/30 text-red-400";

  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${colorClasses}`}
    >
      {label}
    </span>
  );
}

