import { useState, useEffect } from "react";

const PHASE = { SCANNING: "scanning", FOUND: "found", CONNECTING: "connecting", BT_DONE: "bt_done", WIFI_CONNECTING: "wifi_connecting", CONNECTED: "connected" };

const MOCK_DEVICES = [
  { id: "aivy-001", name: "AIVY-Pro", signal: -42, battery: 85 },
  { id: "aivy-002", name: "AIVY-Lite", signal: -68, battery: 62 },
];

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2E8B57" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5" /></svg>
);

const SignalBars = ({ rssi }) => {
  const strength = rssi > -50 ? 3 : rssi > -65 ? 2 : 1;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 16 }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ width: 4, height: 4 + i * 4, borderRadius: 1.5, backgroundColor: i <= strength ? "#3A7BBF" : "#E0E0E0" }} />
      ))}
    </div>
  );
};

const Spinner = ({ size = 40, color = "#3A7BBF" }) => (
  <div style={{ width: size, height: size, border: "3px solid #F0F0F0", borderTop: `3px solid ${color}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
);

const StepIndicator = ({ steps, current }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, margin: "20px 0" }}>
    {steps.map((step, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 76 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700,
            backgroundColor: i < current ? "#2E8B57" : i === current ? "#3A7BBF" : "#E8E8E8",
            color: i <= current ? "white" : "#AAA", transition: "all 0.4s ease",
          }}>
            {i < current ? "✓" : i + 1}
          </div>
          <div style={{ fontSize: 10, marginTop: 5, color: i <= current ? "#555" : "#CCC", fontWeight: i === current ? 600 : 400, textAlign: "center" }}>{step}</div>
        </div>
        {i < steps.length - 1 && (
          <div style={{ width: 32, height: 2, backgroundColor: i < current ? "#2E8B57" : "#E8E8E8", marginBottom: 18, borderRadius: 1, transition: "background-color 0.4s ease" }} />
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
    <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#F5F7FA" }}>
      {/* Header */}
      <div style={{ padding: "20px 24px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <div onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6" /></svg>
        </div>
        <div>
          <div style={{ fontSize: 13, color: "#999" }}>AIVY Setup</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#1B3A5C", letterSpacing: -0.5 }}>Pair Your Device</div>
        </div>
      </div>

      <StepIndicator steps={["Scan", "Bluetooth", "WiFi Direct", "Done"]} current={currentStep} />

      <div style={{ padding: "0 20px" }}>
        {/* SCANNING */}
        {phase === PHASE.SCANNING && (
          <div style={{ background: "white", borderRadius: 16, padding: "48px 24px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ marginBottom: 20 }}><Spinner size={48} /></div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#555" }}>Scanning for AIVY devices{dots}</div>
            <div style={{ fontSize: 13, color: "#BBB", marginTop: 8 }}>Make sure your device is powered on</div>
          </div>
        )}

        {/* FOUND */}
        {phase === PHASE.FOUND && (
          <div style={{ background: "white", borderRadius: 16, padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3A7BBF" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#555" }}>{devices.length} device{devices.length > 1 ? "s" : ""} found</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {devices.map((d) => (
                <div key={d.id} onClick={() => handleSelect(d)} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 16px", borderRadius: 12, border: "1.5px solid #EEE",
                  cursor: "pointer", animation: "fadeIn 0.3s ease",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#1B3A5C", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 700 }}>Ai</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{d.name}</div>
                      <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>Battery {d.battery}% · Signal {d.signal} dBm</div>
                    </div>
                  </div>
                  <SignalBars rssi={d.signal} />
                </div>
              ))}
            </div>
            <div onClick={handleRetry} style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#3A7BBF", fontWeight: 500, cursor: "pointer" }}>Scan again</div>
          </div>
        )}

        {/* CONNECTING BT */}
        {(phase === PHASE.CONNECTING || phase === PHASE.BT_DONE) && selected && (
          <div style={{ background: "white", borderRadius: 16, padding: "32px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "#1B3A5C", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 18, fontWeight: 700, margin: "0 auto 12px" }}>Ai</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{selected.name}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 12, backgroundColor: phase === PHASE.BT_DONE ? "#F0FFF4" : "#F8FBFF", marginBottom: 12 }}>
              {phase === PHASE.BT_DONE ? <CheckIcon /> : <Spinner size={20} color="#3A7BBF" />}
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: phase === PHASE.BT_DONE ? "#2E8B57" : "#555" }}>Bluetooth (Audio SCO)</div>
                <div style={{ fontSize: 11, color: "#999" }}>{phase === PHASE.BT_DONE ? "Connected — Audio channel ready" : `Connecting${dots}`}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 12, backgroundColor: "#FAFAFA" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: "#E8E8E8" }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#CCC" }}>WiFi Direct (Data)</div>
                <div style={{ fontSize: 11, color: "#DDD" }}>Waiting for Bluetooth</div>
              </div>
            </div>
          </div>
        )}

        {/* WIFI CONNECTING */}
        {phase === PHASE.WIFI_CONNECTING && selected && (
          <div style={{ background: "white", borderRadius: 16, padding: "32px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "#1B3A5C", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 18, fontWeight: 700, margin: "0 auto 12px" }}>Ai</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{selected.name}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 12, backgroundColor: "#F0FFF4", marginBottom: 12 }}>
              <CheckIcon />
              <div><div style={{ fontSize: 14, fontWeight: 600, color: "#2E8B57" }}>Bluetooth (Audio SCO)</div><div style={{ fontSize: 11, color: "#999" }}>Connected — Audio channel ready</div></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 12, backgroundColor: "#F0FFF4", opacity: 0.7 }}>
              <Spinner size={20} color="#2E8B57" />
              <div><div style={{ fontSize: 14, fontWeight: 600, color: "#555" }}>WiFi Direct (Data)</div><div style={{ fontSize: 11, color: "#999" }}>Establishing data channel{dots}</div></div>
            </div>
          </div>
        )}

        {/* CONNECTED */}
        {phase === PHASE.CONNECTED && selected && (
          <div style={{ background: "white", borderRadius: 16, padding: "36px 24px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", animation: "fadeIn 0.4s ease" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "#E8F5E9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2E8B57" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5" /></svg>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1B3A5C", marginBottom: 6 }}>All Connected</div>
            <div style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>{selected.name} is ready to use</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
              {[{ label: "Bluetooth", desc: "Audio SCO — Voice ready" }, { label: "WiFi Direct", desc: "Data channel — Events & Camera ready" }].map((item) => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: 10, backgroundColor: "#F8FFF9" }}>
                  <div style={{ textAlign: "left" }}><div style={{ fontSize: 13, fontWeight: 600, color: "#2E8B57" }}>{item.label}</div><div style={{ fontSize: 11, color: "#999" }}>{item.desc}</div></div>
                  <CheckIcon />
                </div>
              ))}
            </div>
            <div onClick={() => onNavigate("home")} style={{
              padding: "14px 0", borderRadius: 12, backgroundColor: "#1B3A5C",
              color: "white", fontSize: 15, fontWeight: 600, cursor: "pointer",
            }}>
              Go to Home
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "24px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 12, color: "#CCC" }}>
          {phase === PHASE.SCANNING || phase === PHASE.FOUND ? "Place your AIVY device nearby and ensure it is powered on"
            : phase === PHASE.CONNECTED ? "" : "Please wait while connections are established"}
        </div>
      </div>
    </div>
  );
}
