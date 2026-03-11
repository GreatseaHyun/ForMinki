import { useState, useEffect } from "react";
import { color, font, radius } from "../tokens";

const TRANS_STATE = { IDLE: "idle", LISTENING: "listening", SPEAKING: "speaking", SHOW_CARD: "show_card", LOG: "log" };

const MOCK_CONVERSATIONS = [
  { id: 1, speaker: "them", original: "すみません、この近くに駅はありますか？", translated: "실례합니다, 이 근처에 역이 있나요?", time: "14:32" },
  { id: 2, speaker: "me", original: "네, 저쪽으로 200미터 가시면 됩니다.", translated: "はい、あちらに200メートル行けば着きます。", time: "14:32" },
  { id: 3, speaker: "them", original: "ありがとうございます。所要時間はどのくらいですか？", translated: "감사합니다. 소요 시간은 얼마나 되나요?", time: "14:33" },
  { id: 4, speaker: "me", original: "걸어서 3분 정도요.", translated: "歩いて3分くらいです。", time: "14:33" },
];

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color.text4} strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6" /></svg>
);
const MicIcon = ({ size = 24, c = color.accent }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
    <rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0" /><path d="M12 18v4" />
  </svg>
);
const PlayIcon = ({ size = 20, c = color.accent }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={c} stroke="none"><path d="M8 5v14l11-7z" /></svg>
);
const SwapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color.text4} strokeWidth="2" strokeLinecap="round">
    <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" />
  </svg>
);
const ShowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" />
  </svg>
);
const ListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);

function PulseRing({ active, ringColor = color.accent }) {
  if (!active) return null;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          position: "absolute", width: 80 + i * 40, height: 80 + i * 40,
          borderRadius: "50%", border: `2px solid ${ringColor}`, opacity: 0.15 - i * 0.04,
          animation: `pulseRing 2s ease-out ${i * 0.4}s infinite`,
        }} />
      ))}
    </div>
  );
}

function LangPill({ code, name, active }) {
  return (
    <div style={{
      padding: "6px 16px", borderRadius: radius.xl,
      backgroundColor: active ? color.primary : color.backgroundAlt,
      color: active ? "white" : color.text3, fontSize: font.caption.size + 1, fontWeight: 600,
      display: "flex", alignItems: "center", gap: 6,
    }}>
      <span style={{ fontSize: font.tiny.size, opacity: 0.7 }}>{code}</span>{name}
    </div>
  );
}

function ChatBubble({ item }) {
  const isMe = item.speaker === "me";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start", marginBottom: 14 }}>
      <div style={{ fontSize: 10, color: color.text4, marginBottom: 3, padding: "0 4px" }}>{isMe ? "나" : "상대"} · {item.time}</div>
      <div style={{
        maxWidth: "85%", padding: "12px 16px",
        borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        backgroundColor: isMe ? color.primary : color.backgroundAlt,
      }}>
        <div style={{ fontSize: font.body.size, fontWeight: 500, color: isMe ? "white" : color.text1, lineHeight: 1.5 }}>
          {isMe ? item.translated : item.original}
        </div>
        <div style={{ fontSize: font.caption.size, color: isMe ? "rgba(255,255,255,0.5)" : color.text4, marginTop: 6, lineHeight: 1.4 }}>
          {isMe ? item.original : item.translated}
        </div>
      </div>
    </div>
  );
}

export default function TranslationPage() {
  const [state, setState] = useState(TRANS_STATE.IDLE);
  const [currentText, setCurrentText] = useState("");
  const [currentTranslation, setCurrentTranslation] = useState("");
  const [conversations] = useState(MOCK_CONVERSATIONS);
  const [showCardData, setShowCardData] = useState(null);

  useEffect(() => {
    if (state === TRANS_STATE.LISTENING) {
      const t1 = setTimeout(() => setCurrentText("すみません..."), 800);
      const t2 = setTimeout(() => setCurrentText("すみません、この近くに..."), 1500);
      const t3 = setTimeout(() => { setCurrentText("すみません、この近くに駅はありますか？"); setCurrentTranslation("실례합니다, 이 근처에 역이 있나요?"); }, 2500);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [state]);

  useEffect(() => {
    if (state === TRANS_STATE.SPEAKING) {
      const t1 = setTimeout(() => setCurrentText("네, 저쪽으로..."), 800);
      const t2 = setTimeout(() => { setCurrentText("네, 저쪽으로 200미터 가시면 됩니다."); setCurrentTranslation("はい、あちらに200メートル行けば着きます。"); }, 1800);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [state]);

  const resetCurrent = () => { setCurrentText(""); setCurrentTranslation(""); };

  const handleShowCard = () => {
    setShowCardData({
      translation: currentTranslation || "はい、あちらに200メートル行けば着きます。",
      original: currentText || "네, 저쪽으로 200미터 가시면 됩니다.",
    });
    setState(TRANS_STATE.SHOW_CARD);
  };

  /* ── SHOW CARD MODE ── */
  if (state === TRANS_STATE.SHOW_CARD && showCardData) {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 30, backgroundColor: color.surface }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: color.primary, textAlign: "center", lineHeight: 1.4, marginBottom: 24 }}>
          {showCardData.translation}
        </div>
        <div style={{ width: 60, height: 2, backgroundColor: color.border, marginBottom: 24 }} />
        <div style={{ fontSize: font.h3.size, color: color.text4, textAlign: "center", lineHeight: 1.4, marginBottom: 32 }}>
          {showCardData.original}
        </div>
        <div onClick={() => {}} style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: color.background, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginBottom: 40, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <PlayIcon size={24} c={color.primary} />
        </div>
        <div onClick={() => { setState(TRANS_STATE.IDLE); resetCurrent(); }} style={{ padding: "12px 40px", borderRadius: radius.md, border: `1.5px solid ${color.border}`, fontSize: font.body.size, color: color.text3, cursor: "pointer" }}>
          닫기
        </div>
      </div>
    );
  }

  /* ── LOG MODE ── */
  if (state === TRANS_STATE.LOG) {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div onClick={() => setState(TRANS_STATE.IDLE)} style={{ cursor: "pointer" }}><BackIcon /></div>
          <div style={{ fontSize: font.h2.size - 2, fontWeight: font.h2.weight, color: color.primary }}>대화 기록</div>
        </div>
        <div style={{ padding: "0 20px 12px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <LangPill code="KO" name="한국어" active={false} />
          <SwapIcon />
          <LangPill code="JA" name="日本語" active={false} />
          <span style={{ marginLeft: "auto", fontSize: font.caption.size, color: color.text4 }}>{conversations.length}턴</span>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "10px 20px 20px" }}>
          {conversations.map((item) => <ChatBubble key={item.id} item={item} />)}
        </div>
      </div>
    );
  }

  /* ── MAIN MODE ── */
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px 8px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ fontSize: font.h2.size, fontWeight: font.h2.weight, color: color.primary }}>번역</div>
        <div onClick={() => setState(TRANS_STATE.LOG)} style={{ cursor: "pointer", padding: "6px 12px", borderRadius: radius.sm, backgroundColor: color.backgroundAlt, display: "flex", alignItems: "center", gap: 6, color: color.text3 }}>
          <ListIcon /><span style={{ fontSize: font.caption.size, fontWeight: 500 }}>기록</span>
        </div>
      </div>

      {/* Language selector */}
      <div style={{ padding: "8px 20px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexShrink: 0 }}>
        <LangPill code="KO" name="한국어" active={state === TRANS_STATE.SPEAKING} />
        <div style={{ cursor: "pointer" }}><SwapIcon /></div>
        <LangPill code="JA" name="日本語" active={state === TRANS_STATE.LISTENING} />
      </div>

      {/* Center */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 30px", position: "relative" }}>
        {state === TRANS_STATE.IDLE && (
          <div style={{ textAlign: "center", animation: "fadeUp 0.3s ease" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: color.backgroundAlt, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <MicIcon size={32} c={color.text4} />
            </div>
            <div style={{ fontSize: font.h3.size, fontWeight: font.h3.weight, color: color.text4 }}>번역 준비 완료</div>
            <div style={{ fontSize: font.caption.size + 1, color: color.text4, marginTop: 6 }}>아래 버튼을 탭하거나 AIVY에 말하세요</div>
          </div>
        )}

        {state === TRANS_STATE.LISTENING && (
          <div style={{ textAlign: "center", animation: "fadeUp 0.3s ease", position: "relative" }}>
            <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 24px" }}>
              <PulseRing active={true} ringColor={color.accent} />
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 72, height: 72, borderRadius: "50%", backgroundColor: color.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MicIcon size={28} c={color.accent} />
              </div>
            </div>
            <div style={{ fontSize: font.caption.size, fontWeight: 600, color: color.accent, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 10 }}>듣는 중 · 日本語</div>
            {currentText && <div style={{ fontSize: 18, fontWeight: 600, color: color.text1, lineHeight: 1.5, marginBottom: 8 }}>{currentText}{!currentTranslation && <span style={{ animation: "blink 1s infinite" }}>|</span>}</div>}
            {currentTranslation && <div style={{ fontSize: 15, color: color.accent, lineHeight: 1.4, fontWeight: 500 }}>→ {currentTranslation}</div>}
          </div>
        )}

        {state === TRANS_STATE.SPEAKING && (
          <div style={{ textAlign: "center", animation: "fadeUp 0.3s ease", position: "relative" }}>
            <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 24px" }}>
              <PulseRing active={true} ringColor={color.primary} />
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 72, height: 72, borderRadius: "50%", backgroundColor: color.primaryLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MicIcon size={28} c={color.primary} />
              </div>
            </div>
            <div style={{ fontSize: font.caption.size, fontWeight: 600, color: color.primary, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 10 }}>내 차례 · 한국어</div>
            {currentText && <div style={{ fontSize: 18, fontWeight: 600, color: color.text1, lineHeight: 1.5, marginBottom: 8 }}>{currentText}{!currentTranslation && <span style={{ animation: "blink 1s infinite" }}>|</span>}</div>}
            {currentTranslation && <div style={{ fontSize: 15, color: color.accent, lineHeight: 1.4, fontWeight: 500 }}>→ {currentTranslation}</div>}
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div style={{ padding: "14px 20px 20px", flexShrink: 0 }}>
        {currentTranslation && (state === TRANS_STATE.LISTENING || state === TRANS_STATE.SPEAKING) && (
          <div onClick={handleShowCard} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 0", borderRadius: radius.md, backgroundColor: color.backgroundAlt, marginBottom: 10, cursor: "pointer", color: color.text2, fontSize: font.caption.size + 1, fontWeight: 500, animation: "fadeUp 0.3s ease" }}>
            <ShowIcon />상대방에게 보여주기
          </div>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <div onClick={() => { resetCurrent(); setState(state === TRANS_STATE.LISTENING ? TRANS_STATE.IDLE : TRANS_STATE.LISTENING); }}
            style={{ flex: 1, padding: "14px 0", borderRadius: radius.lg, backgroundColor: state === TRANS_STATE.LISTENING ? color.accent : color.accentLight, textAlign: "center", cursor: "pointer", transition: "all 0.2s ease" }}>
            <div style={{ fontSize: font.caption.size + 1, fontWeight: 700, color: state === TRANS_STATE.LISTENING ? "white" : color.accent }}>
              {state === TRANS_STATE.LISTENING ? "듣는 중..." : "듣기"}
            </div>
            <div style={{ fontSize: font.tiny.size, color: state === TRANS_STATE.LISTENING ? "rgba(255,255,255,0.7)" : color.accent, marginTop: 2, opacity: 0.7 }}>상대 언어</div>
          </div>
          <div onClick={() => { resetCurrent(); setState(state === TRANS_STATE.SPEAKING ? TRANS_STATE.IDLE : TRANS_STATE.SPEAKING); }}
            style={{ flex: 1, padding: "14px 0", borderRadius: radius.lg, backgroundColor: state === TRANS_STATE.SPEAKING ? color.primary : color.primaryLight, textAlign: "center", cursor: "pointer", transition: "all 0.2s ease" }}>
            <div style={{ fontSize: font.caption.size + 1, fontWeight: 700, color: state === TRANS_STATE.SPEAKING ? "white" : color.primary }}>
              {state === TRANS_STATE.SPEAKING ? "번역 중..." : "말하기"}
            </div>
            <div style={{ fontSize: font.tiny.size, color: state === TRANS_STATE.SPEAKING ? "rgba(255,255,255,0.7)" : color.primary, marginTop: 2, opacity: 0.7 }}>내 언어</div>
          </div>
        </div>
      </div>
    </div>
  );
}
