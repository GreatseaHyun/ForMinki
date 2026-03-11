import { useState } from "react";

const MOCK_RECENT_QUERIES = ["아까 예산 얼마라 그랬지?", "어제 차 어디 세웠지?", "지난번 러닝 페이스"];

const MOCK_SESSIONS = [
  { id: 1, type: "meeting", title: "Product Team Weekly", date: "Today, 14:30", ago: "2h ago", preview: "Budget confirmed at 30M KRW. Report deadline: next Wednesday.", tags: ["budget", "deadline"], icon: "📝", color: "#F3E5F5", accentColor: "#7B1FA2" },
  { id: 2, type: "navigation", title: "Sogang Univ → Gangnam Station", date: "Today, 11:20", ago: "5h ago", preview: "1.2km walked in 16 min. Arrived via Sinchon Station route.", tags: ["walk", "arrived"], icon: "🗺", color: "#E8EEF4", accentColor: "#2E5E8E" },
  { id: 3, type: "ocr", title: "Restaurant Menu — Ichiran Ramen", date: "Yesterday, 19:45", ago: "1d ago", preview: "Tonkotsu Ramen ¥980, Extra noodles ¥150. Recommended: Original flavor.", tags: ["menu", "price"], icon: "📸", color: "#FFF8E1", accentColor: "#F9A825" },
  { id: 4, type: "exercise", title: "Evening Run — Han River", date: "Yesterday, 18:00", ago: "1d ago", preview: "5.1km in 31:42. Avg pace 6:11/km. Cadence stable at 172 SPM.", tags: ["running", "5km"], icon: "🏃", color: "#E8F5E9", accentColor: "#2E8B57" },
  { id: 5, type: "translation", title: "Conversation at Tokyo Station", date: "Mar 5, 15:30", ago: "4d ago", preview: "8 turns. Asked for directions to Shinjuku platform. JA↔KO.", tags: ["japanese", "directions"], icon: "🌐", color: "#E3F2FD", accentColor: "#3A7BBF" },
  { id: 6, type: "meeting", title: "Design Review", date: "Mar 4, 10:00", ago: "5d ago", preview: "UI mockups approved. Park to finalize icons by Friday.", tags: ["design", "action-item"], icon: "📝", color: "#F3E5F5", accentColor: "#7B1FA2" },
];

const MOCK_ASK_RESULT = {
  query: "아까 예산 얼마라 그랬지?",
  answer: "오늘 14:32 Product Team Weekly에서 김팀장이 '3천만 원'이라고 언급했습니다.",
  source: { type: "meeting", title: "Product Team Weekly", time: "14:32", speaker: "Kim TL" },
  entities: [
    { type: "MONEY", value: "30,000,000 KRW" },
    { type: "PERSON", value: "Kim TL" },
    { type: "TIME", value: "14:32" },
  ],
};

const SearchIcon = ({ color = "#999" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#E67E22" stroke="none">
    <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" />
  </svg>
);
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CCC" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
  </svg>
);

function FilterChip({ label, icon, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 20,
      backgroundColor: active ? "#1B3A5C" : "#F0F0F0", color: active ? "white" : "#777",
      fontSize: 12, fontWeight: active ? 600 : 400, cursor: "pointer", flexShrink: 0, transition: "all 0.15s ease",
    }}>
      {icon && <span style={{ fontSize: 13 }}>{icon}</span>}{label}
    </div>
  );
}

function EntityBadge({ type, value }) {
  const colors = { MONEY: { bg: "#FFF3E0", text: "#E67E22" }, PERSON: { bg: "#F3E5F5", text: "#7B1FA2" }, TIME: { bg: "#E3F2FD", text: "#2E5E8E" }, PLACE: { bg: "#E8F5E9", text: "#2E8B57" } };
  const c = colors[type] || { bg: "#F5F5F5", text: "#666" };
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 8, backgroundColor: c.bg }}>
      <span style={{ fontSize: 10, fontWeight: 600, color: c.text }}>{type}</span>
      <span style={{ fontSize: 11, color: "#555" }}>{value}</span>
    </div>
  );
}

function SessionCard({ session }) {
  return (
    <div style={{ display: "flex", gap: 14, padding: "14px", borderRadius: 14, backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", cursor: "pointer" }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: session.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
        {session.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 8 }}>{session.title}</div>
          <span style={{ fontSize: 10, color: "#CCC", flexShrink: 0 }}>{session.ago}</span>
        </div>
        <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{session.preview}</div>
        <div style={{ display: "flex", gap: 4 }}>
          {session.tags.map((tag) => (
            <span key={tag} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 6, backgroundColor: "#F5F5F5", color: "#AAA" }}>{tag}</span>
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
    { key: "all", label: "All", icon: null },
    { key: "meeting", label: "Meeting", icon: "📝" },
    { key: "navigation", label: "Navigation", icon: "🗺" },
    { key: "ocr", label: "OCR", icon: "📸" },
    { key: "exercise", label: "Exercise", icon: "🏃" },
    { key: "translation", label: "Translation", icon: "🌐" },
  ];

  const filteredSessions = activeFilter === "all" ? sessions : sessions.filter((s) => s.type === activeFilter);

  const handleSearch = () => {
    if (!searchText.trim()) return;
    setIsSearching(true); setAskResult(null);
    setTimeout(() => { setAskResult(MOCK_ASK_RESULT); setIsSearching(false); }, 1500);
  };

  const clearSearch = () => { setSearchText(""); setAskResult(null); setIsSearching(false); };

  return (
    <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#F5F7FA" }}>
      {/* Header */}
      <div style={{ padding: "20px 24px 8px" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#1B3A5C", letterSpacing: -0.5 }}>Memory</div>
      </div>

      {/* Search bar */}
      <div style={{ padding: "8px 20px 4px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 14,
          backgroundColor: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          border: isSearching ? "1.5px solid #E67E22" : "1.5px solid transparent", transition: "border-color 0.2s ease",
        }}>
          <SparkleIcon />
          <input type="text" placeholder="Ask anything... (e.g. 예산 얼마였지?)" value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{ flex: 1, border: "none", outline: "none", backgroundColor: "transparent", fontSize: 14, color: "#333", fontFamily: "inherit" }}
          />
          {searchText && <div onClick={clearSearch} style={{ cursor: "pointer", fontSize: 18, color: "#CCC", lineHeight: 1 }}>×</div>}
          <div onClick={handleSearch} style={{
            padding: "6px 14px", borderRadius: 8,
            backgroundColor: searchText.trim() ? "#1B3A5C" : "#F0F0F0", cursor: searchText.trim() ? "pointer" : "default",
          }}>
            <SearchIcon color={searchText.trim() ? "white" : "#CCC"} />
          </div>
        </div>
      </div>

      {/* Recent queries */}
      {!askResult && !isSearching && (
        <div style={{ padding: "10px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <ClockIcon /><span style={{ fontSize: 11, color: "#CCC" }}>Recent</span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {MOCK_RECENT_QUERIES.map((q) => (
              <div key={q} onClick={() => setSearchText(q)}
                style={{ padding: "6px 12px", borderRadius: 18, backgroundColor: "#F0F0F0", fontSize: 12, color: "#777", cursor: "pointer" }}>
                {q}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Searching */}
      {isSearching && (
        <div style={{ padding: "24px 20px", textAlign: "center" }}>
          <div style={{ width: 200, height: 12, borderRadius: 6, margin: "0 auto 10px", background: "linear-gradient(90deg, #F0F0F0 25%, #E0E0E0 50%, #F0F0F0 75%)", backgroundSize: "400px 100%", animation: "shimmer 1.5s infinite" }} />
          <div style={{ fontSize: 13, color: "#BBB" }}>Searching memory...</div>
        </div>
      )}

      {/* Ask AI Result */}
      {askResult && (
        <div style={{ padding: "14px 20px", animation: "fadeUp 0.3s ease" }}>
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", borderLeft: "4px solid #E67E22" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <SparkleIcon /><span style={{ fontSize: 12, fontWeight: 600, color: "#E67E22" }}>Ask AI</span>
            </div>
            <div style={{ fontSize: 13, color: "#999", marginBottom: 12 }}>"{askResult.query}"</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#1B3A5C", lineHeight: 1.6, marginBottom: 14 }}>{askResult.answer}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              {askResult.entities.map((e, i) => <EntityBadge key={i} type={e.type} value={e.value} />)}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, backgroundColor: "#F8F8F8", cursor: "pointer" }}>
              <span style={{ fontSize: 14 }}>📝</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>{askResult.source.title}</div>
                <div style={{ fontSize: 10, color: "#BBB" }}>{askResult.source.speaker} · {askResult.source.time}</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CCC" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6" /></svg>
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
          <span style={{ fontSize: 11, fontWeight: 600, color: "#999", letterSpacing: 0.5, textTransform: "uppercase" }}>Session History</span>
          <span style={{ fontSize: 11, color: "#CCC" }}>{filteredSessions.length} records</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filteredSessions.map((session) => <SessionCard key={session.id} session={session} />)}
        </div>
        {filteredSessions.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#DDD", fontSize: 14 }}>No sessions found</div>
        )}
      </div>
    </div>
  );
}
