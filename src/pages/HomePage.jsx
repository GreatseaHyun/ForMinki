import { useState, useEffect } from "react";
import { color, font, radius } from "../tokens";

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
  { id: 1, text: "탭 감지됨", detail: "30초 전", icon: "👆" },
  { id: 2, text: "고개 끄덕임", detail: "2분 전", icon: "👋" },
  { id: 3, text: "걷기 감지됨", detail: "5분 전", icon: "🚶" },
];

const BtIcon = ({ active }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? color.accent : color.text4} strokeWidth="2" strokeLinecap="round">
    <path d="M6.5 6.5l11 11L12 23V1l5.5 5.5-11 11" />
  </svg>
);

const WifiIcon = ({ active }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? color.positive : color.text4} strokeWidth="2" strokeLinecap="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <circle cx="12" cy="20" r="1" fill={active ? color.positive : color.text4} />
  </svg>
);

const BatteryIcon = ({ percent }) => {
  const c = percent > 50 ? color.positive : percent > 20 ? color.warning : color.danger;
  return (
    <svg width="28" height="16" viewBox="0 0 28 16">
      <rect x="0" y="0" width="24" height="16" rx="3" fill="none" stroke={color.text3} strokeWidth="1.5" />
      <rect x="24" y="4" width="3" height="8" rx="1" fill={color.text3} />
      <rect x="2" y="2" width={Math.max(0, (percent / 100) * 20)} height="12" rx="1.5" fill={c} />
    </svg>
  );
};

function StatusChip({ label, connected }) {
  return (
    <div style={{
      flex: 1, display: "flex", alignItems: "center", gap: 8,
      padding: "10px 14px", borderRadius: radius.md,
      backgroundColor: connected ? color.positiveLight : color.backgroundAlt,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: connected ? color.positive : color.text4 }} />
      <span style={{ fontSize: font.caption.size, fontWeight: 500, color: connected ? color.positive : color.text3 }}>{label}</span>
    </div>
  );
}

function EventTypeBadge({ type }) {
  const colors = {
    GESTURE: { bg: "#EBF0F7", text: "#2E5E8E" },
    ACTIVITY: { bg: "#E8F5E9", text: "#2E8B57" },
    TAP: { bg: "#FFF3E0", text: "#E67E22" },
    DEVICE: { bg: "#F3E5F5", text: "#7B1FA2" },
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

export default function HomePage({ onNavigate, devMode }) {
  const [device] = useState(MOCK_DEVICE);
  const [events] = useState(MOCK_EVENTS);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const scenarios = [
    { name: "길안내", emoji: "🗺", tab: "navigate" },
    { name: "번역", emoji: "🌐", tab: "translate" },
    { name: "OCR", emoji: "📸", tab: null },
    { name: "운동", emoji: "🏃", tab: null },
    { name: "회의", emoji: "📝", tab: null },
    { name: "기억", emoji: "🧠", tab: "memory" },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", backgroundColor: color.background }}>
      {/* Status bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px 6px", fontSize: 13, color: color.text3 }}>
        <span style={{ fontWeight: 600 }}>
          {time.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BtIcon active={device.btConnected} />
          <WifiIcon active={device.wifiDirectConnected} />
        </div>
      </div>

      {/* Header */}
      <div style={{ padding: "12px 24px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, backgroundColor: color.primary,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 14, fontWeight: 700, letterSpacing: 1,
          }}>
            Ai
          </div>
          <div>
            <div style={{ fontSize: font.h2.size, fontWeight: font.h2.weight, letterSpacing: font.h2.letterSpacing, color: color.primary }}>AIVY</div>
            <div style={{ fontSize: font.caption.size, color: color.text3, marginTop: -2 }}>Companion</div>
          </div>
        </div>
      </div>

      {/* Device Card — Simplified */}
      <div style={{ padding: "0 20px", marginBottom: 14 }}>
        <div style={{ background: color.surface, borderRadius: radius.lg, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          {/* Row 1: Device name + battery */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                backgroundColor: device.connected ? color.positive : color.danger,
              }} />
              <span style={{ fontSize: font.h3.size, fontWeight: font.h3.weight, color: color.text1 }}>{device.name}</span>
              <span style={{ fontSize: font.tiny.size, color: device.connected ? color.positive : color.text4, fontWeight: 500 }}>
                {device.connected ? "연결됨" : "연결 안됨"}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <BatteryIcon percent={device.battery} />
              <span style={{ fontSize: font.body.size, fontWeight: 600, color: color.text1 }}>{device.battery}%</span>
            </div>
          </div>

          {/* Row 2: Connection status chips */}
          <div style={{ display: "flex", gap: 8 }}>
            <StatusChip label="Bluetooth" connected={device.btConnected} />
            <StatusChip label="WiFi Direct" connected={device.wifiDirectConnected} />
          </div>
        </div>
      </div>

      {/* Shortcuts (바로가기) */}
      <div style={{ padding: "0 20px", marginBottom: 14 }}>
        <div style={{ fontSize: font.label.size, fontWeight: font.label.weight, color: color.text3, marginBottom: 10, letterSpacing: font.label.letterSpacing, textTransform: "uppercase", paddingLeft: 2 }}>
          바로가기
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {scenarios.map((s) => (
            <div
              key={s.name}
              onClick={() => s.tab && onNavigate(s.tab)}
              style={{
                backgroundColor: color.surface, borderRadius: radius.lg, padding: "16px 12px",
                textAlign: "center", cursor: s.tab ? "pointer" : "default",
                transition: "transform 0.15s", opacity: s.tab ? 1 : 0.45,
                border: `1px solid ${color.border}`,
              }}
              onMouseEnter={(e) => s.tab && (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => s.tab && (e.currentTarget.style.transform = "scale(1)")}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.emoji}</div>
              <div style={{ fontSize: font.caption.size, fontWeight: 600, color: s.tab ? color.text1 : color.text3 }}>{s.name}</div>
              {!s.tab && <div style={{ fontSize: 10, color: color.text4, marginTop: 2 }}>준비 중</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity (consumer) or Event Log (dev) */}
      <div style={{ padding: "0 20px", paddingBottom: 20 }}>
        {devMode ? (
          /* Dev Mode: Raw Event Log */
          <div style={{ background: color.surface, borderRadius: radius.lg, padding: "14px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
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
            <div style={{ fontSize: font.label.size, fontWeight: font.label.weight, color: color.text3, marginBottom: 10, letterSpacing: font.label.letterSpacing, textTransform: "uppercase", paddingLeft: 2 }}>
              최근 활동
            </div>
            <div style={{ background: color.surface, borderRadius: radius.lg, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              {MOCK_ACTIVITY.map((a, i) => (
                <div key={a.id} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                  borderBottom: i < MOCK_ACTIVITY.length - 1 ? `1px solid ${color.background}` : "none",
                }}>
                  <span style={{ fontSize: 18 }}>{a.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: font.body.size, fontWeight: 500, color: color.text1 }}>{a.text}</div>
                  </div>
                  <span style={{ fontSize: font.tiny.size, color: color.text4 }}>{a.detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
