import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_ROUTES, MOCK_NAV_STEPS } from "../data/mock";
import Header from "../components/layout/Header";
import Chip from "../components/ui/Chip";
import {
  Search,
  MapPin,
  Footprints,
  Bus,
  Clock,
  Navigation as NavIcon,
  ChevronRight,
  Bookmark,
  X,
  CornerDownRight,
  ArrowUp,
  CheckCircle2,
} from "lucide-react";

const STATES = { SEARCH: "search", ROUTE: "route", NAV: "nav", ARRIVED: "arrived" };

const quickSearch = [
  { label: "주변 카페", icon: "cafe" },
  { label: "약국", icon: "pharmacy" },
  { label: "지하철역", icon: "station" },
];

const recentDest = [
  "강남역 2번 출구",
  "스타벅스 역삼점",
  "서울 센트럴 시티",
];

export default function Navigation() {
  const navigate = useNavigate();
  const [state, setState] = useState(STATES.SEARCH);
  const [query, setQuery] = useState("");
  const [destination, setDestination] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Simulate navigation progress
  useEffect(() => {
    if (state !== STATES.NAV) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= MOCK_NAV_STEPS.length - 1) {
          setState(STATES.ARRIVED);
          return prev;
        }
        return prev + 1;
      });
      setProgress((prev) => Math.min(prev + 25, 100));
    }, 3000);
    return () => clearInterval(interval);
  }, [state]);

  const handleSearch = (dest) => {
    setDestination(dest);
    setQuery(dest);
    setState(STATES.ROUTE);
  };

  const handleSelectRoute = () => {
    setState(STATES.NAV);
    setCurrentStep(0);
    setProgress(0);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <Header
        title="내비게이션"
        back
        right={
          state === STATES.NAV && (
            <button
              onClick={() => setState(STATES.SEARCH)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50"
            >
              <X size={18} className="text-text-secondary" />
            </button>
          )
        }
      />

      {/* SEARCH */}
      {state === STATES.SEARCH && (
        <div className="px-4 py-4 space-y-5 animate-fade-up">
          {/* Search bar */}
          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-surface rounded-xl border border-slate-100 focus-within:border-brand-light focus-within:ring-2 focus-within:ring-brand-light/20 transition-all">
            <Search size={18} className="text-text-tertiary shrink-0" />
            <input
              type="text"
              placeholder="목적지를 입력하세요"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim()) handleSearch(query);
              }}
              className="flex-1 bg-transparent text-[14px] text-text-primary placeholder:text-text-tertiary outline-none"
            />
          </div>

          {/* Quick chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {quickSearch.map((q) => (
              <Chip
                key={q.label}
                label={q.label}
                active={false}
                onClick={() => handleSearch(q.label)}
              />
            ))}
          </div>

          {/* Recent */}
          <section>
            <h3 className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-2">
              최근 목적지
            </h3>
            <div className="space-y-1">
              {recentDest.map((dest) => (
                <button
                  key={dest}
                  onClick={() => handleSearch(dest)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
                >
                  <Clock size={14} className="text-text-tertiary shrink-0" />
                  <span className="text-[14px] text-text-primary">{dest}</span>
                  <ChevronRight
                    size={14}
                    className="text-text-tertiary ml-auto shrink-0"
                  />
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ROUTE SELECT */}
      {state === STATES.ROUTE && (
        <div className="px-4 py-4 space-y-4 animate-fade-up">
          <div className="flex items-center gap-2 px-3 py-2 bg-brand-subtle rounded-xl">
            <MapPin size={16} className="text-brand shrink-0" />
            <span className="text-[14px] font-medium text-brand">
              {destination}
            </span>
          </div>

          <h3 className="text-[13px] font-semibold text-text-secondary">
            경로 선택
          </h3>

          <div className="space-y-2.5">
            {MOCK_ROUTES.map((route) => (
              <button
                key={route.id}
                onClick={handleSelectRoute}
                className="w-full flex items-center gap-3.5 p-4 rounded-2xl border border-slate-100 hover:border-brand-light hover:bg-brand-subtle/50 transition-all active:scale-[0.98] text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  {route.type === "walk" ? (
                    <Footprints size={18} className="text-brand" />
                  ) : (
                    <Bus size={18} className="text-emerald-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-text-primary">
                    {route.label}
                  </p>
                  <p className="text-[12px] text-text-secondary mt-0.5">
                    {route.description}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[15px] font-bold text-brand">
                    {route.duration}
                  </p>
                  <p className="text-[11px] text-text-tertiary">
                    {route.distance}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setState(STATES.SEARCH)}
            className="w-full py-2.5 text-[13px] text-text-secondary font-medium hover:text-text-primary transition-colors"
          >
            다른 목적지 검색
          </button>
        </div>
      )}

      {/* NAVIGATING */}
      {state === STATES.NAV && (
        <div className="flex-1 flex flex-col">
          {/* Map placeholder */}
          <div className="flex-1 bg-slate-100 relative min-h-[300px] flex items-center justify-center">
            <div className="text-center">
              <NavIcon size={32} className="text-brand mx-auto mb-2" />
              <p className="text-[13px] text-text-secondary">
                {destination} 방면
              </p>
            </div>
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200">
              <div
                className="h-full bg-brand transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Turn instruction card */}
          <div className="bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)] p-5 -mt-4 relative z-10">
            {MOCK_NAV_STEPS[currentStep] && (
              <>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-subtle flex items-center justify-center shrink-0">
                    {currentStep < MOCK_NAV_STEPS.length - 1 ? (
                      <CornerDownRight size={18} className="text-brand" />
                    ) : (
                      <MapPin size={18} className="text-brand" />
                    )}
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-text-primary">
                      {MOCK_NAV_STEPS[currentStep].instruction}
                    </p>
                    <p className="text-[13px] text-text-secondary mt-0.5">
                      {MOCK_NAV_STEPS[currentStep].detail}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-text-tertiary">
                    남은 거리: {MOCK_NAV_STEPS[currentStep].remaining}
                  </span>
                  <span className="text-text-tertiary">
                    {currentStep + 1} / {MOCK_NAV_STEPS.length}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ARRIVED */}
      {state === STATES.ARRIVED && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 animate-fade-up">
          <div className="w-16 h-16 rounded-full bg-success-subtle flex items-center justify-center mb-5">
            <CheckCircle2 size={28} className="text-success" />
          </div>
          <h2 className="text-[18px] font-bold text-text-primary mb-1">
            도착했습니다
          </h2>
          <p className="text-[14px] text-text-secondary mb-8">{destination}</p>

          <div className="flex items-center gap-6 mb-10">
            <div className="text-center">
              <p className="text-[22px] font-bold text-text-primary">1.2km</p>
              <p className="text-[12px] text-text-tertiary mt-0.5">총 거리</p>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <p className="text-[22px] font-bold text-text-primary">15분</p>
              <p className="text-[12px] text-text-tertiary mt-0.5">소요 시간</p>
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={() => {}}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface rounded-xl text-[14px] font-medium text-text-secondary hover:bg-slate-100 transition-colors"
            >
              <Bookmark size={16} />
              장소 저장
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-2.5 bg-brand text-white rounded-xl text-[14px] font-semibold hover:bg-brand-dark transition-colors active:scale-[0.97]"
            >
              완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
