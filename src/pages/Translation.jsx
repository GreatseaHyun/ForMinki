import { useState, useEffect } from "react";
import { MOCK_CONVERSATIONS } from "../data/mock";
import Header from "../components/layout/Header";
import {
  Mic,
  Volume2,
  ArrowLeftRight,
  Smartphone,
  List,
  Play,
  Square,
} from "lucide-react";

const STATES = {
  IDLE: "idle",
  LISTENING: "listening",
  SPEAKING: "speaking",
  SHOW_CARD: "show_card",
  LOG: "log",
};

function LangPill({ code, label }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-lg">
      <span className="text-[13px] font-bold text-text-primary">{code}</span>
      <span className="text-[11px] text-text-tertiary">{label}</span>
    </div>
  );
}

function ChatBubble({ speaker, original, translated, time }) {
  const isMe = speaker === "me";
  return (
    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} mb-3`}>
      <div
        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl ${
          isMe
            ? "bg-brand text-white rounded-br-md"
            : "bg-slate-100 text-text-primary rounded-bl-md"
        }`}
      >
        <p className="text-[14px] leading-relaxed">{original}</p>
      </div>
      <div
        className={`max-w-[80%] px-3.5 py-2 mt-1 rounded-2xl ${
          isMe
            ? "bg-brand-subtle text-brand rounded-br-md"
            : "bg-emerald-50 text-emerald-700 rounded-bl-md"
        }`}
      >
        <p className="text-[13px] leading-relaxed">{translated}</p>
      </div>
      <span className="text-[10px] text-text-tertiary mt-1 px-1">{time}</span>
    </div>
  );
}

function PulseRing({ color = "brand" }) {
  const colorClass = color === "brand" ? "border-brand-light" : "border-emerald-400";
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`absolute rounded-full border-2 ${colorClass} opacity-20 animate-pulse-ring`}
          style={{
            width: 80 + i * 40,
            height: 80 + i * 40,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Translation() {
  const [state, setState] = useState(STATES.IDLE);
  const [streamText, setStreamText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [showCardText, setShowCardText] = useState({ original: "", translated: "" });

  // Simulate listening
  useEffect(() => {
    if (state !== STATES.LISTENING) return;
    setStreamText("");
    setTranslatedText("");
    const original = "すみません、この近くに駅はありますか？";
    const translated = "실례합니다, 이 근처에 역이 있나요?";
    let i = 0;
    const interval = setInterval(() => {
      if (i < original.length) {
        setStreamText(original.slice(0, i + 1));
        i++;
      } else {
        setTranslatedText(translated);
        clearInterval(interval);
        setTimeout(() => setState(STATES.IDLE), 3000);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [state]);

  // Simulate speaking
  useEffect(() => {
    if (state !== STATES.SPEAKING) return;
    setStreamText("");
    setTranslatedText("");
    const original = "네, 저쪽으로 200미터 가시면 됩니다.";
    const translated = "はい、あちらに200メートル行けば着きます。";
    let i = 0;
    const interval = setInterval(() => {
      if (i < original.length) {
        setStreamText(original.slice(0, i + 1));
        i++;
      } else {
        setTranslatedText(translated);
        setShowCardText({ original: translated, translated: original });
        clearInterval(interval);
        setTimeout(() => setState(STATES.IDLE), 3000);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [state]);

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <Header
        title="실시간 번역"
        back
        right={
          <button
            onClick={() => setState(STATES.LOG)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50"
          >
            <List size={18} className="text-text-secondary" />
          </button>
        }
      />

      {/* Language pair */}
      <div className="flex items-center justify-center gap-3 py-3 border-b border-slate-100">
        <LangPill code="KO" label="한국어" />
        <ArrowLeftRight size={16} className="text-text-tertiary" />
        <LangPill code="JA" label="일본어" />
      </div>

      {/* IDLE */}
      {state === STATES.IDLE && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 animate-fade-up">
          <p className="text-[14px] text-text-secondary mb-10">
            버튼을 눌러 통역을 시작하세요
          </p>

          <div className="flex gap-6 mb-6">
            {/* Listen button */}
            <button
              onClick={() => setState(STATES.LISTENING)}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors group-active:scale-95">
                <Volume2 size={28} className="text-emerald-600" />
              </div>
              <div className="text-center">
                <p className="text-[14px] font-semibold text-text-primary">
                  듣기
                </p>
                <p className="text-[11px] text-text-tertiary">상대방 언어</p>
              </div>
            </button>

            {/* Speak button */}
            <button
              onClick={() => setState(STATES.SPEAKING)}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-20 h-20 rounded-full bg-brand-subtle flex items-center justify-center group-hover:bg-blue-100 transition-colors group-active:scale-95">
                <Mic size={28} className="text-brand" />
              </div>
              <div className="text-center">
                <p className="text-[14px] font-semibold text-text-primary">
                  말하기
                </p>
                <p className="text-[11px] text-text-tertiary">내 언어</p>
              </div>
            </button>
          </div>

          {/* Show card shortcut */}
          <button
            onClick={() => {
              setShowCardText({
                original: "はい、あちらに200メートル行けば着きます。",
                translated: "네, 저쪽으로 200미터 가시면 됩니다.",
              });
              setState(STATES.SHOW_CARD);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface text-[13px] text-text-secondary font-medium hover:bg-slate-100 transition-colors"
          >
            <Smartphone size={14} />
            화면 보여주기
          </button>
        </div>
      )}

      {/* LISTENING */}
      {state === STATES.LISTENING && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 relative animate-fade-up">
          <PulseRing color="emerald" />
          <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mb-6 z-10">
            <Volume2 size={28} className="text-white" />
          </div>
          <p className="text-[13px] text-emerald-600 font-medium mb-6 z-10">
            상대방이 말하는 중...
          </p>

          {streamText && (
            <div className="w-full max-w-sm space-y-3 z-10">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-[11px] text-text-tertiary mb-1">JA</p>
                <p className="text-[15px] text-text-primary">{streamText}</p>
              </div>
              {translatedText && (
                <div className="bg-emerald-50 rounded-xl p-4">
                  <p className="text-[11px] text-emerald-500 mb-1">KO</p>
                  <p className="text-[15px] text-emerald-800">
                    {translatedText}
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setState(STATES.IDLE)}
            className="absolute bottom-10 w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors z-10"
          >
            <Square size={18} className="text-text-secondary" fill="currentColor" />
          </button>
        </div>
      )}

      {/* SPEAKING */}
      {state === STATES.SPEAKING && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 relative animate-fade-up">
          <PulseRing color="brand" />
          <div className="w-20 h-20 rounded-full bg-brand flex items-center justify-center mb-6 z-10">
            <Mic size={28} className="text-white" />
          </div>
          <p className="text-[13px] text-brand-light font-medium mb-6 z-10">
            말씀하세요...
          </p>

          {streamText && (
            <div className="w-full max-w-sm space-y-3 z-10">
              <div className="bg-brand-subtle rounded-xl p-4">
                <p className="text-[11px] text-brand mb-1">KO</p>
                <p className="text-[15px] text-text-primary">{streamText}</p>
              </div>
              {translatedText && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-[11px] text-text-tertiary mb-1">JA</p>
                  <p className="text-[15px] text-text-primary">
                    {translatedText}
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setState(STATES.IDLE)}
            className="absolute bottom-10 w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors z-10"
          >
            <Square size={18} className="text-text-secondary" fill="currentColor" />
          </button>
        </div>
      )}

      {/* SHOW CARD */}
      {state === STATES.SHOW_CARD && (
        <div
          className="flex-1 flex flex-col items-center justify-center px-6 bg-slate-900 animate-fade-up"
          onClick={() => setState(STATES.IDLE)}
        >
          <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-6">
            상대방에게 보여주세요
          </p>
          <p className="text-[28px] font-bold text-white text-center leading-relaxed mb-4">
            {showCardText.original}
          </p>
          <div className="w-12 h-px bg-slate-700 mb-4" />
          <p className="text-[16px] text-slate-400 text-center">
            {showCardText.translated}
          </p>
          <p className="absolute bottom-8 text-[12px] text-slate-600">
            탭하여 돌아가기
          </p>
        </div>
      )}

      {/* LOG */}
      {state === STATES.LOG && (
        <div className="flex-1 px-4 py-4 animate-fade-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-text-primary">
              대화 기록
            </h3>
            <span className="text-[12px] text-text-tertiary">
              {MOCK_CONVERSATIONS.length}턴
            </span>
          </div>
          <div>
            {MOCK_CONVERSATIONS.map((msg) => (
              <ChatBubble key={msg.id} {...msg} />
            ))}
          </div>
          <button
            onClick={() => setState(STATES.IDLE)}
            className="w-full mt-4 py-2.5 bg-surface rounded-xl text-[14px] font-medium text-text-secondary hover:bg-slate-100 transition-colors"
          >
            통역으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
}
