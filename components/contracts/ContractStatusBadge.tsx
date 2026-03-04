interface ContractStatusBadgeProps {
  status: "active" | "completed" | "failed";
}

export function ContractStatusBadge({ status }: ContractStatusBadgeProps) {
  const label =
    status === "active" ? "Active" : status === "completed" ? "Completed" : "Failed";

  const colorClasses =
    status === "active"
      ? "border-emerald-400 text-emerald-300"
      : status === "completed"
        ? "border-sky-400 text-sky-300"
        : "border-red-500 text-red-400";

  return (
    <span
      className={`inline-block border px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${colorClasses}`}
    >
      {label}
    </span>
  );
}

