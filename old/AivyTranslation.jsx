import { useState, useEffect, useRef } from "react";

// ===== States =====
const TRANS_STATE = {
  IDLE: "idle",
  LISTENING: "listening",   // 상대방 외국어 듣는 중
  SPEAKING: "speaking",     // 사용자가 말하려는 중
  SHOW_CARD: "show_card",   // 상대방에게 화면 보여주기
  LOG: "log",               // 대화 로그
};

// ===== Mock Data =====
const MOCK_CONVERSATIONS = [
  { id: 1, speaker: "them", original: "すみません、この近くに駅はありますか？", translated: "실례합니다, 이 근처에 역이 있나요?", time: "14:32" },
  { id: 2, speaker: "me", original: "네, 저쪽으로 200미터 가시면 됩니다.", translated: "はい、あちらに200メートル行けば着きます。", time: "14:32" },
  { id: 3, speaker: "them", original: "ありがとうございます。所要時間はどのくらいですか？", translated: "감사합니다. 소요 시간은 얼마나 되나요?", time: "14:33" },
  { id: 4, speaker: "me", original: "걸어서 3분 정도요.", translated: "歩いて3分くらいです。", time: "14:33" },
];

// ===== Icons =====
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const MicIcon = ({ size = 24, color = "#3A7BBF" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M5 10a7 7 0 0 0 14 0" />
    <path d="M12 18v4" />
  </svg>
);

const PlayIcon = ({ size = 20, color = "#3A7BBF" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const SwapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round">
    <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" />
  </svg>
);

const ShowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <path d="M12 18h.01" />
  </svg>
);

const ListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);

// ===== Pulse animation for listening =====
function PulseRing({ active, color = "#3A7BBF" }) {
  if (!active) return null;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 80 + i * 40,
            height: 80 + i * 40,
            borderRadius: "50%",
            border: `2px solid ${color}`,
            opacity: 0.15 - i * 0.04,
            animation: `pulseRing 2s ease-out ${i * 0.4}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ===== Language Pill =====
function LangPill({ code, name, active }) {
  return (
    <div
      style={{
        padding: "6px 16px",
        borderRadius: 20,
        backgroundColor: active ? "#1B3A5C" : "#F0F0F0",
        color: active ? "white" : "#888",
        fontSize: 13,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span style={{ fontSize: 11, opacity: 0.7 }}>{code}</span>
      {name}
    </div>
  );
}

// ===== Conversation Bubble =====
function ChatBubble({ item }) {
  const isMe = item.speaker === "me";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start", marginBottom: 14 }}>
      <div style={{ fontSize: 10, color: "#CCC", marginBottom: 3, padding: "0 4px" }}>
        {isMe ? "You" : "Them"} · {item.time}
      </div>
      <div
        style={{
          maxWidth: "85%",
          padding: "12px 16px",
          borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          backgroundColor: isMe ? "#1B3A5C" : "#F5F7FA",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 500, color: isMe ? "white" : "#333", lineHeight: 1.5 }}>
          {isMe ? item.translated : item.original}
        </div>
        <div style={{ fontSize: 12, color: isMe ? "rgba(255,255,255,0.5)" : "#AAA", marginTop: 6, lineHeight: 1.4 }}>
          {isMe ? item.original : item.translated}
        </div>
      </div>
    </div>
  );
}

// ===== Main =====
export default function AivyTranslation() {
  const [state, setState] = useState(TRANS_STATE.IDLE);
  const [sourceLang] = useState({ code: "KO", name: "Korean" });
  const [targetLang] = useState({ code: "JA", name: "Japanese" });
  const [currentText, setCurrentText] = useState("");
  const [currentTranslation, setCurrentTranslation] = useState("");
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [showCardData, setShowCardData] = useState(null);

  // Simulate listening
  useEffect(() => {
    if (state === TRANS_STATE.LISTENING) {
      const t1 = setTimeout(() => setCurrentText("すみません..."), 800);
      const t2 = setTimeout(() => setCurrentText("すみません、この近くに..."), 1500);
      const t3 = setTimeout(() => {
        setCurrentText("すみません、この近くに駅はありますか？");
        setCurrentTranslation("실례합니다, 이 근처에 역이 있나요?");
      }, 2500);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [state]);

  // Simulate speaking
  useEffect(() => {
    if (state === TRANS_STATE.SPEAKING) {
      const t1 = setTimeout(() => setCurrentText("네, 저쪽으로..."), 800);
      const t2 = setTimeout(() => {
        setCurrentText("네, 저쪽으로 200미터 가시면 됩니다.");
        setCurrentTranslation("はい、あちらに200メートル行けば着きます。");
      }, 1800);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [state]);

  const resetCurrent = () => {
    setCurrentText("");
    setCurrentTranslation("");
  };

  const handleShowCard = () => {
    setShowCardData({
      translation: currentTranslation || "はい、あちらに200メートル行けば着きます。",
      original: currentText || "네, 저쪽으로 200미터 가시면 됩니다.",
    });
    setState(TRANS_STATE.SHOW_CARD);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FAFBFC",
        fontFamily: "'DM Sans', 'Pretendard', -apple-system, sans-serif",
        color: "#1a1a1a",
        maxWidth: 430,
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes pulseRing { 0% { transform:scale(0.8); opacity:0.2; } 100% { transform:scale(1.3); opacity:0; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
      `}</style>

      {/* ===== SHOW CARD MODE (full screen, rotated for counterpart) ===== */}
      {state === TRANS_STATE.SHOW_CARD && showCardData && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 30,
            backgroundColor: "#FFFFFF",
          }}
        >
          {/* Main translation (large) */}
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#1B3A5C",
              textAlign: "center",
              lineHeight: 1.4,
              marginBottom: 24,
              padding: "0 10px",
            }}
          >
            {showCardData.translation}
          </div>

          {/* Divider */}
          <div style={{ width: 60, height: 2, backgroundColor: "#E0E0E0", marginBottom: 24 }} />

          {/* Original (small) */}
          <div
            style={{
              fontSize: 16,
              color: "#AAA",
              textAlign: "center",
              lineHeight: 1.4,
              marginBottom: 32,
            }}
          >
            {showCardData.original}
          </div>

          {/* TTS Play button */}
          <div
            onClick={() => {}}
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: "#F5F7FA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              marginBottom: 40,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <PlayIcon size={24} color="#1B3A5C" />
          </div>

          {/* Close button */}
          <div
            onClick={() => { setState(TRANS_STATE.IDLE); resetCurrent(); }}
            style={{
              padding: "12px 40px",
              borderRadius: 12,
              border: "1.5px solid #EEE",
              fontSize: 14,
              color: "#888",
              cursor: "pointer",
            }}
          >
            Close
          </div>
        </div>
      )}

      {/* ===== LOG MODE ===== */}
      {state === TRANS_STATE.LOG && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 10 }}>
            <div onClick={() => setState(TRANS_STATE.IDLE)} style={{ cursor: "pointer" }}><BackIcon /></div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1B3A5C" }}>Conversation Log</div>
          </div>

          {/* Language pair */}
          <div style={{ padding: "0 20px 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <LangPill code="KO" name="Korean" active={false} />
            <SwapIcon />
            <LangPill code="JA" name="Japanese" active={false} />
            <span style={{ marginLeft: "auto", fontSize: 12, color: "#CCC" }}>{conversations.length} turns</span>
          </div>

          {/* Chat log */}
          <div style={{ flex: 1, overflow: "auto", padding: "10px 20px" }}>
            {conversations.map((item) => (
              <ChatBubble key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* ===== MAIN MODE (Idle / Listening / Speaking) ===== */}
      {(state === TRANS_STATE.IDLE || state === TRANS_STATE.LISTENING || state === TRANS_STATE.SPEAKING) && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

          {/* Header */}
          <div style={{ padding: "16px 20px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div onClick={() => {}} style={{ cursor: "pointer" }}><BackIcon /></div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#1B3A5C" }}>Translation</div>
            </div>
            <div
              onClick={() => setState(TRANS_STATE.LOG)}
              style={{ cursor: "pointer", padding: "6px 12px", borderRadius: 8, backgroundColor: "#F5F5F5", display: "flex", alignItems: "center", gap: 6, color: "#888" }}
            >
              <ListIcon />
              <span style={{ fontSize: 12, fontWeight: 500 }}>Log</span>
            </div>
          </div>

          {/* Language selector */}
          <div style={{ padding: "8px 20px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <LangPill code="KO" name="Korean" active={state === TRANS_STATE.SPEAKING} />
            <div style={{ cursor: "pointer" }}><SwapIcon /></div>
            <LangPill code="JA" name="Japanese" active={state === TRANS_STATE.LISTENING} />
          </div>

          {/* Center area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 30px", position: "relative" }}>

            {/* Idle state */}
            {state === TRANS_STATE.IDLE && (
              <div style={{ textAlign: "center", animation: "fadeUp 0.3s ease" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <MicIcon size={32} color="#CCC" />
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#BBB" }}>
                  Ready to translate
                </div>
                <div style={{ fontSize: 13, color: "#DDD", marginTop: 6 }}>
                  Tap a button below or speak to your AIVY device
                </div>
              </div>
            )}

            {/* Listening state */}
            {state === TRANS_STATE.LISTENING && (
              <div style={{ textAlign: "center", animation: "fadeUp 0.3s ease", position: "relative" }}>
                <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 24px" }}>
                  <PulseRing active={true} color="#E67E22" />
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      backgroundColor: "#FFF3E0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MicIcon size={28} color="#E67E22" />
                  </div>
                </div>

                <div style={{ fontSize: 12, fontWeight: 600, color: "#E67E22", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 10 }}>
                  Listening · Japanese
                </div>

                {currentText && (
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#333", lineHeight: 1.5, marginBottom: 8 }}>
                    {currentText}
                    {!currentTranslation && <span style={{ animation: "blink 1s infinite" }}>|</span>}
                  </div>
                )}
                {currentTranslation && (
                  <div style={{ fontSize: 15, color: "#3A7BBF", lineHeight: 1.4, fontWeight: 500 }}>
                    → {currentTranslation}
                  </div>
                )}
              </div>
            )}

            {/* Speaking state */}
            {state === TRANS_STATE.SPEAKING && (
              <div style={{ textAlign: "center", animation: "fadeUp 0.3s ease", position: "relative" }}>
                <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 24px" }}>
                  <PulseRing active={true} color="#3A7BBF" />
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      backgroundColor: "#E3F2FD",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MicIcon size={28} color="#3A7BBF" />
                  </div>
                </div>

                <div style={{ fontSize: 12, fontWeight: 600, color: "#3A7BBF", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 10 }}>
                  Your turn · Korean
                </div>

                {currentText && (
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#333", lineHeight: 1.5, marginBottom: 8 }}>
                    {currentText}
                    {!currentTranslation && <span style={{ animation: "blink 1s infinite" }}>|</span>}
                  </div>
                )}
                {currentTranslation && (
                  <div style={{ fontSize: 15, color: "#E67E22", lineHeight: 1.4, fontWeight: 500 }}>
                    → {currentTranslation}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom controls */}
          <div style={{ padding: "16px 20px 28px" }}>

            {/* Show card button (when translation is ready) */}
            {currentTranslation && (state === TRANS_STATE.LISTENING || state === TRANS_STATE.SPEAKING) && (
              <div
                onClick={handleShowCard}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "12px 0",
                  borderRadius: 12,
                  backgroundColor: "#F5F7FA",
                  marginBottom: 12,
                  cursor: "pointer",
                  color: "#555",
                  fontSize: 13,
                  fontWeight: 500,
                  animation: "fadeUp 0.3s ease",
                }}
              >
                <ShowIcon />
                Show to counterpart
              </div>
            )}

            {/* Main action buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <div
                onClick={() => {
                  resetCurrent();
                  setState(state === TRANS_STATE.LISTENING ? TRANS_STATE.IDLE : TRANS_STATE.LISTENING);
                }}
                style={{
                  flex: 1,
                  padding: "16px 0",
                  borderRadius: 14,
                  backgroundColor: state === TRANS_STATE.LISTENING ? "#E67E22" : "#FFF3E0",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: state === TRANS_STATE.LISTENING ? "white" : "#E67E22" }}>
                  {state === TRANS_STATE.LISTENING ? "Listening..." : "Listen"}
                </div>
                <div style={{ fontSize: 10, color: state === TRANS_STATE.LISTENING ? "rgba(255,255,255,0.7)" : "#E6A756", marginTop: 2 }}>
                  Their language
                </div>
              </div>

              <div
                onClick={() => {
                  resetCurrent();
                  setState(state === TRANS_STATE.SPEAKING ? TRANS_STATE.IDLE : TRANS_STATE.SPEAKING);
                }}
                style={{
                  flex: 1,
                  padding: "16px 0",
                  borderRadius: 14,
                  backgroundColor: state === TRANS_STATE.SPEAKING ? "#3A7BBF" : "#E3F2FD",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: state === TRANS_STATE.SPEAKING ? "white" : "#3A7BBF" }}>
                  {state === TRANS_STATE.SPEAKING ? "Translating..." : "Speak"}
                </div>
                <div style={{ fontSize: 10, color: state === TRANS_STATE.SPEAKING ? "rgba(255,255,255,0.7)" : "#7BAFD6", marginTop: 2 }}>
                  Your language
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
