import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDevice } from "../contexts/DeviceContext";
import { MOCK_DISCOVERED_DEVICES } from "../data/mock";
import Header from "../components/layout/Header";
import {
  Bluetooth,
  Wifi,
  Check,
  Loader2,
  Signal,
  BatteryMedium,
} from "lucide-react";

const PHASES = ["검색", "기기 선택", "연결", "완료"];

function SignalBars({ signal }) {
  const strength = signal > -50 ? 3 : signal > -65 ? 2 : 1;
  return (
    <div className="flex items-end gap-0.5 h-3">
      {[1, 2, 3].map((bar) => (
        <div
          key={bar}
          className={`w-1 rounded-full ${
            bar <= strength ? "bg-success" : "bg-slate-200"
          }`}
          style={{ height: `${bar * 33}%` }}
        />
      ))}
    </div>
  );
}

export default function Pairing() {
  const navigate = useNavigate();
  const { updateDevice } = useDevice();
  const [phase, setPhase] = useState(0); // 0=scanning, 1=found, 2=connecting, 3=done
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [connectStep, setConnectStep] = useState(0); // 0=bt, 1=wifi, 2=done

  // Simulate scanning
  useEffect(() => {
    if (phase === 0) {
      const timer = setTimeout(() => setPhase(1), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Simulate connecting
  useEffect(() => {
    if (phase === 2) {
      const t1 = setTimeout(() => setConnectStep(1), 1500);
      const t2 = setTimeout(() => {
        setConnectStep(2);
        setPhase(3);
      }, 3000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [phase]);

  const handleSelect = (dev) => {
    setSelectedDevice(dev);
    setPhase(2);
  };

  const handleDone = () => {
    updateDevice({
      connected: true,
      name: selectedDevice?.name || "AIVY-Pro",
      btConnected: true,
      wifiDirectConnected: true,
      battery: selectedDevice?.battery || 85,
    });
    navigate("/");
  };

  return (
    <div className="min-h-dvh flex flex-col">
      <Header title="기기 연결" back />

      {/* Step indicator */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between relative">
          {/* Progress line */}
          <div className="absolute top-3 left-0 right-0 h-0.5 bg-slate-100" />
          <div
            className="absolute top-3 left-0 h-0.5 bg-brand transition-all duration-500"
            style={{ width: `${(phase / 3) * 100}%` }}
          />

          {PHASES.map((label, i) => (
            <div key={label} className="relative flex flex-col items-center gap-1.5 z-10">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors ${
                  i <= phase
                    ? "bg-brand text-white"
                    : "bg-slate-100 text-text-tertiary"
                }`}
              >
                {i < phase ? (
                  <Check size={12} strokeWidth={3} />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-[11px] font-medium ${
                  i <= phase ? "text-text-primary" : "text-text-tertiary"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4">
        {/* Scanning */}
        {phase === 0 && (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-up">
            <Loader2 size={40} className="text-brand animate-spin mb-4" />
            <p className="text-[15px] font-semibold text-text-primary">
              주변 AIVY 기기를 검색 중
            </p>
            <p className="text-[13px] text-text-secondary mt-1">
              기기의 전원이 켜져 있는지 확인해 주세요
            </p>
          </div>
        )}

        {/* Found */}
        {phase === 1 && (
          <div className="space-y-3 animate-fade-up">
            <p className="text-[13px] text-text-secondary mb-4">
              {MOCK_DISCOVERED_DEVICES.length}개 기기 발견
            </p>
            {MOCK_DISCOVERED_DEVICES.map((dev) => (
              <button
                key={dev.id}
                onClick={() => handleSelect(dev)}
                className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-brand-light hover:bg-brand-subtle transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Bluetooth size={18} className="text-brand" />
                  </div>
                  <div className="text-left">
                    <p className="text-[14px] font-semibold text-text-primary">
                      {dev.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <SignalBars signal={dev.signal} />
                      <span className="text-[11px] text-text-tertiary">
                        {dev.signal} dBm
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <BatteryMedium size={14} />
                  <span className="text-[12px] font-medium">{dev.battery}%</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Connecting */}
        {phase === 2 && (
          <div className="space-y-4 py-8 animate-fade-up">
            <p className="text-[15px] font-semibold text-text-primary text-center mb-6">
              {selectedDevice?.name}에 연결 중
            </p>
            {/* BT */}
            <div
              className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
                connectStep >= 1 ? "bg-success-subtle" : "bg-brand-subtle"
              }`}
            >
              <Bluetooth
                size={18}
                className={connectStep >= 1 ? "text-success" : "text-brand"}
              />
              <span className="text-[14px] font-medium text-text-primary flex-1">
                Bluetooth (Audio SCO)
              </span>
              {connectStep >= 1 ? (
                <Check size={16} className="text-success" />
              ) : (
                <Loader2 size={16} className="text-brand animate-spin" />
              )}
            </div>
            {/* WiFi Direct */}
            <div
              className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
                connectStep >= 2
                  ? "bg-success-subtle"
                  : connectStep >= 1
                  ? "bg-brand-subtle"
                  : "bg-slate-50"
              }`}
            >
              <Wifi
                size={18}
                className={
                  connectStep >= 2
                    ? "text-success"
                    : connectStep >= 1
                    ? "text-brand"
                    : "text-text-tertiary"
                }
              />
              <span className="text-[14px] font-medium text-text-primary flex-1">
                WiFi Direct (Data)
              </span>
              {connectStep >= 2 ? (
                <Check size={16} className="text-success" />
              ) : connectStep >= 1 ? (
                <Loader2 size={16} className="text-brand animate-spin" />
              ) : (
                <span className="text-[12px] text-text-tertiary">대기</span>
              )}
            </div>
          </div>
        )}

        {/* Done */}
        {phase === 3 && (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-success-subtle flex items-center justify-center mb-4">
              <Check size={28} className="text-success" strokeWidth={2.5} />
            </div>
            <p className="text-[17px] font-semibold text-text-primary">
              연결 완료
            </p>
            <p className="text-[13px] text-text-secondary mt-1">
              {selectedDevice?.name}이(가) 성공적으로 연결되었습니다
            </p>
            <button
              onClick={handleDone}
              className="mt-8 px-8 py-2.5 bg-brand text-white rounded-xl text-[14px] font-semibold hover:bg-brand-dark transition-colors active:scale-[0.97]"
            >
              시작하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
