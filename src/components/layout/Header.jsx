import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function Header({ title, back = false, right = null }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      <div className="flex items-center justify-between h-12 px-4">
        <div className="flex items-center gap-2 min-w-[40px]">
          {back && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-8 h-8 -ml-1 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={20} className="text-text-secondary" />
            </button>
          )}
        </div>
        <h1 className="text-[15px] font-semibold text-text-primary">{title}</h1>
        <div className="flex items-center gap-2 min-w-[40px] justify-end">
          {right}
        </div>
      </div>
    </header>
  );
}
