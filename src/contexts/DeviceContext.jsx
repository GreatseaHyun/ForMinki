import { createContext, useContext, useState } from "react";
import { MOCK_DEVICE } from "../data/mock";

const DeviceContext = createContext(null);

export function DeviceProvider({ children }) {
  const [device, setDevice] = useState(MOCK_DEVICE);

  const updateDevice = (updates) => {
    setDevice((prev) => ({ ...prev, ...updates }));
  };

  return (
    <DeviceContext.Provider value={{ device, updateDevice }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const ctx = useContext(DeviceContext);
  if (!ctx) throw new Error("useDevice must be used within DeviceProvider");
  return ctx;
}
