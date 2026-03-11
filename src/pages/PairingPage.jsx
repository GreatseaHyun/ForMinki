import { useState, useEffect } from "react";
import { color, font, radius } from "../tokens";

const PHASE = { SCANNING: "scanning", FOUND: "found", CONNECTING: "connecting", BT_DONE: "bt_done", WIFI_CONNECTING: "wifi_connecting", CONNECTED: "connected" };

const MOCK_DEVICES = [
  { id: "aivy-001", name: "AIVY-Pro", signal: -42, battery: 85 },
  { id: "aivy-002", name: "AIVY-Lite", signal: -68, battery: 62 },
];

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color.positive} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5" /></svg>
);

const SignalBars = ({ rssi }) => {
  const strength = rssi > -50 ? 3 : rssi > -65 ? 2 : 1;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 16 }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ width: 4, height: 4 + i * 4, borderRadius: 1.5, backgroundColor: i <= strength ? color.accent : color.border }} />
      ))}
    </div>
  );
};

const Spinner = ({ size = 40, c = color.accent }) => (
  <div style={{ width: size, height: size, border: `3px solid ${color.backgroundAlt}`, borderTop: `3px solid ${c}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
);

const StepIndicator = ({ steps, current }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, margin: "20px 0" }}>
    {steps.map((step, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 76 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: font.caption.size, fontWeight: 700,
            backgroundColor: i < current ? color.positive : i === current ? color.accent : color.border,
            color: i <= current ? "white" : color.text4, transition: "all 0.4s ease",
          }}>
            {i < current ? "✓" : i + 1}
          </div>
          <div style={{ fontSize: font.tiny.size, marginTop: 5, color: i <= current ? color.text2 : color.text4, fontWeight: i === current ? 600 : 400, textAlign: "center" }}>{step}</div>
        </div>
        {i < steps.length - 1 && (
          <div style={{ width: 32, height: 2, backgroundColor: i < current ? color.positive : color.border, marginBottom: 18, borderRadius: 1, transition: "background-color 0.4s ease" }} />
        )}
      </div>
    ))}
  </div>
);

export default function PairingPage({ onNavigate }) {
  const [phase, setPhase] = useState(PHASE.SCANNING);
  const [devices, setDevices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (phase === PHASE.SCANNING) {
      const t = setTimeout(() => { setDevices(MOCK_DEVICES); setPhase(PHASE.FOUND); }, 2500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if ([PHASE.SCANNING, PHASE.CONNECTING, PHASE.WIFI_CONNECTING].includes(phase)) {
      const t = setInterval(() => setDots((d) => (d.length >= 3 ? "" : d + ".")), 500);
      return () => clearInterval(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === PHASE.CONNECTING) { const t = setTimeout(() => setPhase(PHASE.BT_DONE), 2000); return () => clearTimeout(t); }
    if (phase === PHASE.BT_DONE) { const t = setTimeout(() => setPhase(PHASE.WIFI_CONNECTING), 800); return () => clearTimeout(t); }
    if (phase === PHASE.WIFI_CONNECTING) { const t = setTimeout(() => setPhase(PHASE.CONNECTED), 2200); return () => clearTimeout(t); }
  }, [phase]);

  const handleSelect = (device) => { setSelected(device); setPhase(PHASE.CONNECTING); };
  const handleRetry = () => { setPhase(PHASE.SCANNING); setDevices([]); setSelected(null); };

  const currentStep = phase === PHASE.SCANNING || phase === PHASE.FOUND ? 0
    : phase === PHASE.CONNECTING || phase === PHASE.BT_DONE ? 1
    : phase === PHASE.WIFI_CONNECTING ? 2 : 3;

  return (
    <div style={{ flex: 1, overflowY: "auto", backgroundColor: color.background }}>
      {/* Header */}
      <div style={{ padding: "20px 24px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <div onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color.text4} strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6" /></svg>
        </div>
        <div>
          <div style={{ fontSize: font.caption.size + 1, color: color.text3 }}>AIVY 설정</div>
          <div style={{ fontSize: font.h1.size, fontWeight: font.h1.weight, color: color.primary, letterSpacing: font.h1.letterSpacing }}>기기 페어링</div>
        </div>
      </div>

      <StepIndicator steps={["검색", "Bluetooth", "WiFi Direct", "완료"]} current={currentStep} />

      <div style={{ padding: "0 20px" }}>
        {/* SCANNING */}
        {phase === PHASE.SCANNING && (
          <div style={{ background: color.surface, borderRadius: radius.lg, padding: "48px 24px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ marginBottom: 20 }}><Spinner size={48} /></div>
            <div style={{ fontSize: font.h3.size, fontWeight: font.h3.weight, color: color.text2 }}>AIVY 기기를 찾고 있습니다{dots}</div>
            <div style={{ fontSize: font.caption.size + 1, color: color.text4, marginTop: 8 }}>기기의 전원이 켜져 있는지 확인하세요</div>
          </div>
        )}

        {/* FOUND */}
        {phase === PHASE.FOUND && (
          <div style={{ background: color.surface, borderRadius: radius.lg, padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color.accent} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <span style={{ fontSize: font.body.size, fontWeight: 600, color: color.text2 }}>{devices.length}개 기기 발견</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {devices.map((d) => (
                <div key={d.id} onClick={() => handleSelect(d)} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 16px", borderRadius: radius.md, border: `1.5px solid ${color.border}`,
                  cursor: "pointer", animation: "fadeIn 0.3s ease",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: color.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: font.caption.size + 1, fontWeight: 700 }}>Ai</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: color.text1 }}>{d.name}</div>
                      <div style={{ fontSize: font.tiny.size, color: color.text3, marginTop: 2 }}>배터리 {d.battery}%</div>
                    </div>
                  </div>
                  <SignalBars rssi={d.signal} />
                </div>
              ))}
            </div>
            <div onClick={handleRetry} style={{ textAlign: "center", marginTop: 16, fontSize: font.caption.size + 1, color: color.accent, fontWeight: 500, cursor: "pointer" }}>다시 검색</div>
          </div>
        )}

        {/* CONNECTING BT */}
        {(phase === PHASE.CONNECTING || phase === PHASE.BT_DONE) && selected && (
          <div style={{ background: color.surface, borderRadius: radius.lg, padding: "32px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: radius.lg, backgroundColor: color.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 18, fontWeight: 700, margin: "0 auto 12px" }}>Ai</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: color.text1 }}>{selected.name}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: radius.md, backgroundColor: phase === PHASE.BT_DONE ? color.positiveLight : color.accentLight, marginBottom: 12 }}>
              {phase === PHASE.BT_DONE ? <CheckIcon /> : <Spinner size={20} c={color.accent} />}
              <div>
                <div style={{ fontSize: font.body.size, fontWeight: 600, color: phase === PHASE.BT_DONE ? color.positive : color.text2 }}>Bluetooth</div>
                <div style={{ fontSize: font.tiny.size, color: color.text3 }}>{phase === PHASE.BT_DONE ? "음성 연결 완료" : `연결 중${dots}`}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: radius.md, backgroundColor: color.backgroundAlt }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: color.border }} />
              <div>
                <div style={{ fontSize: font.body.size, fontWeight: 600, color: color.text4 }}>WiFi Direct</div>
                <div style={{ fontSize: font.tiny.size, color: color.text4 }}>Bluetooth 대기 중</div>
              </div>
            </div>
          </div>
        )}

        {/* WIFI CONNECTING */}
        {phase === PHASE.WIFI_CONNECTING && selected && (
          <div style={{ background: color.surface, borderRadius: radius.lg, padding: "32px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: radius.lg, backgroundColor: color.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 18, fontWeight: 700, margin: "0 auto 12px" }}>Ai</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: color.text1 }}>{selected.name}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: radius.md, backgroundColor: color.positiveLight, marginBottom: 12 }}>
              <CheckIcon />
              <div><div style={{ fontSize: font.body.size, fontWeight: 600, color: color.positive }}>Bluetooth</div><div style={{ fontSize: font.tiny.size, color: color.text3 }}>음성 연결 완료</div></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: radius.md, backgroundColor: color.positiveLight, opacity: 0.7 }}>
              <Spinner size={20} c={color.positive} />
              <div><div style={{ fontSize: font.body.size, fontWeight: 600, color: color.text2 }}>WiFi Direct</div><div style={{ fontSize: font.tiny.size, color: color.text3 }}>데이터 채널 연결 중{dots}</div></div>
            </div>
          </div>
        )}

        {/* CONNECTED */}
        {phase === PHASE.CONNECTED && selected && (
          <div style={{ background: color.surface, borderRadius: radius.lg, padding: "36px 24px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", animation: "fadeIn 0.4s ease" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: color.positiveLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color.positive} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5" /></svg>
            </div>
            <div style={{ fontSize: font.h2.size, fontWeight: font.h2.weight, color: color.primary, marginBottom: 6 }}>연결 완료</div>
            <div style={{ fontSize: font.body.size, color: color.text3, marginBottom: 28 }}>{selected.name} 사용 준비가 되었습니다</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
              {[{ label: "Bluetooth", desc: "음성 연결 완료" }, { label: "WiFi Direct", desc: "데이터 채널 연결 완료" }].map((item) => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: 10, backgroundColor: color.positiveLight }}>
                  <div style={{ textAlign: "left" }}><div style={{ fontSize: font.caption.size + 1, fontWeight: 600, color: color.positive }}>{item.label}</div><div style={{ fontSize: font.tiny.size, color: color.text3 }}>{item.desc}</div></div>
                  <CheckIcon />
                </div>
              ))}
            </div>
            <div onClick={() => onNavigate("home")} style={{
              padding: "14px 0", borderRadius: radius.md, backgroundColor: color.primary,
              color: "white", fontSize: 15, fontWeight: 600, cursor: "pointer",
            }}>
              홈으로
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "24px 20px", textAlign: "center" }}>
        <div style={{ fontSize: font.caption.size, color: color.text4 }}>
          {phase === PHASE.SCANNING || phase === PHASE.FOUND ? "AIVY 기기를 가까이 두고 전원을 켜주세요"
            : phase === PHASE.CONNECTED ? "" : "연결이 완료될 때까지 잠시 기다려주세요"}
        </div>
      </div>
    </div>
  );
}
