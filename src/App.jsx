import { Routes, Route, useLocation } from "react-router-dom";
import { DeviceProvider } from "./contexts/DeviceContext";
import BottomNav from "./components/layout/BottomNav";
import Home from "./pages/Home";
import Navigation from "./pages/Navigation";
import Translation from "./pages/Translation";
import Memory from "./pages/Memory";
import Activity from "./pages/Activity";
import Pairing from "./pages/Pairing";
import Settings from "./pages/Settings";

const FULLSCREEN_ROUTES = ["/navigation", "/translation", "/pairing"];

export default function App() {
  const location = useLocation();
  const showNav = !FULLSCREEN_ROUTES.includes(location.pathname);

  return (
    <DeviceProvider>
      <div className="flex flex-col min-h-dvh">
        <div className={`flex-1 ${showNav ? "pb-16" : ""}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/memory" element={<Memory />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/navigation" element={<Navigation />} />
            <Route path="/translation" element={<Translation />} />
            <Route path="/pairing" element={<Pairing />} />
          </Routes>
        </div>
        {showNav && <BottomNav />}
      </div>
    </DeviceProvider>
  );
}
