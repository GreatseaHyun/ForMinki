import { useState, useEffect } from "react";
import { color, font, radius, shadow } from "../tokens";
import {
  AivyLogoIcon, MeetingIcon, MapRouteIcon, ScanTextIcon,
  ActivityIcon, LanguagesIcon, SparklesIcon, PointerIcon,
  HandWaveIcon, FootstepsIcon, LockIcon, iconColors,
} from "../icons";

const MOCK_DEVICE = {
  connected: true, name: "AIVY-Pro", btConnected: true, wifiDirectConnected: true,
  battery: 72, temperature: 38.5, routeState: "local", firmwareVersion: "1.2.0",
};

const MOCK_EVENTS = [
  { id: 1, type: "GESTURE_NOD", confidence: 0.95, time: "14:32:01", ago: "2s ago" },
  { id: 2, type: "ACTIVITY_WALK", confidence: 0.88, time: "14:31:58", ago: "5s ago" },
  { id: 3, type: "DEVICE_STATUS", confidence: 1.0, time: "14:31:45", ago: "18s ago" },
  { id: 4, type: "TAP_SHORT", confidence: 0.92, time: "14:31:30", ago: "33s ago" },
  { id: 5, type: "ACTIVITY_STILL", confidence: 0.97, time: "14:31:15", ago: "48s ago" },
];

const MOCK_ACTIVITY = [
  { id: 1, text: "탭 감지됨", detail: "단일 탭 — 확인 제스처", time: "30초 전", type: "gesture" },
  { id: 2, text: "고개 끄덕임 감지", detail: "동의 제스처 (95% 확신)", time: "2분 전", type: "gesture" },
  { id: 3, text: "걷기 감지됨", detail: "평균 속도 4.2km/h, 127보", time: "5분 전", type: "activity" },
  { id: 4, text: "OCR 텍스트 저장됨", detail: "간판 텍스트 — '이디야커피 신촌점'", time: "8분 전", type: "ocr" },
  { id: 5, text: "번역 세션 완료", detail: "KO↔JA 4턴 — 도쿄역 방향 문의", time: "12분 전", type: "translation" },
];

const activityIconMap = {
  gesture: { Icon: PointerIcon, colors: iconColors.gesture },
  activity: { Icon: FootstepsIcon, colors: iconColors.exercise },
  ocr: { Icon: ScanTextIcon, colors: iconColors.ocr },
  translation: { Icon: LanguagesIcon, colors: iconColors.translation },
};

const BtIcon = ({ active }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? color.accent : color.text4} strokeWidth="2" strokeLinecap="round">
    <path d="M6.5 6.5l11 11L12 23V1l5.5 5.5-11 11" />
  </svg>
);

const WifiIcon = ({ active }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? color.positive : color.text4} strokeWidth="2" strokeLinecap="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <circle cx="12" cy="20" r="1" fill={active ? color.positive : color.text4} />
  </svg>
);

const BatteryIcon = ({ percent }) => {
  const c = percent > 50 ? color.positive : percent > 20 ? color.warning : color.danger;
  return (
    <svg width="26" height="14" viewBox="0 0 28 16">
      <rect x="0" y="0" width="24" height="16" rx="3" fill="none" stroke={color.text3} strokeWidth="1.5" />
      <rect x="24" y="4" width="3" height="8" rx="1" fill={color.text3} />
      <rect x="2" y="2" width={Math.max(0, (percent / 100) * 20)} height="12" rx="1.5" fill={c} />
    </svg>
  );
};

function EventTypeBadge({ type }) {
  const colors = {
    GESTURE: { bg: iconColors.gesture.bg, text: iconColors.gesture.fg },
    ACTIVITY: { bg: iconColors.exercise.bg, text: iconColors.exercise.fg },
    TAP: { bg: iconColors.gesture.bg, text: iconColors.gesture.fg },
    DEVICE: { bg: iconColors.device.bg, text: iconColors.device.fg },
  };
  const prefix = type.split("_")[0];
  const c = colors[prefix] || { bg: "#F5F5F5", text: "#666" };
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 12,
      backgroundColor: c.bg, color: c.text, fontSize: 11, fontWeight: 600,
    }}>
      {type}
    </span>
  );
}

const scenarios = [
  { name: "길안내", subtitle: "내비게이션", Icon: MapRouteIcon, colors: iconColors.navigation, tab: "navigate" },
  { name: "번역", subtitle: "실시간 통역", Icon: LanguagesIcon, colors: iconColors.translation, tab: "translate" },
  { name: "OCR", subtitle: "텍스트 인식", Icon: ScanTextIcon, colors: iconColors.ocr, tab: null },
  { name: "운동", subtitle: "활동 추적", Icon: ActivityIcon, colors: iconColors.exercise, tab: null },
  { name: "회의", subtitle: "회의 기록", Icon: MeetingIcon, colors: iconColors.meeting, tab: null },
  { name: "기억", subtitle: "AI 검색", Icon: SparklesIcon, colors: iconColors.memory, tab: "memory" },
];

export default function HomePage({ onNavigate, devMode }) {
  const [device] = useState(MOCK_DEVICE);
  const [events] = useState(MOCK_EVENTS);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ flex: 1, overflowY: "auto", backgroundColor: "transparent" }}>
      {/* Hero gradient top */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 180,
        background: `linear-gradient(180deg, rgba(27,54,84,0.06) 0%, rgba(27,54,84,0.02) 60%, transparent 100%)`,
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Status bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 20px 6px", fontSize: 13, color: color.text3, position: "relative", zIndex: 1,
      }}>
        <span style={{ fontWeight: 600, fontFamily: font.body }}>
          {time.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BtIcon active={device.btConnected} />
          <WifiIcon active={device.wifiDirectConnected} />
        </div>
      </div>

      {/* Header with logo */}
      <div style={{
        padding: "12px 24px 16px", position: "relative", zIndex: 1,
        animation: "fadeUp 0.4s ease both",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <AivyLogoIcon size={40} />
          <div>
            <div style={{
              fontSize: font.h1.size, fontWeight: font.h1.weight,
              letterSpacing: font.h1.letterSpacing, color: color.brandNavy,
              fontFamily: font.display,
            }}>
              AIVY
            </div>
            <div style={{ fontSize: font.caption.size, color: color.text3, marginTop: -2, letterSpacing: 0.3 }}>Companion</div>
          </div>
        </div>
      </div>

      {/* Device Card — Premium gradient */}
      <div style={{
        padding: "0 20px", marginBottom: 18, position: "relative", zIndex: 1,
        animation: "fadeUp 0.4s ease 60ms both",
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${color.primary} 0%, #264E78 100%)`,
          borderRadius: radius.lg, padding: "18px 20px",
          boxShadow: "0 4px 16px rgba(27,58,92,0.2)",
        }}>
          {/* Row 1: Device name + battery */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                backgroundColor: "#4ADE80",
                boxShadow: "0 0 8px rgba(74,222,128,0.4)",
              }} />
              <span style={{ fontSize: font.h3.size, fontWeight: font.h3.weight, color: "white", fontFamily: font.display }}>{device.name}</span>
              <span style={{ fontSize: font.tiny.size, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
                {device.connected ? "연결됨" : "연결 안됨"}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="24" height="13" viewBox="0 0 28 16">
                <rect x="0" y="0" width="24" height="16" rx="3" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <rect x="24" y="4" width="3" height="8" rx="1" fill="rgba(255,255,255,0.4)" />
                <rect x="2" y="2" width={Math.max(0, (device.battery / 100) * 20)} height="12" rx="1.5" fill="#4ADE80" />
              </svg>
              <span style={{ fontSize: font.body.size, fontWeight: 600, color: "white" }}>{device.battery}%</span>
            </div>
          </div>

          {/* Row 2: Connection status chips */}
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { label: "Bluetooth", connected: device.btConnected },
              { label: "WiFi Direct", connected: device.wifiDirectConnected },
            ].map((chip) => (
              <div key={chip.label} style={{
                flex: 1, display: "flex", alignItems: "center", gap: 8,
                padding: "9px 14px", borderRadius: radius.md,
                backgroundColor: chip.connected ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.08)",
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  backgroundColor: chip.connected ? "#4ADE80" : "rgba(255,255,255,0.3)",
                }} />
                <span style={{
                  fontSize: font.caption.size, fontWeight: 500,
                  color: chip.connected ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                }}>
                  {chip.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shortcuts */}
      <div style={{
        padding: "0 20px", marginBottom: 18, position: "relative", zIndex: 1,
        animation: "fadeUp 0.4s ease 120ms both",
      }}>
        <div style={{
          fontSize: font.label.size, fontWeight: font.label.weight, color: color.text3,
          marginBottom: 10, letterSpacing: font.label.letterSpacing, textTransform: "uppercase", paddingLeft: 2,
        }}>
          바로가기
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {scenarios.map((s) => {
            const enabled = !!s.tab;
            return (
              <div
                key={s.name}
                onClick={() => enabled && onNavigate(s.tab)}
                style={{
                  backgroundColor: color.surface, borderRadius: radius.lg, padding: "16px 10px 14px",
                  textAlign: "center", cursor: enabled ? "pointer" : "default",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  opacity: enabled ? 1 : 0.55,
                  boxShadow: shadow.sm,
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  if (enabled) {
                    e.currentTarget.style.transform = "scale(1.03)";
                    e.currentTarget.style.boxShadow = shadow.md;
                  }
                }}
                onMouseLeave={(e) => {
                  if (enabled) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = shadow.sm;
                  }
                }}
              >
                {/* Icon container */}
                <div style={{
                  width: 40, height: 40, borderRadius: radius.md,
                  backgroundColor: enabled ? s.colors.bg : color.backgroundAlt,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 8px",
                }}>
                  <s.Icon size={20} color={enabled ? s.colors.fg : color.text4} />
                </div>
                <div style={{ fontSize: font.caption.size, fontWeight: 600, color: enabled ? color.text1 : color.text3 }}>{s.name}</div>
                <div style={{ fontSize: 10, color: color.text4, marginTop: 1 }}>{s.subtitle}</div>
                {/* Lock overlay for disabled */}
                {!enabled && (
                  <div style={{
                    position: "absolute", top: 8, right: 8,
                    width: 20, height: 20, borderRadius: 6,
                    backgroundColor: color.backgroundAlt,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <LockIcon size={11} color={color.text4} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity (consumer) or Event Log (dev) */}
      <div style={{
        padding: "0 20px", paddingBottom: 24, position: "relative", zIndex: 1,
        animation: "fadeUp 0.4s ease 180ms both",
      }}>
        {devMode ? (
          /* Dev Mode: Raw Event Log */
          <div style={{ background: color.surface, borderRadius: radius.lg, padding: "14px 20px", boxShadow: shadow.sm }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: font.label.size, fontWeight: font.label.weight, color: color.text3, letterSpacing: font.label.letterSpacing, textTransform: "uppercase" }}>Event Log</div>
              <span style={{ fontSize: font.tiny.size, color: color.accent, fontWeight: 500, cursor: "pointer" }}>Clear</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {events.map((ev) => (
                <div key={ev.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${color.background}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <EventTypeBadge type={ev.type} />
                    <span style={{ fontSize: font.tiny.size, color: color.text3 }}>{ev.confidence.toFixed(2)}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: font.tiny.size, color: color.text2, fontFamily: "monospace" }}>{ev.time}</div>
                    <div style={{ fontSize: 10, color: color.text4 }}>{ev.ago}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Consumer Mode: Friendly activity */
          <div>
            <div style={{
              fontSize: font.label.size, fontWeight: font.label.weight, color: color.text3,
              marginBottom: 10, letterSpacing: font.label.letterSpacing, textTransform: "uppercase", paddingLeft: 2,
            }}>
              최근 활동
            </div>
            <div style={{ background: color.surface, borderRadius: radius.lg, overflow: "hidden", boxShadow: shadow.sm }}>
              {MOCK_ACTIVITY.map((a, i) => {
                const iconInfo = activityIconMap[a.type] || activityIconMap.gesture;
                const IconComp = iconInfo.Icon;
                return (
                  <div key={a.id} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                    borderBottom: i < MOCK_ACTIVITY.length - 1 ? `1px solid ${color.background}` : "none",
                  }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: radius.sm,
                      backgroundColor: iconInfo.colors.bg,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <IconComp size={17} color={iconInfo.colors.fg} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: font.bodyText.size, fontWeight: 500, color: color.text1 }}>{a.text}</div>
                      <div style={{ fontSize: font.tiny.size, color: color.text4, marginTop: 1 }}>{a.detail}</div>
                    </div>
                    <span style={{ fontSize: font.tiny.size, color: color.text4, flexShrink: 0 }}>{a.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
