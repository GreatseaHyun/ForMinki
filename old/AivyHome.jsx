import { useState, useEffect } from "react";

// Mock data simulating WearableConnectionService states
const MOCK_DEVICE = {
  connected: true,
  name: "AIVY-Pro",
  btConnected: true,
  wifiDirectConnected: true,
  battery: 72,
  temperature: 38.5,
  routeState: "local", // local | cloud_offload
  firmwareVersion: "1.2.0",
};

const MOCK_EVENTS = [
  { id: 1, type: "GESTURE_NOD", confidence: 0.95, time: "14:32:01", ago: "2s ago" },
  { id: 2, type: "ACTIVITY_WALK", confidence: 0.88, time: "14:31:58", ago: "5s ago" },
  { id: 3, type: "DEVICE_STATUS", confidence: 1.0, time: "14:31:45", ago: "18s ago" },
  { id: 4, type: "TAP_SHORT", confidence: 0.92, time: "14:31:30", ago: "33s ago" },
  { id: 5, type: "ACTIVITY_STILL", confidence: 0.97, time: "14:31:15", ago: "48s ago" },
];

// Icons as simple SVG components
const BtIcon = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#3A7BBF" : "#CCC"} strokeWidth="2" strokeLinecap="round">
    <path d="M6.5 6.5l11 11L12 23V1l5.5 5.5-11 11" />
  </svg>
);

const WifiIcon = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#2E8B57" : "#CCC"} strokeWidth="2" strokeLinecap="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <circle cx="12" cy="20" r="1" fill={active ? "#2E8B57" : "#CCC"} />
  </svg>
);

const BatteryIcon = ({ percent }) => {
  const color = percent > 50 ? "#2E8B57" : percent > 20 ? "#E67E22" : "#CC3333";
  return (
    <svg width="28" height="16" viewBox="0 0 28 16">
      <rect x="0" y="0" width="24" height="16" rx="3" fill="none" stroke="#888" strokeWidth="1.5" />
      <rect x="24" y="4" width="3" height="8" rx="1" fill="#888" />
      <rect x="2" y="2" width={Math.max(0, (percent / 100) * 20)} height="12" rx="1.5" fill={color} />
    </svg>
  );
};

const TempIcon = () => (
  <svg width="16" height="20" viewBox="0 0 16 24" fill="none" stroke="#E67E22" strokeWidth="1.5">
    <path d="M8 14V4a3 3 0 1 0-6 0v10a5 5 0 1 0 6 0z" />
    <circle cx="5" cy="18" r="2" fill="#E67E22" />
  </svg>
);

function ConnectionDot({ active }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: active ? "#2E8B57" : "#CC3333",
        marginRight: 6,
        boxShadow: active ? "0 0 6px rgba(46,139,87,0.5)" : "0 0 6px rgba(204,51,51,0.3)",
      }}
    />
  );
}

function EventTypeBadge({ type }) {
  const colors = {
    GESTURE: { bg: "#EBF0F7", text: "#2E5E8E" },
    ACTIVITY: { bg: "#E8F5E9", text: "#2E8B57" },
    TAP: { bg: "#FFF3E0", text: "#E67E22" },
    DEVICE: { bg: "#F3E5F5", text: "#7B1FA2" },
    SKIN: { bg: "#FFEBEE", text: "#CC3333" },
    FALL: { bg: "#FFEBEE", text: "#CC3333" },
  };
  const prefix = type.split("_")[0];
  const c = colors[prefix] || { bg: "#F5F5F5", text: "#666" };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 12,
        backgroundColor: c.bg,
        color: c.text,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 0.3,
      }}
    >
      {type}
    </span>
  );
}

export default function AivyHome() {
  const [device, setDevice] = useState(MOCK_DEVICE);
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [activeScenario, setActiveScenario] = useState(null); // null = idle
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const ttsPolicy =
    device.battery > 50 ? "FULL_TTS" : device.battery > 20 ? "SUMMARY_TTS" : "TEXT_ONLY";
  const ttsPolicyColor =
    device.battery > 50 ? "#2E8B57" : device.battery > 20 ? "#E67E22" : "#CC3333";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAFBFC",
        fontFamily: "'DM Sans', 'Pretendard', -apple-system, sans-serif",
        color: "#1a1a1a",
        maxWidth: 430,
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Status bar mock */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px 8px",
          fontSize: 13,
          color: "#888",
        }}
      >
        <span style={{ fontWeight: 600 }}>
          {time.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BtIcon active={device.btConnected} />
          <WifiIcon active={device.wifiDirectConnected} />
        </div>
      </div>

      {/* Header */}
      <div style={{ padding: "16px 24px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #1B3A5C, #3A7BBF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            Ai
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: "#1B3A5C" }}>
              AIVY
            </div>
            <div style={{ fontSize: 12, color: "#999", marginTop: -2 }}>Companion</div>
          </div>
        </div>
      </div>

      {/* Connection Card */}
      <div style={{ padding: "0 20px", marginBottom: 16 }}>
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: "20px 22px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          {/* Device name + connection status */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ConnectionDot active={device.connected} />
              <span style={{ fontSize: 16, fontWeight: 700 }}>{device.name}</span>
              <span
                style={{
                  fontSize: 11,
                  color: device.connected ? "#2E8B57" : "#CC3333",
                  fontWeight: 500,
                }}
              >
                {device.connected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <span style={{ fontSize: 11, color: "#BBB" }}>FW {device.firmwareVersion}</span>
          </div>

          {/* Connection details */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 12px",
                borderRadius: 10,
                backgroundColor: device.btConnected ? "#F0F7FF" : "#FFF5F5",
              }}
            >
              <BtIcon active={device.btConnected} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#555" }}>Bluetooth</div>
                <div style={{ fontSize: 10, color: device.btConnected ? "#3A7BBF" : "#CC3333" }}>
                  {device.btConnected ? "Audio SCO Active" : "Disconnected"}
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 12px",
                borderRadius: 10,
                backgroundColor: device.wifiDirectConnected ? "#F0FFF4" : "#FFF5F5",
              }}
            >
              <WifiIcon active={device.wifiDirectConnected} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#555" }}>WiFi Direct</div>
                <div
                  style={{
                    fontSize: 10,
                    color: device.wifiDirectConnected ? "#2E8B57" : "#CC3333",
                  }}
                >
                  {device.wifiDirectConnected ? "Data Channel Open" : "Disconnected"}
                </div>
              </div>
            </div>
          </div>

          {/* Battery + Temp + Route State */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
            }}
          >
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <BatteryIcon percent={device.battery} />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: device.battery > 20 ? "#1a1a1a" : "#CC3333" }}>
                {device.battery}%
              </div>
              <div style={{ fontSize: 10, color: "#999" }}>Battery</div>
            </div>
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                <TempIcon />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: device.temperature >= 50 ? "#CC3333" : "#1a1a1a" }}>
                {device.temperature}°
              </div>
              <div style={{ fontSize: 10, color: "#999" }}>Temperature</div>
            </div>
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  backgroundColor: device.routeState === "local" ? "#E8F5E9" : "#FFF3E0",
                  margin: "0 auto 4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                }}
              >
                {device.routeState === "local" ? "L" : "C"}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>
                {device.routeState === "local" ? "Local" : "Cloud"}
              </div>
              <div style={{ fontSize: 10, color: "#999" }}>Route State</div>
            </div>
          </div>

          {/* TTS Policy indicator */}
          <div
            style={{
              marginTop: 12,
              padding: "8px 12px",
              borderRadius: 8,
              backgroundColor: "#FAFBFC",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 11, color: "#888" }}>TTS Policy</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: ttsPolicyColor }}>{ttsPolicy}</span>
          </div>
        </div>
      </div>

      {/* Active Scenario (or Idle) */}
      <div style={{ padding: "0 20px", marginBottom: 16 }}>
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: "16px 22px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: "#999", marginBottom: 8, letterSpacing: 0.5, textTransform: "uppercase" }}>
            Current Scenario
          </div>
          {activeScenario ? (
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1B3A5C" }}>{activeScenario}</div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#DDD",
                }}
              />
              <span style={{ fontSize: 15, color: "#BBB" }}>Idle — Waiting for input</span>
            </div>
          )}
        </div>
      </div>

      {/* Event Log (WearableConnectionService test) */}
      <div style={{ padding: "0 20px", marginBottom: 20 }}>
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: "16px 22px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: "#999", letterSpacing: 0.5, textTransform: "uppercase" }}>
              Event Log
            </div>
            <span style={{ fontSize: 11, color: "#3A7BBF", fontWeight: 500, cursor: "pointer" }}>
              Clear
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {events.map((ev) => (
              <div
                key={ev.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #F5F5F5",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <EventTypeBadge type={ev.type} />
                  <span style={{ fontSize: 11, color: "#999" }}>{ev.confidence.toFixed(2)}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>{ev.time}</div>
                  <div style={{ fontSize: 10, color: "#CCC" }}>{ev.ago}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scenario Quick Launch (placeholder) */}
      <div style={{ padding: "0 20px", marginBottom: 30 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#999", marginBottom: 10, letterSpacing: 0.5, textTransform: "uppercase", paddingLeft: 2 }}>
          Scenarios
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { name: "Navigation", emoji: "🗺", color: "#E8EEF4" },
            { name: "Translation", emoji: "🌐", color: "#E3F2FD" },
            { name: "OCR", emoji: "📸", color: "#FFF8E1" },
            { name: "Exercise", emoji: "🏃", color: "#E8F5E9" },
            { name: "Meeting", emoji: "📝", color: "#F3E5F5" },
            { name: "Memory", emoji: "🧠", color: "#FFEBEE" },
          ].map((s) => (
            <div
              key={s.name}
              style={{
                backgroundColor: s.color,
                borderRadius: 14,
                padding: "18px 12px",
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>{s.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>{s.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
