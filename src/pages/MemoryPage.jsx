import { useState } from "react";
import { color, font, radius } from "../tokens";

const MOCK_RECENT_QUERIES = ["아까 예산 얼마라 그랬지?", "어제 차 어디 세웠지?", "지난번 러닝 페이스"];

const MOCK_SESSIONS = [
  { id: 1, type: "meeting", title: "제품팀 주간 회의", date: "오늘, 14:30", ago: "2시간 전", preview: "예산 3천만 원 확정. 보고서 마감: 다음 수요일.", tags: ["예산", "마감"], icon: "📝" },
  { id: 2, type: "navigation", title: "서강대 → 강남역", date: "오늘, 11:20", ago: "5시간 전", preview: "1.2km 도보 16분. 신촌역 경유 도착.", tags: ["도보", "도착"], icon: "🗺" },
  { id: 3, type: "ocr", title: "식당 메뉴 — 이치란 라멘", date: "어제, 19:45", ago: "1일 전", preview: "돈코츠 라멘 ¥980, 면 추가 ¥150. 추천: 오리지널.", tags: ["메뉴", "가격"], icon: "📸" },
  { id: 4, type: "exercise", title: "저녁 러닝 — 한강", date: "어제, 18:00", ago: "1일 전", preview: "5.1km / 31:42. 평균 페이스 6:11/km. 케이던스 172 SPM.", tags: ["러닝", "5km"], icon: "🏃" },
  { id: 5, type: "translation", title: "도쿄역 대화", date: "3월 5일, 15:30", ago: "4일 전", preview: "8턴. 신주쿠 플랫폼 방향 문의. JA↔KO.", tags: ["일본어", "길찾기"], icon: "🌐" },
  { id: 6, type: "meeting", title: "디자인 리뷰", date: "3월 4일, 10:00", ago: "5일 전", preview: "UI 목업 승인. 박 디자이너 금요일까지 아이콘 확정.", tags: ["디자인", "액션"], icon: "📝" },
];

const MOCK_ASK_RESULT = {
  query: "아까 예산 얼마라 그랬지?",
  answer: "오늘 14:32 제품팀 주간 회의에서 김팀장이 '3천만 원'이라고 언급했습니다.",
  source: { type: "meeting", title: "제품팀 주간 회의", time: "14:32", speaker: "김팀장" },
};

const SearchIcon = ({ c = color.text4 }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={color.accent} stroke="none">
    <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" />
  </svg>
);
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color.text4} strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
  </svg>
);

function FilterChip({ label, icon, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: radius.xl,
      backgroundColor: active ? color.primary : color.backgroundAlt, color: active ? "white" : color.text3,
      fontSize: font.caption.size, fontWeight: active ? 600 : 400, cursor: "pointer", flexShrink: 0, transition: "all 0.15s ease",
    }}>
      {icon && <span style={{ fontSize: 13 }}>{icon}</span>}{label}
    </div>
  );
}

function SessionCard({ session }) {
  return (
    <div style={{ display: "flex", gap: 14, padding: "14px", borderRadius: radius.lg, backgroundColor: color.surface, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", cursor: "pointer" }}>
      <div style={{ width: 42, height: 42, borderRadius: radius.md, backgroundColor: color.backgroundAlt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
        {session.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <div style={{ fontSize: font.body.size, fontWeight: 700, color: color.text1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 8 }}>{session.title}</div>
          <span style={{ fontSize: font.tiny.size, color: color.text4, flexShrink: 0 }}>{session.ago}</span>
        </div>
        <div style={{ fontSize: font.caption.size, color: color.text3, lineHeight: 1.5, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{session.preview}</div>
        <div style={{ display: "flex", gap: 4 }}>
          {session.tags.map((tag) => (
            <span key={tag} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 6, backgroundColor: color.backgroundAlt, color: color.text4 }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MemoryPage() {
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [askResult, setAskResult] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sessions] = useState(MOCK_SESSIONS);

  const filters = [
    { key: "all", label: "전체", icon: null },
    { key: "meeting", label: "회의", icon: "📝" },
    { key: "navigation", label: "길안내", icon: "🗺" },
    { key: "ocr", label: "OCR", icon: "📸" },
    { key: "exercise", label: "운동", icon: "🏃" },
    { key: "translation", label: "번역", icon: "🌐" },
  ];

  const filteredSessions = activeFilter === "all" ? sessions : sessions.filter((s) => s.type === activeFilter);

  const handleSearch = () => {
    if (!searchText.trim()) return;
    setIsSearching(true); setAskResult(null);
    setTimeout(() => { setAskResult(MOCK_ASK_RESULT); setIsSearching(false); }, 1500);
  };

  const clearSearch = () => { setSearchText(""); setAskResult(null); setIsSearching(false); };

  return (
    <div style={{ flex: 1, overflowY: "auto", backgroundColor: color.background }}>
      {/* Header */}
      <div style={{ padding: "20px 24px 4px" }}>
        <div style={{ fontSize: font.h1.size, fontWeight: font.h1.weight, color: color.primary, letterSpacing: font.h1.letterSpacing }}>기억</div>
        <div style={{ fontSize: font.caption.size, color: color.text3, marginTop: 2 }}>AIVY에게 무엇이든 물어보세요</div>
      </div>

      {/* Search bar */}
      <div style={{ padding: "12px 20px 4px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: radius.lg,
          backgroundColor: color.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          border: isSearching ? `1.5px solid ${color.accent}` : "1.5px solid transparent", transition: "border-color 0.2s ease",
        }}>
          <SparkleIcon />
          <input type="text" placeholder="무엇이든 물어보세요..." value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{ flex: 1, border: "none", outline: "none", backgroundColor: "transparent", fontSize: font.body.size, color: color.text1, fontFamily: "inherit" }}
          />
          {searchText && <div onClick={clearSearch} style={{ cursor: "pointer", fontSize: 18, color: color.text4, lineHeight: 1 }}>×</div>}
          <div onClick={handleSearch} style={{
            padding: "6px 14px", borderRadius: radius.sm,
            backgroundColor: searchText.trim() ? color.primary : color.backgroundAlt, cursor: searchText.trim() ? "pointer" : "default",
          }}>
            <SearchIcon c={searchText.trim() ? "white" : color.text4} />
          </div>
        </div>
      </div>

      {/* Recent queries */}
      {!askResult && !isSearching && (
        <div style={{ padding: "10px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <ClockIcon /><span style={{ fontSize: font.tiny.size, color: color.text4 }}>최근 검색</span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {MOCK_RECENT_QUERIES.map((q) => (
              <div key={q} onClick={() => setSearchText(q)}
                style={{ padding: "6px 12px", borderRadius: 18, backgroundColor: color.backgroundAlt, fontSize: font.caption.size, color: color.text3, cursor: "pointer" }}>
                {q}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Searching */}
      {isSearching && (
        <div style={{ padding: "24px 20px", textAlign: "center" }}>
          <div style={{ width: 200, height: 12, borderRadius: 6, margin: "0 auto 10px", background: `linear-gradient(90deg, ${color.backgroundAlt} 25%, ${color.border} 50%, ${color.backgroundAlt} 75%)`, backgroundSize: "400px 100%", animation: "shimmer 1.5s infinite" }} />
          <div style={{ fontSize: font.caption.size, color: color.text4 }}>기억을 검색하고 있습니다...</div>
        </div>
      )}

      {/* Ask AI Result */}
      {askResult && (
        <div style={{ padding: "14px 20px", animation: "fadeUp 0.3s ease" }}>
          <div style={{ backgroundColor: color.surface, borderRadius: radius.lg, padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", borderTop: `3px solid ${color.accent}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <SparkleIcon /><span style={{ fontSize: font.caption.size, fontWeight: 600, color: color.accent }}>AI 답변</span>
            </div>
            <div style={{ fontSize: font.caption.size, color: color.text3, marginBottom: 12 }}>"{askResult.query}"</div>
            <div style={{ fontSize: font.h3.size, fontWeight: font.h3.weight, color: color.primary, lineHeight: 1.6, marginBottom: 14 }}>{askResult.answer}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: radius.sm, backgroundColor: color.backgroundAlt, cursor: "pointer" }}>
              <span style={{ fontSize: 14 }}>📝</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: font.caption.size, fontWeight: 600, color: color.text2 }}>{askResult.source.title}</div>
                <div style={{ fontSize: font.tiny.size, color: color.text4 }}>{askResult.source.speaker} · {askResult.source.time}</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color.text4} strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6" /></svg>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ padding: "14px 20px 8px" }}>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
          {filters.map((f) => <FilterChip key={f.key} label={f.label} icon={f.icon} active={activeFilter === f.key} onClick={() => setActiveFilter(f.key)} />)}
        </div>
      </div>

      {/* Sessions */}
      <div style={{ padding: "4px 20px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: font.label.size, fontWeight: font.label.weight, color: color.text3, letterSpacing: font.label.letterSpacing, textTransform: "uppercase" }}>세션 기록</span>
          <span style={{ fontSize: font.tiny.size, color: color.text4 }}>{filteredSessions.length}개</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filteredSessions.map((session) => <SessionCard key={session.id} session={session} />)}
        </div>
        {filteredSessions.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: color.text4, fontSize: font.body.size }}>세션을 찾을 수 없습니다</div>
        )}
      </div>
    </div>
  );
}
