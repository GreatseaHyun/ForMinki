const colorMap = {
  blue: "bg-brand-subtle text-brand",
  green: "bg-success-subtle text-success",
  amber: "bg-accent-subtle text-amber-700",
  red: "bg-danger-subtle text-danger",
  slate: "bg-slate-100 text-text-secondary",
  purple: "bg-purple-50 text-purple-700",
};

export default function Badge({ children, color = "slate" }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
        colorMap[color] || colorMap.slate
      }`}
    >
      {children}
    </span>
  );
}
