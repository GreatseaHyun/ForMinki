import { useState } from "react";
import { color, font, radius, shadow } from "../tokens";
import {
  MeetingIcon, MapRouteIcon, ScanTextIcon, ActivityIcon,
  LanguagesIcon, SparklesIcon, ShareIcon, ExportIcon, TrashIcon,
  ChevronDownIcon, UserIcon, ClockIcon, getIconForType, iconColors,
} from "../icons";

const MOCK_RECENT_QUERIES = ["아까 예산 얼마라 그랬지?", "어제 차 어디 세웠지?", "지난번 러닝 페이스"];

const MOCK_SESSIONS = [
  {
    id: 1, type: "meeting", title: "제품팀 주간 회의", date: "오늘, 14:30", ago: "2시간 전",
    preview: "예산 3천만 원 확정. 보고서 마감: 다음 수요일. UI 리뷰 진행.",
    tags: ["예산", "마감", "리뷰"],
    detail: {
      duration: "47분",
      participants: ["김팀장", "박디자이너", "이개발"],
      transcript: [
        { speaker: "김팀장", time: "14:32", text: "이번 분기 예산은 3천만 원으로 확정됐습니다." },
        { speaker: "박디자이너", time: "14:35", text: "UI 목업은 이번 주 금요일까지 확정하겠습니다." },
        { speaker: "이개발", time: "14:38", text: "백엔드 API는 다음 월요일까지 1차 완성 가능합니다." },
        { speaker: "김팀장", time: "14:45", text: "보고서 마감은 다음 수요일까지. 각자 담당 섹션 작성 부탁드립니다." },
        { speaker: "박디자이너", time: "14:50", text: "아이콘 세트도 금요일까지 확정하겠습니다. 일관된 스타일로 가져갈게요." },
      ],
      actionItems: [
        "보고서 작성 — 다음 수요일까지 (전원)",
        "UI 목업 확정 — 금요일 (박디자이너)",
        "백엔드 API 1차 — 다음 월요일 (이개발)",
      ],
    },
  },
  {
    id: 2, type: "navigation", title: "서강대 → 강남역", date: "오늘, 11:20", ago: "5시간 전",
    preview: "1.2km 도보 16분. 신촌역 경유 도착. 평균 속도 4.5km/h.",
    tags: ["도보", "도착"],
    detail: {
      totalDistance: "1.2km",
      totalTime: "16분 22초",
      avgSpeed: "4.5 km/h",
      steps: 1847,
      waypoints: ["서강대 정문 출발", "신촌 로터리 경유", "지하철 2호선 신촌역 통과", "강남역 3번 출구 도착"],
    },
  },
  {
    id: 3, type: "ocr", title: "식당 메뉴 — 이치란 라멘", date: "어제, 19:45", ago: "1일 전",
    preview: "돈코츠 라멘 ¥980, 반숙 계란 ¥120, 차슈 추가 ¥200. 추천: 오리지널.",
    tags: ["메뉴", "가격", "일본"],
    detail: {
      language: "일본어 (JA)",
      scannedText: "【メニュー】\n天然とんこつラーメン ¥980\n替え玉 ¥210\n半熟塩ゆでたまご ¥120\nチャーシュー追加 ¥200\nのり追加 ¥100\n特製ダレ ¥50",
      extractedInfo: [
        { item: "돈코츠 라멘", price: "¥980" },
        { item: "면 추가 (카에다마)", price: "¥210" },
        { item: "반숙 계란", price: "¥120" },
        { item: "차슈 추가", price: "¥200" },
        { item: "김 추가", price: "¥100" },
      ],
    },
  },
  {
    id: 4, type: "exercise", title: "저녁 러닝 — 한강", date: "어제, 18:00", ago: "1일 전",
    preview: "5.1km / 31:42. 평균 페이스 6:11/km. 케이던스 172 SPM.",
    tags: ["러닝", "5km"],
    detail: {
      totalDistance: "5.1km",
      totalTime: "31:42",
      avgPace: "6:11 /km",
      cadence: "172 SPM",
      calories: "387 kcal",
      splits: [
        { km: 1, pace: "6:05" },
        { km: 2, pace: "6:12" },
        { km: 3, pace: "6:18" },
        { km: 4, pace: "6:22" },
        { km: 5, pace: "5:58" },
      ],
    },
  },
  {
    id: 5, type: "translation", title: "도쿄역 대화", date: "3월 5일, 15:30", ago: "4일 전",
    preview: "8턴. 신주쿠 플랫폼 방향 문의. JA↔KO 실시간 통역.",
    tags: ["일본어", "길찾기"],
    detail: {
      languagePair: "KO ↔ JA",
      turns: 8,
      duration: "3분 20초",
      conversation: [
        { speaker: "them", original: "すみません、新宿方面のホームはどちらですか？", translated: "실례합니다, 신주쿠 방면 플랫폼은 어디인가요?" },
        { speaker: "me", original: "1번 플랫폼이에요. 저쪽 계단으로 내려가세요.", translated: "1番ホームです。あちらの階段を降りてください。" },
        { speaker: "them", original: "ありがとうございます。次の電車は何時ですか？", translated: "감사합니다. 다음 전철은 몇 시인가요?" },
        { speaker: "me", original: "3분 후에 옵니다.", translated: "3分後に来ます。" },
      ],
    },
  },
  {
    id: 6, type: "meeting", title: "디자인 리뷰 — Q2 앱 리뉴얼", date: "3월 4일, 10:00", ago: "5일 전",
    preview: "UI 목업 승인. 박 디자이너 금요일까지 아이콘 확정. 브랜드 가이드라인 반영.",
    tags: ["디자인", "액션", "앱"],
    detail: {
      duration: "32분",
      participants: ["박디자이너", "김팀장", "최PM"],
      transcript: [
        { speaker: "박디자이너", time: "10:05", text: "Q2 앱 리뉴얼 목업을 공유드립니다. 전체적으로 아이콘을 통일하고 색상 체계를 정리했습니다." },
        { speaker: "최PM", time: "10:12", text: "네비게이션 페이지의 지도 인터랙션 부분은 좀 더 논의가 필요할 것 같아요." },
        { speaker: "김팀장", time: "10:18", text: "전체적인 방향은 승인합니다. 아이콘 세트만 금요일까지 확정해 주세요." },
      ],
      actionItems: [
        "아이콘 세트 확정 — 금요일 (박디자이너)",
        "네비게이션 지도 UX 추가 논의 — 수요일 (최PM, 박디자이너)",
      ],
    },
  },
  {
    id: 7, type: "ocr", title: "명함 — 다나카 유키 (田中 裕記)", date: "3월 3일, 16:10", ago: "6일 전",
    preview: "Sony Interactive Entertainment, 시니어 프로듀서. tokyo@sie.com",
    tags: ["명함", "연락처"],
    detail: {
      language: "일본어/영어",
      scannedText: "田中 裕記 (Tanaka Yuki)\nSenior Producer\nSony Interactive Entertainment\nTokyo Studio\ntanaka.yuki@sie.com\n+81-3-6748-XXXX",
      extractedInfo: [
        { item: "이름", price: "다나카 유키 (田中 裕記)" },
        { item: "직함", price: "Senior Producer" },
        { item: "회사", price: "Sony Interactive Entertainment" },
        { item: "이메일", price: "tanaka.yuki@sie.com" },
      ],
    },
  },
  {
    id: 8, type: "exercise", title: "아침 산책 — 여의도 공원", date: "3월 2일, 07:30", ago: "1주 전",
    preview: "2.3km / 28:15. 평균 페이스 12:17/km. 가벼운 산책.",
    tags: ["산책", "2km"],
    detail: {
      totalDistance: "2.3km",
      totalTime: "28:15",
      avgPace: "12:17 /km",
      cadence: "98 SPM",
      calories: "142 kcal",
      splits: [
        { km: 1, pace: "12:30" },
        { km: 2, pace: "12:05" },
      ],
    },
  },
];

const MOCK_ASK_RESULT = {
  query: "아까 예산 얼마라 그랬지?",
  answer: "오늘 14:32 제품팀 주간 회의에서 김팀장이 '3천만 원'이라고 언급했습니다.",
  source: { type: "meeting", title: "제품팀 주간 회의", time: "14:32", speaker: "김팀장" },
};

/* ── Small icons ── */
const SearchIcon = ({ c = color.text4 }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

const SparkleSmall = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={color.accent} stroke="none">
    <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" />
  </svg>
);

/* ── Filter Chip ── */
function FilterChip({ label, Icon, iconColor, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: radius.xl,
      backgroundColor: active ? color.primary : color.surface, color: active ? "white" : color.text3,
      fontSize: font.caption.size, fontWeight: active ? 600 : 400, cursor: "pointer", flexShrink: 0,
      transition: "all 0.15s ease", boxShadow: active ? "none" : shadow.sm,
    }}>
      {Icon && <Icon size={13} color={active ? "white" : (iconColor || color.text3)} />}{label}
    </div>
  );
}

/* ── Session Detail Renderers ── */
function MeetingDetail({ detail }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Participants */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        {detail.participants.map((p) => (
          <div key={p} style={{
            display: "flex", alignItems: "center", gap: 4, padding: "3px 10px",
            borderRadius: radius.full, backgroundColor: iconColors.meeting.bg, fontSize: 11, fontWeight: 500, color: iconColors.meeting.fg,
          }}>
            <UserIcon size={11} color={iconColors.meeting.fg} />{p}
          </div>
        ))}
        <span style={{ fontSize: 11, color: color.text4 }}>{detail.duration}</span>
      </div>
      {/* Transcript */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {detail.transcript.map((t, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, padding: "8px 12px", borderRadius: radius.sm,
            backgroundColor: i % 2 === 0 ? color.background : "transparent",
          }}>
            <div style={{ flexShrink: 0, width: 60 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: iconColors.meeting.fg }}>{t.speaker}</div>
              <div style={{ fontSize: 10, color: color.text4 }}>{t.time}</div>
            </div>
            <div style={{ fontSize: 13, color: color.text2, lineHeight: 1.5 }}>{t.text}</div>
          </div>
        ))}
      </div>
      {/* Action Items */}
      {detail.actionItems && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: color.text3, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>액션 아이템</div>
          {detail.actionItems.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 0",
              borderBottom: i < detail.actionItems.length - 1 ? `1px solid ${color.background}` : "none",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: iconColors.meeting.fg, marginTop: 5, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: color.text2, lineHeight: 1.4 }}>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NavigationDetail({ detail }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6 }}>
        {[
          { label: "거리", value: detail.totalDistance },
          { label: "시간", value: detail.totalTime },
          { label: "평균 속도", value: detail.avgSpeed },
          { label: "걸음 수", value: detail.steps?.toLocaleString() },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: "center", padding: "10px 4px", borderRadius: radius.sm, backgroundColor: color.background }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: iconColors.navigation.fg }}>{s.value}</div>
            <div style={{ fontSize: 10, color: color.text4, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: color.text3, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>경유지</div>
        {detail.waypoints.map((wp, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              backgroundColor: i === 0 ? iconColors.navigation.fg : i === detail.waypoints.length - 1 ? color.danger : color.backgroundAlt,
              color: (i === 0 || i === detail.waypoints.length - 1) ? "white" : color.text3,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, flexShrink: 0,
            }}>
              {i + 1}
            </div>
            <span style={{ fontSize: 12, color: color.text2 }}>{wp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OcrDetail({ detail }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ fontSize: 11, color: color.text4 }}>감지 언어: {detail.language}</div>
      {/* Scanned text */}
      <div style={{
        padding: "14px", borderRadius: radius.sm, backgroundColor: color.background, fontFamily: "monospace",
        fontSize: 12, color: color.text2, lineHeight: 1.6, whiteSpace: "pre-wrap",
      }}>
        {detail.scannedText}
      </div>
      {/* Extracted info */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: color.text3, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>추출된 정보</div>
        {detail.extractedInfo.map((info, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", padding: "7px 0",
            borderBottom: i < detail.extractedInfo.length - 1 ? `1px solid ${color.background}` : "none",
          }}>
            <span style={{ fontSize: 12, color: color.text3 }}>{info.item}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: color.text1 }}>{info.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExerciseDetail({ detail }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
        {[
          { label: "거리", value: detail.totalDistance },
          { label: "시간", value: detail.totalTime },
          { label: "페이스", value: detail.avgPace },
          { label: "케이던스", value: detail.cadence },
          { label: "칼로리", value: detail.calories },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: "center", padding: "10px 4px", borderRadius: radius.sm, backgroundColor: color.background }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: iconColors.exercise.fg }}>{s.value}</div>
            <div style={{ fontSize: 10, color: color.text4, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      {/* Splits */}
      {detail.splits && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: color.text3, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>구간별 페이스</div>
          <div style={{ display: "flex", gap: 6 }}>
            {detail.splits.map((s) => (
              <div key={s.km} style={{
                flex: 1, textAlign: "center", padding: "8px 4px", borderRadius: radius.sm,
                backgroundColor: color.background,
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: color.text1 }}>{s.pace}</div>
                <div style={{ fontSize: 10, color: color.text4, marginTop: 2 }}>{s.km}km</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TranslationDetail({ detail }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: iconColors.translation.fg }}>{detail.languagePair}</span>
        <span style={{ fontSize: 11, color: color.text4 }}>{detail.turns}턴 · {detail.duration}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {detail.conversation.map((c, i) => {
          const isMe = c.speaker === "me";
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
              <div style={{ fontSize: 10, color: color.text4, marginBottom: 2, padding: "0 4px" }}>{isMe ? "나" : "상대"}</div>
              <div style={{
                maxWidth: "90%", padding: "10px 14px",
                borderRadius: isMe ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                backgroundColor: isMe ? color.primary : color.backgroundAlt,
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: isMe ? "white" : color.text1, lineHeight: 1.4 }}>
                  {isMe ? c.translated : c.original}
                </div>
                <div style={{ fontSize: 11, color: isMe ? "rgba(255,255,255,0.5)" : color.text4, marginTop: 4 }}>
                  {isMe ? c.original : c.translated}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function renderSessionDetail(session) {
  if (!session.detail) return null;
  switch (session.type) {
    case "meeting": return <MeetingDetail detail={session.detail} />;
    case "navigation": return <NavigationDetail detail={session.detail} />;
    case "ocr": return <OcrDetail detail={session.detail} />;
    case "exercise": return <ExerciseDetail detail={session.detail} />;
    case "translation": return <TranslationDetail detail={session.detail} />;
    default: return null;
  }
}

/* ── Session Card (with accordion) ── */
function SessionCard({ session, expanded, onToggle }) {
  const IconComp = getIconForType(session.type);
  const colors = iconColors[session.type] || iconColors.memory;

  return (
    <div style={{
      borderRadius: radius.lg, backgroundColor: color.surface,
      boxShadow: expanded ? shadow.md : shadow.sm,
      transition: "box-shadow 0.2s ease",
      overflow: "hidden",
    }}>
      {/* Card header (always visible) */}
      <div
        onClick={onToggle}
        style={{ display: "flex", gap: 14, padding: "14px", cursor: "pointer" }}
      >
        <div style={{
          width: 42, height: 42, borderRadius: radius.md,
          backgroundColor: colors.bg,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <IconComp size={20} color={colors.fg} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
            <div style={{
              fontSize: font.bodyText.size, fontWeight: 700, color: color.text1,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 8,
            }}>
              {session.title}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <span style={{ fontSize: font.tiny.size, color: color.text4 }}>{session.ago}</span>
              <ChevronDownIcon size={16} color={color.text4} rotate={expanded} />
            </div>
          </div>
          {!expanded && (
            <>
              <div style={{
                fontSize: font.caption.size, color: color.text3, lineHeight: 1.5, marginBottom: 6,
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {session.preview}
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {session.tags.map((tag) => (
                  <span key={tag} style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 6,
                    backgroundColor: colors.bg, color: colors.fg, fontWeight: 500,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Expanded detail content */}
      {expanded && (
        <div style={{
          padding: "0 14px 14px",
          animation: "fadeUp 0.25s ease",
        }}>
          {/* Date & tags row */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
            <ClockIcon size={12} color={color.text4} />
            <span style={{ fontSize: 11, color: color.text4 }}>{session.date}</span>
            <span style={{ fontSize: 11, color: color.border }}>|</span>
            {session.tags.map((tag) => (
              <span key={tag} style={{
                fontSize: 10, padding: "2px 8px", borderRadius: 6,
                backgroundColor: colors.bg, color: colors.fg, fontWeight: 500,
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: color.background, marginBottom: 14 }} />

          {/* Type-specific detail content */}
          {renderSessionDetail(session)}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, marginTop: 16, paddingTop: 12, borderTop: `1px solid ${color.background}` }}>
            {[
              { Icon: ShareIcon, label: "공유", color: color.text3 },
              { Icon: ExportIcon, label: "내보내기", color: color.text3 },
              { Icon: TrashIcon, label: "삭제", color: color.danger },
            ].map((action) => (
              <div key={action.label} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                padding: "9px 0", borderRadius: radius.sm,
                backgroundColor: color.background, cursor: "pointer",
                fontSize: 11, fontWeight: 500, color: action.color,
                transition: "background-color 0.15s",
              }}>
                <action.Icon size={14} color={action.color} />{action.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Memory Page ── */
export default function MemoryPage() {
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [askResult, setAskResult] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sessions] = useState(MOCK_SESSIONS);
  const [expandedId, setExpandedId] = useState(null);

  const filters = [
    { key: "all", label: "전체", Icon: null, iconColor: null },
    { key: "meeting", label: "회의", Icon: MeetingIcon, iconColor: iconColors.meeting.fg },
    { key: "navigation", label: "길안내", Icon: MapRouteIcon, iconColor: iconColors.navigation.fg },
    { key: "ocr", label: "OCR", Icon: ScanTextIcon, iconColor: iconColors.ocr.fg },
    { key: "exercise", label: "운동", Icon: ActivityIcon, iconColor: iconColors.exercise.fg },
    { key: "translation", label: "번역", Icon: LanguagesIcon, iconColor: iconColors.translation.fg },
  ];

  const filteredSessions = activeFilter === "all" ? sessions : sessions.filter((s) => s.type === activeFilter);

  const handleSearch = () => {
    if (!searchText.trim()) return;
    setIsSearching(true); setAskResult(null);
    setTimeout(() => { setAskResult(MOCK_ASK_RESULT); setIsSearching(false); }, 1500);
  };

  const clearSearch = () => { setSearchText(""); setAskResult(null); setIsSearching(false); };

  return (
    <div style={{ flex: 1, overflowY: "auto", backgroundColor: "transparent" }}>
      {/* Header */}
      <div style={{ padding: "20px 24px 4px", animation: "fadeUp 0.4s ease both" }}>
        <div style={{ fontSize: font.h1.size, fontWeight: font.h1.weight, color: color.primary, letterSpacing: font.h1.letterSpacing, fontFamily: font.display }}>기억</div>
        <div style={{ fontSize: font.caption.size, color: color.text3, marginTop: 2 }}>AIVY에게 무엇이든 물어보세요</div>
      </div>

      {/* Search bar */}
      <div style={{ padding: "12px 20px 4px", animation: "fadeUp 0.4s ease 60ms both" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: radius.lg,
          backgroundColor: color.surface, boxShadow: shadow.sm,
          border: isSearching ? `1.5px solid ${color.accent}` : "1.5px solid transparent", transition: "border-color 0.2s ease",
        }}>
          <SparkleSmall />
          <input type="text" placeholder="무엇이든 물어보세요..." value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{ flex: 1, border: "none", outline: "none", backgroundColor: "transparent", fontSize: font.bodyText.size, color: color.text1, fontFamily: font.body }}
          />
          {searchText && <div onClick={clearSearch} style={{ cursor: "pointer", fontSize: 18, color: color.text4, lineHeight: 1 }}>×</div>}
          <div onClick={handleSearch} style={{
            padding: "6px 14px", borderRadius: radius.sm,
            backgroundColor: searchText.trim() ? color.primary : color.backgroundAlt, cursor: searchText.trim() ? "pointer" : "default",
            transition: "background-color 0.2s ease",
          }}>
            <SearchIcon c={searchText.trim() ? "white" : color.text4} />
          </div>
        </div>
      </div>

      {/* Recent queries */}
      {!askResult && !isSearching && (
        <div style={{ padding: "10px 20px 0", animation: "fadeUp 0.4s ease 120ms both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <ClockIcon size={14} color={color.text4} /><span style={{ fontSize: font.tiny.size, color: color.text4 }}>최근 검색</span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {MOCK_RECENT_QUERIES.map((q) => (
              <div key={q} onClick={() => setSearchText(q)}
                style={{ padding: "6px 12px", borderRadius: 18, backgroundColor: color.surface, fontSize: font.caption.size, color: color.text3, cursor: "pointer", boxShadow: shadow.sm }}>
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
          <div style={{ backgroundColor: color.surface, borderRadius: radius.lg, padding: "18px", boxShadow: shadow.md, borderLeft: `3px solid ${color.accent}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <SparkleSmall /><span style={{ fontSize: font.caption.size, fontWeight: 600, color: color.accent }}>AI 답변</span>
            </div>
            <div style={{ fontSize: font.caption.size, color: color.text3, marginBottom: 12 }}>"{askResult.query}"</div>
            <div style={{ fontSize: font.h3.size, fontWeight: font.h3.weight, color: color.primary, lineHeight: 1.6, marginBottom: 14 }}>{askResult.answer}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: radius.sm, backgroundColor: color.background, cursor: "pointer" }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                backgroundColor: iconColors.meeting.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <MeetingIcon size={14} color={iconColors.meeting.fg} />
              </div>
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
      <div style={{ padding: "14px 20px 8px", animation: "fadeUp 0.4s ease 180ms both" }}>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
          {filters.map((f) => (
            <FilterChip
              key={f.key}
              label={f.label}
              Icon={f.Icon}
              iconColor={f.iconColor}
              active={activeFilter === f.key}
              onClick={() => setActiveFilter(f.key)}
            />
          ))}
        </div>
      </div>

      {/* Sessions */}
      <div style={{ padding: "4px 20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: font.label.size, fontWeight: font.label.weight, color: color.text3, letterSpacing: font.label.letterSpacing, textTransform: "uppercase" }}>세션 기록</span>
          <span style={{ fontSize: font.tiny.size, color: color.text4 }}>{filteredSessions.length}개</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filteredSessions.map((session, i) => (
            <div key={session.id} style={{ animation: `fadeUp 0.4s ease ${240 + i * 50}ms both` }}>
              <SessionCard
                session={session}
                expanded={expandedId === session.id}
                onToggle={() => setExpandedId(expandedId === session.id ? null : session.id)}
              />
            </div>
          ))}
        </div>
        {filteredSessions.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: color.text4, fontSize: font.bodyText.size }}>세션을 찾을 수 없습니다</div>
        )}
      </div>
    </div>
  );
}
