// tokens.js — AIVY Design System Tokens

export const color = {
  // Core
  primary: "#1B3A5C",
  primaryLight: "#E8EEF4",
  accent: "#2C7BE5",
  accentLight: "#EBF3FD",

  // Semantic
  positive: "#1A8754",
  positiveLight: "#E6F4ED",
  warning: "#D97706",
  warningLight: "#FEF3C7",
  danger: "#DC2626",
  dangerLight: "#FEE2E2",

  // Neutrals
  text1: "#1A1A2E",
  text2: "#4A4A5A",
  text3: "#7A7A8A",
  text4: "#A0A0B0",
  border: "#E5E5EA",
  surface: "#FFFFFF",
  background: "#F7F7FA",
  backgroundAlt: "#F0F0F5",
};

export const font = {
  h1: { size: 24, weight: 700, letterSpacing: -0.5 },
  h2: { size: 20, weight: 700, letterSpacing: -0.3 },
  h3: { size: 16, weight: 600 },
  body: { size: 14, weight: 400, lineHeight: 1.5 },
  caption: { size: 12, weight: 500, lineHeight: 1.4 },
  tiny: { size: 11, weight: 400, lineHeight: 1.3 },
  label: { size: 11, weight: 600, letterSpacing: 0.5 },
};

export const space = {
  page: 20,
  card: 16,
  gap: 12,
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32,
};

export const radius = {
  sm: 8, md: 12, lg: 16, xl: 20, full: 9999,
};
