import { useState } from "react";

// --- Toggle Component ---
function Toggle({ value, onChange, color = "#3A7BBF" }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 48,
        height: 28,
        borderRadius: 14,
        backgroundColor: value ? color : "#DDD",
        padding: 3,
        cursor: "pointer",
        transition: "background-color 0.2s ease",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          backgroundColor: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          transform: value ? "translateX(20px)" : "translateX(0)",
          transition: "transform 0.2s ease",
        }}
      />
    </div>
  );
}

// --- Select Chip ---
function ChipSelect({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map((opt) => (
        <div
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            padding: "6px 14px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: value === opt.value ? 600 : 400,
            backgroundColor: value === opt.value ? "#1B3A5C" : "#F0F0F0",
            color: value === opt.value ? "white" : "#777",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          {opt.label}
        </div>
      ))}
    </div>
  );
}

// --- Section ---
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "#999",
          letterSpacing: 0.8,
          textTransform: "uppercase",
          padding: "0 4px",
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      <div
        style={{
          background: "white",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// --- Row ---
function Row({ label, desc, right, last = false, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 20px",
        borderBottom: last ? "none" : "1px solid #F5F5F5",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div style={{ flex: 1, marginRight: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "#333" }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: "#AAA", marginTop: 2 }}>{desc}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{right}</div>
    </div>
  );
}

// --- Value display ---
function Value({ text, color = "#555" }) {
  return <span style={{ fontSize: 13, color, fontWeight: 500 }}>{text}</span>;
}

// --- Chevron ---
function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CCC" strokeWidth="2" strokeLinecap="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default function AivySettings() {
  // Device
  const [deviceName, setDeviceName] = useState("AIVY-Pro");
  const [autoConnect, setAutoConnect] = useState(true);

  // Connection
  const [btEnabled, setBtEnabled] = useState(true);
  const [wifiDirectEnabled, setWifiDirectEnabled] = useState(true);
  const [eventChannel, setEventChannel] = useState("wifi"); // wifi | bt

  // AI / Inference
  const [llmProvider, setLlmProvider] = useState("claude");
  const [slmModel, setSlmModel] = useState("qwen3");
  const [offlineFallback, setOfflineFallback] = useState(true);

  // Safety
  const [safetyPreFilter, setSafetyPreFilter] = useState(true);
  const [fallDetection, setFallDetection] = useState(true);
  const [emergencyContact, setEmergencyContact] = useState("");

  // Audio
  const [ttsSpeed, setTtsSpeed] = useState("normal");
  const [spatialAudio, setSpatialAudio] = useState(true);
  const [wakeWord, setWakeWord] = useState(true);

  // Battery
  const [lowBatteryThreshold, setLowBatteryThreshold] = useState("20");
  const [cloudOffloadAuto, setCloudOffloadAuto] = useState(true);

  // Language
  const [appLanguage, setAppLanguage] = useState("ko");
  const [translationTarget, setTranslationTarget] = useState("auto");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAFBFC",
        fontFamily: "'DM Sans', 'Pretendard', -apple-system, sans-serif",
        color: "#1a1a1a",
        maxWidth: 430,
        margin: "0 auto",
        paddingBottom: 40,
      }}
    >
      {/* Header */}
      <div style={{ padding: "20px 24px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span style={{ fontSize: 13, color: "#999" }}>Back</span>
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#1B3A5C", letterSpacing: -0.5 }}>
          Settings
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>

        {/* ===== DEVICE ===== */}
        <Section title="Device">
          <Row
            label="Connected Device"
            desc="Tap to manage pairing"
            right={<div style={{ display: "flex", alignItems: "center", gap: 8 }}><Value text={deviceName} color="#3A7BBF" /><Chevron /></div>}
            onClick={() => {}}
          />
          <Row
            label="Auto-Connect"
            desc="Reconnect automatically when device is nearby"
            right={<Toggle value={autoConnect} onChange={setAutoConnect} />}
            last
          />
        </Section>

        {/* ===== CONNECTION ===== */}
        <Section title="Connection">
          <Row
            label="Bluetooth (Audio SCO)"
            desc="Voice input/output channel"
            right={<Toggle value={btEnabled} onChange={setBtEnabled} />}
          />
          <Row
            label="WiFi Direct (Data)"
            desc="Events, camera frames, large data"
            right={<Toggle value={wifiDirectEnabled} onChange={setWifiDirectEnabled} />}
          />
          <Row
            label="Event Transport"
            desc="Which channel carries gesture/activity events"
            right={
              <ChipSelect
                options={[
                  { value: "wifi", label: "WiFi Direct" },
                  { value: "bt", label: "BT" },
                ]}
                value={eventChannel}
                onChange={setEventChannel}
              />
            }
            last
          />
        </Section>

        {/* ===== AI / INFERENCE ===== */}
        <Section title="AI Engine">
          <Row
            label="Cloud LLM Provider"
            desc="For summaries, complex Ask AI, translation"
            right={
              <ChipSelect
                options={[
                  { value: "claude", label: "Claude" },
                  { value: "gpt", label: "GPT" },
                  { value: "gemini", label: "Gemini" },
                ]}
                value={llmProvider}
                onChange={setLlmProvider}
              />
            }
          />
          <Row
            label="On-Device SLM"
            desc="Local inference model"
            right={<Value text="Qwen3 1.7B" />}
          />
          <Row
            label="SLM Status"
            desc="Model loading state"
            right={
              <span style={{ fontSize: 12, color: "#2E8B57", fontWeight: 600, padding: "3px 10px", backgroundColor: "#E8F5E9", borderRadius: 10 }}>
                Loaded
              </span>
            }
          />
          <Row
            label="Offline Fallback"
            desc="Use SLM only when network is unavailable"
            right={<Toggle value={offlineFallback} onChange={setOfflineFallback} />}
            last
          />
        </Section>

        {/* ===== SAFETY ===== */}
        <Section title="Safety">
          <Row
            label="Safety Pre-Filter"
            desc="Rule-based checks before SLM (Stage 1)"
            right={<Toggle value={safetyPreFilter} onChange={setSafetyPreFilter} color="#CC3333" />}
          />
          <Row
            label="Fall Detection"
            desc="Auto-detect falls and initiate emergency protocol"
            right={<Toggle value={fallDetection} onChange={setFallDetection} color="#CC3333" />}
          />
          <Row
            label="Emergency Contact"
            desc="Called when fall detected and no response"
            right={<div style={{ display: "flex", alignItems: "center", gap: 8 }}><Value text={emergencyContact || "Not set"} color={emergencyContact ? "#555" : "#CCC"} /><Chevron /></div>}
            onClick={() => {}}
            last
          />
        </Section>

        {/* ===== AUDIO ===== */}
        <Section title="Audio & Voice">
          <Row
            label="TTS Speed"
            right={
              <ChipSelect
                options={[
                  { value: "slow", label: "Slow" },
                  { value: "normal", label: "Normal" },
                  { value: "fast", label: "Fast" },
                ]}
                value={ttsSpeed}
                onChange={setTtsSpeed}
              />
            }
          />
          <Row
            label="3D Spatial Audio"
            desc="Directional sound for navigation"
            right={<Toggle value={spatialAudio} onChange={setSpatialAudio} />}
          />
          <Row
            label="Wake Word"
            desc="Activate AIVY by voice"
            right={<Toggle value={wakeWord} onChange={setWakeWord} />}
            last
          />
        </Section>

        {/* ===== BATTERY & PERFORMANCE ===== */}
        <Section title="Battery & Performance">
          <Row
            label="Low Battery Threshold"
            desc="TTS switches to text-only below this"
            right={
              <ChipSelect
                options={[
                  { value: "10", label: "10%" },
                  { value: "20", label: "20%" },
                  { value: "30", label: "30%" },
                ]}
                value={lowBatteryThreshold}
                onChange={setLowBatteryThreshold}
              />
            }
          />
          <Row
            label="Auto Cloud Offload"
            desc="Switch to cloud when device overheats"
            right={<Toggle value={cloudOffloadAuto} onChange={setCloudOffloadAuto} />}
          />
          <Row
            label="Hysteresis Guard"
            desc="Entry ≤20% / ≥50°C — Return ≥30% / ≤47°C"
            right={<Value text="Active" color="#2E8B57" />}
            last
          />
        </Section>

        {/* ===== LANGUAGE ===== */}
        <Section title="Language">
          <Row
            label="App Language"
            right={
              <ChipSelect
                options={[
                  { value: "ko", label: "한국어" },
                  { value: "en", label: "English" },
                  { value: "ja", label: "日本語" },
                ]}
                value={appLanguage}
                onChange={setAppLanguage}
              />
            }
          />
          <Row
            label="Translation Target"
            desc="Default target language for overseas mode"
            right={
              <ChipSelect
                options={[
                  { value: "auto", label: "Auto" },
                  { value: "en", label: "EN" },
                  { value: "ja", label: "JA" },
                  { value: "zh", label: "ZH" },
                ]}
                value={translationTarget}
                onChange={setTranslationTarget}
              />
            }
            last
          />
        </Section>

        {/* ===== ABOUT ===== */}
        <Section title="About">
          <Row label="App Version" right={<Value text="1.0.0-alpha" />} />
          <Row label="Architecture" right={<Value text="v3 Final" />} />
          <Row label="SLM Size" right={<Value text="~1 GB" />} />
          <Row
            label="Debug Event Log"
            desc="Show raw WearableEvent stream on Home"
            right={<Toggle value={true} onChange={() => {}} />}
            last
          />
        </Section>

      </div>
    </div>
  );
}
