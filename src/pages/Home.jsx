import { useNavigate } from "react-router-dom";
import { useDevice } from "../contexts/DeviceContext";
import { MODES, MOCK_SESSIONS } from "../data/mock";
import {
  Bluetooth,
  Wifi,
  BatteryMedium,
  Thermometer,
  MapPin,
  Languages,
  ScanText,
  Footprints,
  FileText,
  Brain,
  ChevronRight,
  Lock,
} from "lucide-react";
import Badge from "../components/ui/Badge";

const ICON_MAP = {
  MapPin,
  Languages,
  ScanText,
  Footprints,
  FileText,
  Brain,
};

const MODE_COLORS = {
  navigation: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
  translation: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
  ocr: { bg: "bg-violet-50", text: "text-violet-600", dot: "bg-violet-500" },
  exercise: { bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-500" },
  meeting: { bg: "bg-rose-50", text: "text-rose-600", dot: "bg-rose-500" },
  memory: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500" },
};

const MODE_ROUTES = {
  navigation: "/navigation",
  translation: "/translation",
  memory: "/memory",
};

function BatteryColor(percent) {
  if (percent > 50) return "text-success";
  if (percent > 20) return "text-warning";
  return "text-danger";
}

export default function Home() {
  const { device } = useDevice();
  const navigate = useNavigate();

  return (
    <div className="px-4 pt-3 pb-4 space-y-5">
      {/* Top branding */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-text-primary tracking-tight">
            AIVY
          </h1>
          <p className="text-[13px] text-text-tertiary mt-0.5">
            Smart Buds Companion
          </p>
        </div>
        <button
          onClick={() => navigate("/pairing")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface text-[13px] text-text-secondary font-medium hover:bg-slate-100 transition-colors"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              device.connected ? "bg-success" : "bg-danger"
            }`}
          />
          {device.connected ? "연결됨" : "미연결"}
        </button>
      </div>

      {/* Device status card */}
      <div className="bg-slate-900 rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold">{device.name}</span>
            <span className="text-[11px] text-slate-400 font-medium">
              v{device.firmwareVersion}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 px-2 py-0.5 rounded-full bg-slate-800">
            {device.routeState === "local" ? "Local" : "Cloud"}
          </span>
        </div>

        <div className="flex items-center gap-5">
          {/* Battery */}
          <div className="flex items-center gap-1.5">
            <BatteryMedium size={18} className={BatteryColor(device.battery)} />
            <span className="text-[14px] font-semibold">{device.battery}%</span>
          </div>

          {/* Temperature */}
          <div className="flex items-center gap-1.5">
            <Thermometer size={16} className="text-orange-400" />
            <span className="text-[14px] font-medium text-slate-300">
              {device.temperature}°C
            </span>
          </div>

          {/* Connections */}
          <div className="flex items-center gap-2 ml-auto">
            <Bluetooth
              size={16}
              className={device.btConnected ? "text-blue-400" : "text-slate-600"}
            />
            <Wifi
              size={16}
              className={device.wifiDirectConnected ? "text-emerald-400" : "text-slate-600"}
            />
          </div>
        </div>
      </div>

      {/* Scenario grid */}
      <section>
        <h2 className="text-[13px] font-semibold text-text-tertiary uppercase tracking-wider mb-3">
          시나리오
        </h2>
        <div className="grid grid-cols-3 gap-2.5">
          {MODES.map((mode) => {
            const Icon = ICON_MAP[mode.icon];
            const colors = MODE_COLORS[mode.id];
            const route = MODE_ROUTES[mode.id];

            return (
              <button
                key={mode.id}
                onClick={() => {
                  if (mode.available && route) navigate(route);
                }}
                disabled={!mode.available}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                  mode.available
                    ? "bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm active:scale-[0.97]"
                    : "bg-slate-50 opacity-50 cursor-not-allowed"
                }`}
              >
                {!mode.available && (
                  <Lock
                    size={10}
                    className="absolute top-2 right-2 text-text-tertiary"
                  />
                )}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg}`}
                >
                  <Icon size={20} className={colors.text} strokeWidth={1.8} />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-semibold text-text-primary leading-tight">
                    {mode.label}
                  </p>
                  <p className="text-[11px] text-text-tertiary mt-0.5">
                    {mode.available ? mode.description : "준비 중"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Recent activity */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[13px] font-semibold text-text-tertiary uppercase tracking-wider">
            최근 활동
          </h2>
          <button
            onClick={() => navigate("/activity")}
            className="text-[12px] text-brand-light font-medium"
          >
            전체 보기
          </button>
        </div>

        <div className="space-y-2">
          {MOCK_SESSIONS.slice(0, 3).map((session, i) => {
            const colors = MODE_COLORS[session.mode];
            return (
              <div
                key={session.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-surface hover:bg-slate-100 transition-colors cursor-pointer animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${colors.bg}`}
                >
                  <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-medium text-text-primary truncate">
                      {session.title}
                    </p>
                    <ChevronRight
                      size={14}
                      className="text-text-tertiary shrink-0 ml-2"
                    />
                  </div>
                  <p className="text-[12px] text-text-secondary mt-0.5">
                    {session.preview}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[11px] text-text-tertiary">
                      {session.date}
                    </span>
                    {session.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} color="slate">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
