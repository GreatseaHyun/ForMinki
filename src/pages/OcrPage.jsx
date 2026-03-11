import { useMemo, useRef, useState } from "react";
import { color, font, radius, shadow } from "../tokens";
import { ScanTextIcon } from "../icons";

export const OCR_STATE = {
  IDLE: "idle",
  CAMERA_READY: "camera_ready",
  CAPTURING: "capturing",
  RESULT: "result",
  FAILURE_RECOVERY: "failure_recovery",
  SESSION_END_SAVED: "session_end_saved",
};

export const OCR_INPUT = {
  VOICE_START: "VOICE_START",
  SKIN_TAP: "SKIN_TAP",
  CAPTURE: "CAPTURE",
  RETRY: "RETRY",
  EXIT: "EXIT",
};

export const OCR_OUTPUT = {
  SPEAK_SHORT: "SPEAK_SHORT",
  SPEAK_SUMMARY: "SPEAK_SUMMARY",
  SAVE_OCR_RECORD: "SAVE_OCR_RECORD",
  SHOW_ANDROID_HANDOFF: "SHOW_ANDROID_HANDOFF",
};

export const mockOcrCases = [
  {
    id: "sign_1",
    type: "short",
    sourceText: "Shinjuku South Exit B2",
    pronunciation: "신주쿠 사우스 이그짓 비투",
    translatedText: "신주쿠 남쪽 출구 B2",
    locationTag: "station_sign",
    safetyTag: "none",
  },
  {
    id: "price_1",
    type: "short",
    sourceText: "Matcha Latte ¥480",
    pronunciation: "맛차 라떼 엔 사백팔십",
    translatedText: "말차 라떼 480엔",
    locationTag: "menu_price",
    safetyTag: "none",
  },
  {
    id: "menu_1",
    type: "long",
    sourceText: "Lunch Set A ¥980 / Set B ¥1200 / Allergy: egg, milk",
    translatedText: "런치 세트 A 980엔, 세트 B 1200엔, 알레르기 주의: 달걀/우유",
    summary: "요약하면 런치 세트는 980~1200엔이고 알레르기 안내(달걀, 우유)가 포함되어 있습니다.",
    locationTag: "restaurant_menu",
    safetyTag: "allergy",
  },
  {
    id: "medicine_1",
    type: "long",
    sourceText: "Take twice daily after meals. Do not drive after taking.",
    translatedText: "식후 하루 2회 복용. 복용 후 운전 금지.",
    summary: "핵심은 식후 하루 2회 복용, 복용 후 운전 금지입니다.",
    locationTag: "medicine_label",
    safetyTag: "high",
  },
  {
    id: "failure_blur",
    type: "failure",
    reason: "텍스트가 흐립니다. 조금 더 가까이 대주세요.",
    locationTag: "unknown",
    safetyTag: "none",
  },
];

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color.text3} strokeWidth="2" strokeLinecap="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

function SecondaryButton({ label, onClick, disabled = false, tone = "neutral" }) {
  const toneMap = {
    neutral: { bg: color.backgroundAlt, fg: color.text2 },
    accent: { bg: color.accentLight, fg: color.accent },
    danger: { bg: color.dangerLight, fg: color.danger },
  };

  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        flex: 1,
        minWidth: 0,
        padding: "11px 10px",
        borderRadius: radius.md,
        backgroundColor: disabled ? color.border : toneMap[tone].bg,
        color: disabled ? color.text4 : toneMap[tone].fg,
        textAlign: "center",
        fontSize: font.caption.size + 1,
        fontWeight: 600,
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {label}
    </div>
  );
}

function PrimaryButton({ label, onClick, disabled = false }) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        padding: "12px 10px",
        borderRadius: radius.md,
        backgroundColor: disabled ? color.border : color.primary,
        color: disabled ? color.text4 : "white",
        textAlign: "center",
        fontSize: font.caption.size + 1,
        fontWeight: 700,
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {label}
    </div>
  );
}

function nowTime() {
  return new Date().toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export default function OcrPage({ onExit, returnTab = "home", navContext = false }) {
  const [ocrState, setOcrState] = useState(OCR_STATE.IDLE);
  const [entryMethod, setEntryMethod] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [failureReason, setFailureReason] = useState("");
  const [logs, setLogs] = useState([]);
  const [sampleIndex, setSampleIndex] = useState(0);

  const timerRef = useRef(null);

  const statusHint = useMemo(() => {
    if (ocrState === OCR_STATE.IDLE) return "카메라를 켜고 텍스트를 비추면 바로 읽고 기록합니다.";
    if (ocrState === OCR_STATE.CAMERA_READY) return "텍스트를 화면에 맞추고 '텍스트 읽기'를 누르세요.";
    if (ocrState === OCR_STATE.CAPTURING) return "인식 중입니다...";
    if (ocrState === OCR_STATE.RESULT) return "인식 결과를 확인하고 계속 읽거나 종료하세요.";
    if (ocrState === OCR_STATE.FAILURE_RECOVERY) return "실패 원인을 확인하고 다시 시도하세요.";
    return "세션 종료 후 기록이 저장되었습니다.";
  }, [ocrState]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startSession = (inputType) => {
    clearTimer();
    setEntryMethod(inputType);
    setLastResult(null);
    setFailureReason("");
    setOcrState(OCR_STATE.CAMERA_READY);
  };

  const captureText = () => {
    clearTimer();
    setOcrState(OCR_STATE.CAPTURING);

    timerRef.current = setTimeout(() => {
      const sample = mockOcrCases[sampleIndex % mockOcrCases.length];
      setSampleIndex((idx) => idx + 1);

      if (sample.type === "failure") {
        setFailureReason(sample.reason);
        setLastResult(null);
        setOcrState(OCR_STATE.FAILURE_RECOVERY);
        return;
      }

      const spoken = sample.type === "short"
        ? `[${sample.sourceText} (${sample.pronunciation || "발음 안내"})]은 ${sample.translatedText}라고 쓰여 있습니다.`
        : `요약하면 ${sample.summary}`;

      const result = {
        ...sample,
        spoken,
        outputType: sample.type === "short" ? OCR_OUTPUT.SPEAK_SHORT : OCR_OUTPUT.SPEAK_SUMMARY,
      };

      setLastResult(result);

      const record = {
        imageId: `img_${Date.now().toString(36)}`,
        sourceText: sample.sourceText,
        translatedText: sample.translatedText,
        type: sample.type,
        timestamp: new Date().toISOString(),
        locationTag: sample.locationTag,
        safetyTag: sample.safetyTag,
      };

      setLogs((prev) => [
        {
          id: `${sample.id}-${Date.now()}`,
          time: nowTime(),
          summary: sample.type === "short" ? sample.translatedText : sample.summary,
          record,
          outputType: result.outputType,
          handoff: sample.type === "long" ? OCR_OUTPUT.SHOW_ANDROID_HANDOFF : null,
        },
        ...prev,
      ]);

      setOcrState(OCR_STATE.RESULT);
    }, 750);
  };

  const retry = () => {
    clearTimer();
    setFailureReason("");
    setOcrState(OCR_STATE.CAMERA_READY);
  };

  const readAgain = () => {
    clearTimer();
    setOcrState(OCR_STATE.CAMERA_READY);
  };

  const endSession = () => {
    clearTimer();
    setOcrState(OCR_STATE.SESSION_END_SAVED);
    timerRef.current = setTimeout(() => {
      onExit?.(returnTab);
    }, 700);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "transparent" }}>
      <div style={{ padding: "14px 20px 10px", display: "flex", alignItems: "center", gap: 10 }}>
        <div
          onClick={endSession}
          style={{
            width: 30,
            height: 30,
            borderRadius: radius.sm,
            backgroundColor: color.surface,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: shadow.sm,
            cursor: "pointer",
          }}
        >
          <BackIcon />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: radius.sm, backgroundColor: color.warningLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ScanTextIcon size={16} color={color.warning} />
          </div>
          <div>
            <div style={{ fontSize: font.h3.size, fontWeight: 700, color: color.primary, fontFamily: font.display }}>OCR</div>
            <div style={{ fontSize: font.tiny.size, color: color.text4 }}>
              {navContext ? "길찾기 중 OCR" : "일반 OCR"} · return: {returnTab}
            </div>
          </div>
        </div>
      </div>

      <div style={{ margin: "0 20px 10px", backgroundColor: color.surface, borderRadius: radius.lg, boxShadow: shadow.sm, padding: "10px 12px" }}>
        <div style={{ fontSize: font.caption.size, color: color.text2, fontWeight: 700, marginBottom: 4 }}>
          상태: {ocrState}
        </div>
        <div style={{ fontSize: font.tiny.size, color: color.text3 }}>{statusHint}</div>
      </div>

      <div style={{ flex: 1, padding: "0 20px 10px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div
          style={{
            flex: 1,
            minHeight: 220,
            borderRadius: radius.xl,
            overflow: "hidden",
            position: "relative",
            background: "linear-gradient(165deg, #29374C 0%, #1D2938 45%, #17202B 100%)",
            boxShadow: shadow.lg,
            border: `1px solid rgba(255,255,255,0.06)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 20,
          }}
        >
          {ocrState === OCR_STATE.CAPTURING ? (
            <div>
              <div style={{ width: 82, height: 82, borderRadius: "50%", border: `2px solid ${color.accent}`, margin: "0 auto 10px", animation: "pulseRing 0.9s ease-out infinite" }} />
              <div style={{ color: "rgba(255,255,255,0.86)", fontSize: 14 }}>텍스트 인식 중...</div>
            </div>
          ) : (
            <div style={{ color: "rgba(255,255,255,0.82)", fontSize: 14, lineHeight: 1.55 }}>
              {ocrState === OCR_STATE.IDLE && "카메라 대기 중입니다."}
              {ocrState === OCR_STATE.CAMERA_READY && "텍스트를 카메라에 비춘 뒤 읽기를 시작하세요."}
              {ocrState === OCR_STATE.RESULT && "인식 완료. 결과 카드와 기록을 확인하세요."}
              {ocrState === OCR_STATE.FAILURE_RECOVERY && "인식 실패. 각도/거리 조정 후 재시도하세요."}
              {ocrState === OCR_STATE.SESSION_END_SAVED && "세션 종료 및 기록 저장 완료."}
            </div>
          )}
        </div>

        {(ocrState === OCR_STATE.RESULT || ocrState === OCR_STATE.FAILURE_RECOVERY) && (
          <div style={{ backgroundColor: color.surface, borderRadius: radius.lg, boxShadow: shadow.sm, padding: "12px 14px" }}>
            {ocrState === OCR_STATE.FAILURE_RECOVERY ? (
              <div style={{ fontSize: font.bodyText.size, color: color.danger, fontWeight: 600 }}>{failureReason}</div>
            ) : (
              <>
                <div style={{ fontSize: font.bodyText.size, color: color.primary, fontWeight: 600, lineHeight: 1.5 }}>{lastResult?.spoken}</div>
                {lastResult?.type === "long" && (
                  <div style={{ marginTop: 8, padding: "8px 10px", borderRadius: radius.sm, backgroundColor: color.accentLight, color: color.accent, fontSize: font.caption.size, fontWeight: 600 }}>
                    전체 번역은 Android 앱에서 확인할 수 있습니다.
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div style={{ backgroundColor: color.surface, borderRadius: radius.lg, boxShadow: shadow.sm, padding: "10px 12px", minHeight: 100 }}>
          <div style={{ fontSize: font.caption.size, color: color.text2, fontWeight: 700, marginBottom: 6 }}>인식 기록</div>
          {logs.length === 0 ? (
            <div style={{ fontSize: font.tiny.size, color: color.text4 }}>아직 기록이 없습니다.</div>
          ) : (
            <div style={{ maxHeight: 140, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
              {logs.map((log) => (
                <div key={log.id} style={{ padding: "8px 10px", borderRadius: radius.sm, backgroundColor: color.background }}>
                  <div style={{ fontSize: 11, color: color.text4, marginBottom: 2 }}>
                    {log.time} · {log.record.type} · {log.record.locationTag}
                  </div>
                  <div style={{ fontSize: 12, color: color.text2, lineHeight: 1.4 }}>{log.summary}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "12px 20px 16px", backgroundColor: color.surface, borderTop: `1px solid ${color.border}`, boxShadow: "0 -6px 18px rgba(27,58,92,0.08)" }}>
        {ocrState === OCR_STATE.IDLE && (
          <div style={{ display: "flex", gap: 8 }}>
            <SecondaryButton label="음성으로 시작" tone="accent" onClick={() => startSession(OCR_INPUT.VOICE_START)} />
            <SecondaryButton label="Skin Tap 시작" onClick={() => startSession(OCR_INPUT.SKIN_TAP)} />
          </div>
        )}

        {ocrState === OCR_STATE.CAMERA_READY && (
          <div style={{ display: "flex", gap: 8 }}>
            <PrimaryButton label="텍스트 읽기" onClick={captureText} />
            <SecondaryButton label="종료" onClick={endSession} />
          </div>
        )}

        {ocrState === OCR_STATE.CAPTURING && (
          <div style={{ display: "flex", gap: 8 }}>
            <SecondaryButton label="인식 중..." tone="accent" disabled={true} />
            <SecondaryButton label="종료" onClick={endSession} />
          </div>
        )}

        {ocrState === OCR_STATE.RESULT && (
          <div style={{ display: "flex", gap: 8 }}>
            <PrimaryButton label="다시 읽기" onClick={readAgain} />
            <SecondaryButton label="종료" onClick={endSession} />
          </div>
        )}

        {ocrState === OCR_STATE.FAILURE_RECOVERY && (
          <div style={{ display: "flex", gap: 8 }}>
            <PrimaryButton label="다시 시도" onClick={retry} />
            <SecondaryButton label="종료" tone="danger" onClick={endSession} />
          </div>
        )}

        {ocrState === OCR_STATE.SESSION_END_SAVED && (
          <div style={{ padding: "10px 12px", borderRadius: radius.md, backgroundColor: color.positiveLight, fontSize: font.caption.size + 1, color: color.positive, fontWeight: 700 }}>
            텍스트 번역을 종료합니다. 내용이 저장되었습니다.
          </div>
        )}

        <div style={{ marginTop: 8, fontSize: font.tiny.size, color: color.text4 }}>
          시작 방식: {entryMethod || "-"} · 저장 형식: {`{ imageId, sourceText, translatedText, type, timestamp, locationTag, safetyTag }`}
        </div>
      </div>
    </div>
  );
}
