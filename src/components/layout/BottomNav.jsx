import { NavLink } from "react-router-dom";
import { Home, Activity, Brain, Settings } from "lucide-react";

const tabs = [
  { to: "/", icon: Home, label: "홈" },
  { to: "/activity", icon: Activity, label: "활동" },
  { to: "/memory", icon: Brain, label: "메모리" },
  { to: "/settings", icon: Settings, label: "설정" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-slate-100 z-50">
      <div className="flex items-center justify-around h-14 px-2">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
                isActive
                  ? "text-brand"
                  : "text-text-tertiary hover:text-text-secondary"
              }`
            }
          >
            <Icon size={20} strokeWidth={1.8} />
            <span className="text-[11px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
      {/* Safe area for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
