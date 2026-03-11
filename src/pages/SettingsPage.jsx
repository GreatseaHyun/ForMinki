import { useState } from "react";

function Toggle({ value, onChange, color = "#3A7BBF" }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      width: 48, height: 28, borderRadius: 14, backgroundColor: value ? color : "#DDD",
      padding: 3, cursor: "pointer", transition: "background-color 0.2s ease", flexShrink: 0,
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: "50%", backgroundColor: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)", transform: value ? "translateX(20px)" : "translateX(0)",
        transition: "transform 0.2s ease",
      }} />
    </div>
  );
}

function ChipSelect({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map((opt) => (
        <div key={opt.value} onClick={() => onChange(opt.value)} style={{
          padding: "6px 14px", borderRadius: 20, fontSize: 12,
          fontWeight: value === opt.value ? 600 : 400,
          backgroundColor: value === opt.value ? "#1B3A5C" : "#F0F0F0",
          color: value === opt.value ? "white" : "#777", cursor: "pointer", transition: "all 0.15s ease",
        }}>{opt.label}</div>
      ))}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#999", letterSpacing: 0.8, textTransform: "uppercase", padding: "0 4px", marginBottom: 8 }}>{title}</div>
      <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>{children}</div>
    </div>
  );
}

function Row({ label, desc, right, last = false, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px 20px", borderBottom: last ? "none" : "1px solid #F5F5F5",
      cursor: onClick ? "pointer" : "default",
    }}>
      <div style={{ flex: 1, marginRight: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "#333" }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: "#AAA", marginTop: 2 }}>{desc}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{right}</div>
    </div>
  );
}

function Value({ text, color = "#555" }) {
  return <span style={{ fontSize: 13, color, fontWeight: 500 }}>{text}</span>;
}

function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CCC" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6" /></svg>
  );
}

export default function SettingsPage({ onNavigate }) {
  const [autoConnect, setAutoConnect] = useState(true);
  const [btEnabled, setBtEnabled] = useState(true);
  const [wifiDirectEnabled, setWifiDirectEnabled] = useState(true);
  const [eventChannel, setEventChannel] = useState("wifi");
  const [llmProvider, setLlmProvider] = useState("claude");
  const [offlineFallback, setOfflineFallback] = useState(true);
  const [safetyPreFilter, setSafetyPreFilter] = useState(true);
  const [fallDetection, setFallDetection] = useState(true);
  const [ttsSpeed, setTtsSpeed] = useState("normal");
  const [spatialAudio, setSpatialAudio] = useState(true);
  const [wakeWord, setWakeWord] = useState(true);
  const [lowBatteryThreshold, setLowBatteryThreshold] = useState("20");
  const [cloudOffloadAuto, setCloudOffloadAuto] = useState(true);
  const [appLanguage, setAppLanguage] = useState("ko");
  const [translationTarget, setTranslationTarget] = useState("auto");

  return (
    <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#F5F7FA" }}>
      {/* Header */}
      <div style={{ padding: "20px 24px 14px" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#1B3A5C", letterSpacing: -0.5 }}>Settings</div>
      </div>

      <div style={{ padding: "0 20px", paddingBottom: 20 }}>
        {/* DEVICE */}
        <Section title="Device">
          <Row label="Connected Device" desc="Tap to manage pairing"
            right={<div style={{ display: "flex", alignItems: "center", gap: 8 }}><Value text="AIVY-Pro" color="#3A7BBF" /><Chevron /></div>}
            onClick={() => onNavigate("pairing")} />
          <Row label="Auto-Connect" desc="Reconnect when device is nearby"
            right={<Toggle value={autoConnect} onChange={setAutoConnect} />} last />
        </Section>

        {/* CONNECTION */}
        <Section title="Connection">
          <Row label="Bluetooth (Audio SCO)" desc="Voice input/output channel"
            right={<Toggle value={btEnabled} onChange={setBtEnabled} />} />
          <Row label="WiFi Direct (Data)" desc="Events, camera, large data"
            right={<Toggle value={wifiDirectEnabled} onChange={setWifiDirectEnabled} />} />
          <Row label="Event Transport" desc="Gesture/activity events channel"
            right={<ChipSelect options={[{ value: "wifi", label: "WiFi Direct" }, { value: "bt", label: "BT" }]} value={eventChannel} onChange={setEventChannel} />} last />
        </Section>

        {/* AI ENGINE */}
        <Section title="AI Engine">
          <Row label="Cloud LLM Provider" desc="Summaries, Ask AI, translation"
            right={<ChipSelect options={[{ value: "claude", label: "Claude" }, { value: "gpt", label: "GPT" }, { value: "gemini", label: "Gemini" }]} value={llmProvider} onChange={setLlmProvider} />} />
          <Row label="On-Device SLM" desc="Local inference model" right={<Value text="Qwen3 1.7B" />} />
          <Row label="SLM Status" right={
            <span style={{ fontSize: 12, color: "#2E8B57", fontWeight: 600, padding: "3px 10px", backgroundColor: "#E8F5E9", borderRadius: 10 }}>Loaded</span>
          } />
          <Row label="Offline Fallback" desc="Use SLM when network unavailable"
            right={<Toggle value={offlineFallback} onChange={setOfflineFallback} />} last />
        </Section>

        {/* SAFETY */}
        <Section title="Safety">
          <Row label="Safety Pre-Filter" desc="Rule-based checks before SLM"
            right={<Toggle value={safetyPreFilter} onChange={setSafetyPreFilter} color="#CC3333" />} />
          <Row label="Fall Detection" desc="Auto-detect and initiate emergency"
            right={<Toggle value={fallDetection} onChange={setFallDetection} color="#CC3333" />} />
          <Row label="Emergency Contact" desc="Called when fall detected"
            right={<div style={{ display: "flex", alignItems: "center", gap: 8 }}><Value text="Not set" color="#CCC" /><Chevron /></div>} last />
        </Section>

        {/* AUDIO */}
        <Section title="Audio & Voice">
          <Row label="TTS Speed"
            right={<ChipSelect options={[{ value: "slow", label: "Slow" }, { value: "normal", label: "Normal" }, { value: "fast", label: "Fast" }]} value={ttsSpeed} onChange={setTtsSpeed} />} />
          <Row label="3D Spatial Audio" desc="Directional sound for navigation"
            right={<Toggle value={spatialAudio} onChange={setSpatialAudio} />} />
          <Row label="Wake Word" desc="Activate AIVY by voice"
            right={<Toggle value={wakeWord} onChange={setWakeWord} />} last />
        </Section>

        {/* BATTERY */}
        <Section title="Battery & Performance">
          <Row label="Low Battery Threshold" desc="Switch to text-only below this"
            right={<ChipSelect options={[{ value: "10", label: "10%" }, { value: "20", label: "20%" }, { value: "30", label: "30%" }]} value={lowBatteryThreshold} onChange={setLowBatteryThreshold} />} />
          <Row label="Auto Cloud Offload" desc="Switch to cloud on overheat"
            right={<Toggle value={cloudOffloadAuto} onChange={setCloudOffloadAuto} />} />
          <Row label="Hysteresis Guard" desc="Entry ≤20% / ≥50°C — Return ≥30% / ≤47°C"
            right={<Value text="Active" color="#2E8B57" />} last />
        </Section>

        {/* LANGUAGE */}
        <Section title="Language">
          <Row label="App Language"
            right={<ChipSelect options={[{ value: "ko", label: "한국어" }, { value: "en", label: "English" }, { value: "ja", label: "日本語" }]} value={appLanguage} onChange={setAppLanguage} />} />
          <Row label="Translation Target" desc="Default target for overseas"
            right={<ChipSelect options={[{ value: "auto", label: "Auto" }, { value: "en", label: "EN" }, { value: "ja", label: "JA" }, { value: "zh", label: "ZH" }]} value={translationTarget} onChange={setTranslationTarget} />} last />
        </Section>

        {/* ABOUT */}
        <Section title="About">
          <Row label="App Version" right={<Value text="1.0.0-alpha" />} />
          <Row label="Architecture" right={<Value text="v3 Final" />} />
          <Row label="SLM Size" right={<Value text="~1 GB" />} last />
        </Section>
      </div>
    </div>
  );
}
