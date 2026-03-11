import { useState } from "react";
import { color } from "./tokens";
import HomePage from "./pages/HomePage";
import NavigationPage from "./pages/NavigationPage";
import TranslationPage from "./pages/TranslationPage";
import MemoryPage from "./pages/MemoryPage";
import SettingsPage from "./pages/SettingsPage";
import PairingPage from "./pages/PairingPage";

/* ── Bottom Nav Icons ── */
const HomeIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? color.primary : "none"} stroke={active ? color.primary : color.text4} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12l8-8 8 8" />
    <path d="M6 10.5V19a1 1 0 0 0 1 1h3.5v-4.5h3V20H17a1 1 0 0 0 1-1v-8.5" />
  </svg>
);

const NavIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? color.primary : "none"} stroke={active ? color.primary : color.text4} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" fill={active ? "white" : "none"} />
  </svg>
);

const TranslateIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? color.primary : color.text4} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const MemoryIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? color.primary : color.text4} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m16.5 16.5 4.5 4.5" />
  </svg>
);

const GearIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? color.primary : color.text4} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

/* ── Bottom Navigation Bar ── */
function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { key: "home", label: "홈", Icon: HomeIcon },
    { key: "navigate", label: "길안내", Icon: NavIcon },
    { key: "translate", label: "번역", Icon: TranslateIcon },
    { key: "memory", label: "기억", Icon: MemoryIcon },
    { key: "settings", label: "설정", Icon: GearIcon },
  ];

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        height: 60,
        backgroundColor: color.surface,
        borderTop: `1px solid ${color.border}`,
        flexShrink: 0,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {tabs.map(({ key, label, Icon }) => {
        const isActive = activeTab === key;
        return (
          <div
            key={key}
            onClick={() => onTabChange(key)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              paddingTop: 8,
              paddingBottom: 4,
              cursor: "pointer",
              transition: "opacity 0.15s",
            }}
          >
            <Icon active={isActive} />
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? color.primary : color.text4,
                letterSpacing: 0.1,
              }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </nav>
  );
}

/* ── App Shell ── */
export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [showPairing, setShowPairing] = useState(false);
  const [devMode, setDevMode] = useState(false);

  const handleNavigate = (tab) => {
    if (tab === "pairing") {
      setShowPairing(true);
    } else {
      setActiveTab(tab);
      setShowPairing(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 430,
        margin: "0 auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: color.background,
        fontFamily: "'DM Sans', -apple-system, sans-serif",
        color: color.text1,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 0 40px rgba(0,0,0,0.08)",
      }}
    >
      {/* Page Content */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {showPairing ? (
          <PairingPage onNavigate={handleNavigate} />
        ) : (
          <>
            <div style={{ display: activeTab === "home" ? "flex" : "none", flexDirection: "column", height: "100%" }}>
              <HomePage onNavigate={handleNavigate} devMode={devMode} />
            </div>
            <div style={{ display: activeTab === "navigate" ? "flex" : "none", flexDirection: "column", height: "100%" }}>
              <NavigationPage />
            </div>
            <div style={{ display: activeTab === "translate" ? "flex" : "none", flexDirection: "column", height: "100%" }}>
              <TranslationPage />
            </div>
            <div style={{ display: activeTab === "memory" ? "flex" : "none", flexDirection: "column", height: "100%" }}>
              <MemoryPage />
            </div>
            <div style={{ display: activeTab === "settings" ? "flex" : "none", flexDirection: "column", height: "100%" }}>
              <SettingsPage onNavigate={handleNavigate} devMode={devMode} setDevMode={setDevMode} />
            </div>
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      {!showPairing && (
        <BottomNav activeTab={activeTab} onTabChange={handleNavigate} />
      )}
    </div>
  );
}
