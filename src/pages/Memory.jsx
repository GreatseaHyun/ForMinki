import { useState } from "react";
import { MOCK_MEMORY_SESSIONS, MOCK_AI_RESPONSE } from "../data/mock";
import Header from "../components/layout/Header";
import Chip from "../components/ui/Chip";
import Badge from "../components/ui/Badge";
import {
  Search,
  Sparkles,
  ChevronRight,
  MapPin,
  Languages,
  ScanText,
  Footprints,
  FileText,
  Send,
} from "lucide-react";

const FILTERS = ["전체", "회의", "내비", "OCR", "운동", "번역"];

const MODE_FILTER_MAP = {
  전체: null,
  회의: "meeting",
  내비: "navigation",
  OCR: "ocr",
  운동: "exercise",
  번역: "translation",
};

const MODE_ICONS = {
  meeting: FileText,
  navigation: MapPin,
  ocr: ScanText,
  exercise: Footprints,
  translation: Languages,
};

const MODE_COLORS = {
  meeting: { bg: "bg-rose-50", text: "text-rose-600" },
  navigation: { bg: "bg-blue-50", text: "text-blue-600" },
  ocr: { bg: "bg-violet-50", text: "text-violet-600" },
  exercise: { bg: "bg-orange-50", text: "text-orange-600" },
  translation: { bg: "bg-emerald-50", text: "text-emerald-600" },
};

const ENTITY_COLORS = {
  MONEY: "amber",
  PERSON: "blue",
  DATE: "green",
  ACTION: "purple",
  TIME: "slate",
  PLACE: "red",
};

export default function Memory() {
  const [filter, setFilter] = useState("전체");
  const [query, setQuery] = useState("");
  const [showAI, setShowAI] = useState(false);
  const [searching, setSearching] = useState(false);

  const filteredSessions = MOCK_MEMORY_SESSIONS.filter((s) => {
    const modeFilter = MODE_FILTER_MAP[filter];
    return !modeFilter || s.mode === modeFilter;
  });

  const handleAskAI = () => {
    if (!query.trim()) return;
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      setShowAI(true);
    }, 1500);
  };

  return (
    <div>
      <Header title="메모리" />

      <div className="px-4 py-3 space-y-4">
        {/* AI Search */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 bg-surface rounded-xl border border-slate-100 focus-within:border-brand-light focus-within:ring-2 focus-within:ring-brand-light/20 transition-all">
          <Sparkles size={16} className="text-accent shrink-0" />
          <input
            type="text"
            placeholder="AI에게 물어보세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAskAI();
            }}
            className="flex-1 bg-transparent text-[14px] text-text-primary placeholder:text-text-tertiary outline-none"
          />
          <button
            onClick={handleAskAI}
            className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center hover:bg-brand-dark transition-colors shrink-0"
          >
            <Send size={13} className="text-white" />
          </button>
        </div>

        {/* AI Response */}
        {searching && (
          <div className="p-4 rounded-2xl bg-surface animate-fade-up">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-accent" />
              <span className="text-[13px] font-medium text-text-secondary">
                검색 중...
              </span>
            </div>
            <div className="space-y-2">
              <div className="h-4 rounded animate-shimmer" />
              <div className="h-4 w-3/4 rounded animate-shimmer" />
              <div className="h-4 w-1/2 rounded animate-shimmer" />
            </div>
          </div>
        )}

        {showAI && !searching && (
          <div className="p-4 rounded-2xl bg-surface border border-slate-100 animate-fade-up">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-accent" />
              <span className="text-[13px] font-semibold text-text-primary">
                AI 답변
              </span>
            </div>

            <p className="text-[14px] text-text-primary leading-relaxed mb-3">
              {MOCK_AI_RESPONSE.answer}
            </p>

            {/* Entities */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {MOCK_AI_RESPONSE.entities.map((entity, i) => (
                <Badge key={i} color={ENTITY_COLORS[entity.type] || "slate"}>
                  {entity.type}: {entity.value}
                </Badge>
              ))}
            </div>

            {/* Source */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[11px] text-text-tertiary">
                출처: {MOCK_AI_RESPONSE.source}
              </p>
            </div>
          </div>
        )}

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => (
            <Chip
              key={f}
              label={f}
              active={filter === f}
              onClick={() => setFilter(f)}
            />
          ))}
        </div>

        {/* Sessions list */}
        <div className="space-y-2">
          {filteredSessions.map((session, i) => {
            const Icon = MODE_ICONS[session.mode] || FileText;
            const colors = MODE_COLORS[session.mode] || MODE_COLORS.meeting;
            return (
              <div
                key={session.id}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-surface hover:bg-slate-100 transition-colors cursor-pointer animate-fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colors.bg}`}
                >
                  <Icon size={16} className={colors.text} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-medium text-text-primary truncate">
                      {session.title}
                    </p>
                    <ChevronRight
                      size={14}
                      className="text-text-tertiary shrink-0 ml-2"
                    />
                  </div>
                  <p className="text-[12px] text-text-secondary mt-0.5 line-clamp-1">
                    {session.preview}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[11px] text-text-tertiary">
                      {session.date}
                    </span>
                    {session.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} color="slate">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
