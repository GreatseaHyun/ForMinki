import { useState } from "react";
import { color, font, radius } from "../tokens";

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      width: 48, height: 28, borderRadius: 14, backgroundColor: value ? color.accent : color.border,
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
          padding: "6px 14px", borderRadius: radius.xl, fontSize: font.caption.size,
          fontWeight: value === opt.value ? 600 : 400,
          backgroundColor: value === opt.value ? color.primary : color.backgroundAlt,
          color: value === opt.value ? "white" : color.text3, cursor: "pointer", transition: "all 0.15s ease",
        }}>{opt.label}</div>
      ))}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: font.label.size, fontWeight: font.label.weight, color: color.text3, letterSpacing: font.label.letterSpacing, textTransform: "uppercase", padding: "0 4px", marginBottom: 8 }}>{title}</div>
      <div style={{ background: color.surface, borderRadius: radius.lg, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>{children}</div>
    </div>
  );
}

function Row({ label, desc, right, last = false, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px 20px", borderBottom: last ? "none" : `1px solid ${color.background}`,
      cursor: onClick ? "pointer" : "default",
    }}>
      <div style={{ flex: 1, marginRight: 12 }}>
        <div style={{ fontSize: font.body.size, fontWeight: 500, color: color.text1 }}>{label}</div>
        {desc && <div style={{ fontSize: font.tiny.size, color: color.text3, marginTop: 2 }}>{desc}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{right}</div>
    </div>
  );
}

function Value({ text, c = color.text2 }) {
  return <span style={{ fontSize: 13, color: c, fontWeight: 500 }}>{text}</span>;
}

function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color.text4} strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6" /></svg>
  );
}

export default function SettingsPage({ onNavigate, devMode, setDevMode }) {
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
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div style={{ flex: 1, overflowY: "auto", backgroundColor: color.background }}>
      {/* Header */}
      <div style={{ padding: "20px 24px 14px" }}>
        <div style={{ fontSize: font.h1.size, fontWeight: font.h1.weight, color: color.primary, letterSpacing: font.h1.letterSpacing }}>설정</div>
      </div>

      <div style={{ padding: "0 20px", paddingBottom: 20 }}>
        {/* ── BASIC SETTINGS ── */}

        {/* 기기 */}
        <Section title="기기">
          <Row label="연결된 기기" desc="탭하여 페어링 관리"
            right={<div style={{ display: "flex", alignItems: "center", gap: 8 }}><Value text="AIVY-Pro" c={color.accent} /><Chevron /></div>}
            onClick={() => onNavigate("pairing")} />
          <Row label="자동 연결" desc="기기가 근처에 있을 때 자동 재연결"
            right={<Toggle value={autoConnect} onChange={setAutoConnect} />} last />
        </Section>

        {/* 오디오 */}
        <Section title="오디오">
          <Row label="음성 속도"
            right={<ChipSelect options={[{ value: "slow", label: "느리게" }, { value: "normal", label: "보통" }, { value: "fast", label: "빠르게" }]} value={ttsSpeed} onChange={setTtsSpeed} />} />
          <Row label="3D 공간 오디오" desc="길안내를 위한 방향별 사운드"
            right={<Toggle value={spatialAudio} onChange={setSpatialAudio} />} />
          <Row label="호출어" desc="음성으로 AIVY 호출"
            right={<Toggle value={wakeWord} onChange={setWakeWord} />} last />
        </Section>

        {/* 언어 */}
        <Section title="언어">
          <Row label="앱 언어"
            right={<ChipSelect options={[{ value: "ko", label: "한국어" }, { value: "en", label: "English" }, { value: "ja", label: "日本語" }]} value={appLanguage} onChange={setAppLanguage} />} />
          <Row label="번역 대상 언어" desc="해외에서 기본 번역 언어"
            right={<ChipSelect options={[{ value: "auto", label: "자동" }, { value: "en", label: "EN" }, { value: "ja", label: "JA" }, { value: "zh", label: "ZH" }]} value={translationTarget} onChange={setTranslationTarget} />} last />
        </Section>

        {/* 안전 */}
        <Section title="안전">
          <Row label="안전 필터" desc="유해 콘텐츠 사전 차단"
            right={<Toggle value={safetyPreFilter} onChange={setSafetyPreFilter} />} />
          <Row label="낙상 감지" desc="자동 감지 및 긴급 호출"
            right={<Toggle value={fallDetection} onChange={setFallDetection} />} />
          <Row label="긴급 연락처" desc="낙상 감지 시 연락"
            right={<div style={{ display: "flex", alignItems: "center", gap: 8 }}><Value text="미설정" c={color.text4} /><Chevron /></div>} last />
        </Section>

        {/* ── ADVANCED TOGGLE ── */}
        <div onClick={() => setShowAdvanced(!showAdvanced)} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "14px 0", marginBottom: 18, cursor: "pointer",
        }}>
          <span style={{ fontSize: font.caption.size, fontWeight: 600, color: color.text3 }}>
            {showAdvanced ? "고급 설정 숨기기" : "고급 설정 보기"}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color.text3} strokeWidth="2" strokeLinecap="round"
            style={{ transform: showAdvanced ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>

        {/* ── ADVANCED SETTINGS ── */}
        {showAdvanced && (
          <>
            {/* 연결 상세 */}
            <Section title="연결 상세">
              <Row label="Bluetooth" desc="음성 입출력 채널"
                right={<Toggle value={btEnabled} onChange={setBtEnabled} />} />
              <Row label="WiFi Direct" desc="이벤트, 카메라, 대용량 데이터"
                right={<Toggle value={wifiDirectEnabled} onChange={setWifiDirectEnabled} />} />
              <Row label="이벤트 전송 방식" desc="제스처/활동 이벤트 채널"
                right={<ChipSelect options={[{ value: "wifi", label: "WiFi Direct" }, { value: "bt", label: "BT" }]} value={eventChannel} onChange={setEventChannel} />} last />
            </Section>

            {/* AI 엔진 */}
            <Section title="AI 엔진">
              <Row label="클라우드 LLM" desc="요약, AI 질문, 번역"
                right={<ChipSelect options={[{ value: "claude", label: "Claude" }, { value: "gpt", label: "GPT" }, { value: "gemini", label: "Gemini" }]} value={llmProvider} onChange={setLlmProvider} />} />
              <Row label="온디바이스 SLM" desc="로컬 추론 모델" right={<Value text="Qwen3 1.7B" />} />
              <Row label="SLM 상태" right={
                <span style={{ fontSize: font.caption.size, color: color.positive, fontWeight: 600, padding: "3px 10px", backgroundColor: color.positiveLight, borderRadius: 10 }}>로드됨</span>
              } />
              <Row label="오프라인 폴백" desc="네트워크 불가 시 SLM 사용"
                right={<Toggle value={offlineFallback} onChange={setOfflineFallback} />} last />
            </Section>

            {/* 배터리 & 성능 */}
            <Section title="배터리 & 성능">
              <Row label="저전력 임계값" desc="이 이하로 내려가면 텍스트 전용"
                right={<ChipSelect options={[{ value: "10", label: "10%" }, { value: "20", label: "20%" }, { value: "30", label: "30%" }]} value={lowBatteryThreshold} onChange={setLowBatteryThreshold} />} />
              <Row label="자동 클라우드 전환" desc="과열 시 클라우드로 전환"
                right={<Toggle value={cloudOffloadAuto} onChange={setCloudOffloadAuto} />} />
              <Row label="이력현상 보호" desc="진입 ≤20% / ≥50°C — 복귀 ≥30% / ≤47°C"
                right={<Value text="활성" c={color.positive} />} last />
            </Section>

            {/* 정보 */}
            <Section title="정보">
              <Row label="앱 버전" right={<Value text="1.0.0-alpha" />} />
              <Row label="아키텍처" right={<Value text="v3 Final" />} />
              <Row label="SLM 크기" right={<Value text="~1 GB" />} last />
            </Section>

            {/* 개발자 */}
            <Section title="개발자">
              <Row label="개발자 모드" desc="홈 화면에 이벤트 로그 표시"
                right={<Toggle value={devMode} onChange={setDevMode} />} last />
            </Section>
          </>
        )}
      </div>
    </div>
  );
}
