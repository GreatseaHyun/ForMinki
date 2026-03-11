import { MOCK_SESSIONS } from "../data/mock";
import { ChevronRight } from "lucide-react";
import Badge from "../components/ui/Badge";
import Header from "../components/layout/Header";

const MODE_COLORS = {
  navigation: { bg: "bg-blue-50", dot: "bg-blue-500" },
  translation: { bg: "bg-emerald-50", dot: "bg-emerald-500" },
  ocr: { bg: "bg-violet-50", dot: "bg-violet-500" },
  exercise: { bg: "bg-orange-50", dot: "bg-orange-500" },
  meeting: { bg: "bg-rose-50", dot: "bg-rose-500" },
  memory: { bg: "bg-amber-50", dot: "bg-amber-500" },
};

export default function Activity() {
  return (
    <div>
      <Header title="활동 기록" />
      <div className="px-4 py-3 space-y-2">
        {MOCK_SESSIONS.map((session, i) => {
          const colors = MODE_COLORS[session.mode] || MODE_COLORS.navigation;
          return (
            <div
              key={session.id}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-surface hover:bg-slate-100 transition-colors cursor-pointer animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${colors.bg}`}
              >
                <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-medium text-text-primary truncate">
                    {session.title}
                  </p>
                  <ChevronRight size={14} className="text-text-tertiary shrink-0 ml-2" />
                </div>
                <p className="text-[12px] text-text-secondary mt-0.5">
                  {session.preview}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[11px] text-text-tertiary">{session.date}</span>
                  {session.tags.map((tag) => (
                    <Badge key={tag} color="slate">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
