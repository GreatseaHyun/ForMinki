export default function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors whitespace-nowrap ${
        active
          ? "bg-brand text-white"
          : "bg-slate-100 text-text-secondary hover:bg-slate-200"
      }`}
    >
      {label}
    </button>
  );
}
