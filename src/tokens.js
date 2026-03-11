// tokens.js — AIVY Design System Tokens

export const color = {
  // Core brand
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

  // Brand logo tones
  brandNavy: "#1B3654",
  brandBlue: "#6B9FD4",
};

export const font = {
  // Display font (Plus Jakarta Sans) for headings
  display: "'Plus Jakarta Sans', 'DM Sans', -apple-system, sans-serif",
  // Body font (DM Sans) for everything else
  body: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

  h1: { size: 24, weight: 800, letterSpacing: -0.5 },
  h2: { size: 20, weight: 700, letterSpacing: -0.3 },
  h3: { size: 16, weight: 600 },
  bodyText: { size: 14, weight: 400, lineHeight: 1.5 },
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

export const shadow = {
  sm: "0 1px 3px rgba(27,58,92,0.06), 0 1px 2px rgba(27,58,92,0.04)",
  md: "0 4px 12px rgba(27,58,92,0.08), 0 1px 3px rgba(27,58,92,0.04)",
  lg: "0 8px 24px rgba(27,58,92,0.10), 0 2px 6px rgba(27,58,92,0.04)",
  nav: "0 -4px 16px rgba(27,58,92,0.06)",
};
