import { useState } from "react";

const NAV_STATE = { SEARCH: "search", ROUTE_SELECT: "route", NAVIGATING: "navigating", ARRIVED: "arrived" };

const MOCK_ROUTES = [
  { id: 1, type: "walk", label: "Fastest", distance: "1.2km", duration: "16 min", desc: "Via Sinchon Station" },
  { id: 2, type: "walk", label: "Main Road", distance: "1.4km", duration: "19 min", desc: "Avoids alleys, well-lit" },
  { id: 3, type: "transit", label: "Bus 273", distance: "3.1km", duration: "22 min", desc: "Bus → Walk 300m" },
];

const MOCK_NAV = {
  destination: "Sogang University Main Gate", totalDistance: "1.2km",
  remainingDistance: "840m", remainingTime: "11 min",
  nextTurn: "Right at intersection", nextTurnDistance: "120m",
  currentSpeed: "walking", progress: 0.3,
};

const MOCK_ARRIVAL = {
  destination: "Sogang University Main Gate", totalDistance: "1.2km",
  totalTime: "15 min 32 sec", avgSpeed: "4.7 km/h", steps: 1847,
};

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

const WalkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="5" r="2" /><path d="m10 22 2-7 3 3v6" /><path d="m14 13-2-2-4 4" />
  </svg>
);

const BusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="4" y="3" width="16" height="16" rx="2" /><path d="M4 11h16" /><circle cx="8" cy="16" r="1" /><circle cx="16" cy="16" r="1" /><path d="M4 7h16" />
  </svg>
);

const TurnRightIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const CheckCircle = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2E8B57" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
  </svg>
);

const LocationDot = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#3A7BBF" stroke="none">
    <circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="10" fill="none" stroke="#3A7BBF" strokeWidth="2" opacity="0.3" />
  </svg>
);

function MapPlaceholder({ state }) {
  return (
    <div style={{ flex: 1, backgroundColor: "#E8EEF4", position: "relative", overflow: "hidden" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.15 }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2E5E8E" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {(state === NAV_STATE.NAVIGATING || state === NAV_STATE.ROUTE_SELECT) && (
        <svg width="100%" height="100%" style={{ position: "absolute" }} viewBox="0 0 430 400" preserveAspectRatio="none">
          <path d="M 80 350 Q 120 280 150 250 L 200 200 Q 230 170 280 150 L 350 100" fill="none" stroke="#3A7BBF" strokeWidth="4" strokeLinecap="round" strokeDasharray={state === NAV_STATE.ROUTE_SELECT ? "8 6" : "none"} opacity="0.6" />
          {state === NAV_STATE.NAVIGATING && (
            <>
              <path d="M 80 350 Q 120 280 150 250" fill="none" stroke="#1B3A5C" strokeWidth="5" strokeLinecap="round" />
              <circle cx="150" cy="250" r="8" fill="#3A7BBF" stroke="white" strokeWidth="3" />
              <circle cx="150" cy="250" r="16" fill="#3A7BBF" opacity="0.15" />
            </>
          )}
          <circle cx="350" cy="100" r="6" fill="#CC3333" stroke="white" strokeWidth="2" />
        </svg>
      )}

      {state === NAV_STATE.SEARCH && (
        <div style={{ position: "absolute", top: "55%", left: "30%", display: "flex", alignItems: "center", gap: 6 }}>
          <LocationDot />
          <span style={{ fontSize: 11, color: "#3A7BBF", fontWeight: 600 }}>Current Location</span>
        </div>
      )}

      {state === NAV_STATE.ARRIVED && (
        <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: "#2E8B57", margin: "0 auto 6px", border: "3px solid white", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: "#2E8B57", backgroundColor: "white", padding: "2px 8px", borderRadius: 6 }}>Arrived</span>
        </div>
      )}
    </div>
  );
}

function RouteCard({ route, selected, onSelect }) {
  const isTransit = route.type === "transit";
  return (
    <div onClick={() => onSelect(route.id)} style={{
      display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: 12,
      border: `1.5px solid ${selected ? "#3A7BBF" : "#EEE"}`,
      backgroundColor: selected ? "#F8FBFF" : "white", cursor: "pointer", transition: "all 0.15s ease",
    }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: isTransit ? "#E3F2FD" : "#E8F5E9", display: "flex", alignItems: "center", justifyContent: "center", color: isTransit ? "#2E5E8E" : "#2E8B57" }}>
        {isTransit ? <BusIcon /> : <WalkIcon />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>{route.label}</span>
          <span style={{ fontSize: 12, color: "#999" }}>{route.distance}</span>
        </div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{route.desc}</div>
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, color: "#1B3A5C" }}>{route.duration}</div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#1B3A5C" }}>{value}</div>
      <div style={{ fontSize: 10, color: "#AAA", marginTop: 2 }}>{label}</div>
    </div>
  );
}

export default function NavigationPage() {
  const [navState, setNavState] = useState(NAV_STATE.SEARCH);
  const [searchText, setSearchText] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [navData] = useState(MOCK_NAV);

  const panelHeight = {
    [NAV_STATE.SEARCH]: 240, [NAV_STATE.ROUTE_SELECT]: 330,
    [NAV_STATE.NAVIGATING]: 200, [NAV_STATE.ARRIVED]: 300,
  };

  const handleSearch = () => { if (searchText.trim()) setNavState(NAV_STATE.ROUTE_SELECT); };
  const handleStartNavigation = () => setNavState(NAV_STATE.NAVIGATING);
  const handleArrive = () => setNavState(NAV_STATE.ARRIVED);
  const handleFinish = () => { setNavState(NAV_STATE.SEARCH); setSearchText(""); setSelectedRoute(null); };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      {/* Top bar (floating) */}
      {navState === NAV_STATE.NAVIGATING && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, padding: "12px 16px" }}>
          <div style={{ backgroundColor: "white", borderRadius: 12, padding: "10px 14px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#2E8B57", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1B3A5C" }}>Navigating</span>
            <span style={{ fontSize: 12, color: "#999", marginLeft: "auto" }}>{navData.remainingDistance} · {navData.remainingTime}</span>
          </div>
        </div>
      )}

      {/* Map */}
      <MapPlaceholder state={navState} />

      {/* Bottom Panel */}
      <div style={{
        height: panelHeight[navState], backgroundColor: "white", borderRadius: "20px 20px 0 0",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.06)", padding: "16px 20px",
        transition: "height 0.3s ease", overflow: "hidden", flexShrink: 0,
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: "#E0E0E0", margin: "0 auto 14px" }} />

        {/* SEARCH */}
        {navState === NAV_STATE.SEARCH && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1B3A5C", marginBottom: 12 }}>Where to?</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, backgroundColor: "#F5F7FA", marginBottom: 14 }}>
              <SearchIcon />
              <input type="text" placeholder="Search destination..." value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{ flex: 1, border: "none", outline: "none", backgroundColor: "transparent", fontSize: 14, color: "#333", fontFamily: "inherit" }}
              />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["Nearby cafe", "Pharmacy", "Subway station"].map((q) => (
                <div key={q} onClick={() => { setSearchText(q); setNavState(NAV_STATE.ROUTE_SELECT); }}
                  style={{ padding: "7px 14px", borderRadius: 20, backgroundColor: "#F0F0F0", fontSize: 12, color: "#666", cursor: "pointer" }}>
                  {q}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "#CCC", textAlign: "center", marginTop: 16 }}>
              Or say the destination to your AIVY device
            </div>
          </div>
        )}

        {/* ROUTE SELECT */}
        {navState === NAV_STATE.ROUTE_SELECT && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1B3A5C", marginBottom: 4 }}>
              {searchText || "Sogang University Main Gate"}
            </div>
            <div style={{ fontSize: 12, color: "#999", marginBottom: 12 }}>{MOCK_ROUTES.length} routes found</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              {MOCK_ROUTES.map((r) => <RouteCard key={r.id} route={r} selected={selectedRoute === r.id} onSelect={setSelectedRoute} />)}
            </div>
            <div onClick={selectedRoute ? handleStartNavigation : undefined} style={{
              padding: "13px 0", borderRadius: 12, backgroundColor: selectedRoute ? "#1B3A5C" : "#E0E0E0",
              color: selectedRoute ? "white" : "#AAA", fontSize: 15, fontWeight: 600, textAlign: "center",
              cursor: selectedRoute ? "pointer" : "default",
            }}>
              Start Navigation
            </div>
          </div>
        )}

        {/* NAVIGATING */}
        {navState === NAV_STATE.NAVIGATING && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: 14, backgroundColor: "#1B3A5C", marginBottom: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TurnRightIcon />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "white" }}>{navData.nextTurn}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>in {navData.nextTurnDistance}</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <Stat label="Remaining" value={navData.remainingDistance} />
              <div style={{ width: 1, backgroundColor: "#F0F0F0" }} />
              <Stat label="ETA" value={navData.remainingTime} />
              <div style={{ width: 1, backgroundColor: "#F0F0F0" }} />
              <Stat label="Total" value={navData.totalDistance} />
            </div>
            <div onClick={handleArrive} style={{ marginTop: 14, padding: "10px 0", borderRadius: 10, border: "1.5px solid #EEE", textAlign: "center", fontSize: 13, color: "#999", cursor: "pointer" }}>
              End Navigation
            </div>
          </div>
        )}

        {/* ARRIVED */}
        {navState === NAV_STATE.ARRIVED && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 14 }}>
              <CheckCircle />
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1B3A5C", marginTop: 6 }}>You've arrived</div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{MOCK_ARRIVAL.destination}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "14px", borderRadius: 14, backgroundColor: "#F8FBFF", marginBottom: 14 }}>
              <Stat label="Distance" value={MOCK_ARRIVAL.totalDistance} />
              <Stat label="Time" value={MOCK_ARRIVAL.totalTime} />
              <Stat label="Avg Speed" value={MOCK_ARRIVAL.avgSpeed} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "1.5px solid #EEE", textAlign: "center", fontSize: 13, fontWeight: 500, color: "#666", cursor: "pointer" }}>
                Save Place
              </div>
              <div onClick={handleFinish} style={{ flex: 1, padding: "12px 0", borderRadius: 10, backgroundColor: "#1B3A5C", textAlign: "center", fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer" }}>
                Done
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
