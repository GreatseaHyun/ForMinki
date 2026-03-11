// icons.jsx — AIVY Unified Icon Library
// Lucide React (https://lucide.dev) — MIT License
// Phosphor Icons (https://phosphoricons.com) — MIT License

import aivyIconSrc from "./icon-512x512.png";
import {
  CalendarCheck,
  Map,
  ScanText,
  Languages,
  Sparkles,
  Hand,
  Footprints,
  Lock,
  Share2,
  Download,
  Trash2,
  ChevronDown,
  Play,
  User,
  Clock,
} from "lucide-react";
import { PersonSimpleRun } from "@phosphor-icons/react";

/* ── AIVY Brand Logo ── */
export const AivyLogoIcon = ({ size = 36 }) => (
  <img src={aivyIconSrc} width={size} height={size} style={{ objectFit: "contain", display: "block" }} alt="AIVY" />
);

/* ── Scenario / Category Icons ── */

export const MeetingIcon     = ({ size = 20, color = "currentColor" }) => <CalendarCheck    size={size} color={color} strokeWidth={1.75} />;
export const MapRouteIcon    = ({ size = 20, color = "currentColor" }) => <Map               size={size} color={color} strokeWidth={1.75} />;
export const ScanTextIcon    = ({ size = 20, color = "currentColor" }) => <ScanText          size={size} color={color} strokeWidth={1.75} />;
export const ActivityIcon    = ({ size = 20, color = "currentColor" }) => <PersonSimpleRun   size={size} color={color} weight="regular" />;
export const LanguagesIcon   = ({ size = 20, color = "currentColor" }) => <Languages         size={size} color={color} strokeWidth={1.75} />;
export const SparklesIcon    = ({ size = 20, color = "currentColor" }) => <Sparkles          size={size} color={color} strokeWidth={1.75} />;
export const PointerIcon     = ({ size = 20, color = "currentColor" }) => <Hand              size={size} color={color} strokeWidth={1.75} />;
export const HandWaveIcon    = ({ size = 20, color = "currentColor" }) => <Hand              size={size} color={color} strokeWidth={1.75} />;
export const FootstepsIcon   = ({ size = 20, color = "currentColor" }) => <Footprints        size={size} color={color} strokeWidth={1.75} />;

/* ── UI Icons ── */

export const LockIcon        = ({ size = 14, color = "currentColor" }) => <Lock         size={size} color={color} strokeWidth={2} />;
export const ShareIcon       = ({ size = 18, color = "currentColor" }) => <Share2        size={size} color={color} strokeWidth={1.75} />;
export const ExportIcon      = ({ size = 18, color = "currentColor" }) => <Download      size={size} color={color} strokeWidth={1.75} />;
export const TrashIcon       = ({ size = 18, color = "currentColor" }) => <Trash2        size={size} color={color} strokeWidth={1.75} />;
export const PlayFilledIcon  = ({ size = 20, color = "currentColor" }) => <Play          size={size} color={color} fill={color} strokeWidth={0} />;
export const UserIcon        = ({ size = 16, color = "currentColor" }) => <User          size={size} color={color} strokeWidth={1.75} />;
export const ClockIcon       = ({ size = 14, color = "currentColor" }) => <Clock         size={size} color={color} strokeWidth={2} />;

export const ChevronDownIcon = ({ size = 18, color = "currentColor", rotate = false }) => (
  <ChevronDown
    size={size}
    color={color}
    strokeWidth={2}
    style={{ transition: "transform 0.25s ease", transform: rotate ? "rotate(180deg)" : "rotate(0deg)" }}
  />
);

/* ── Icon color palette ── */
export const iconColors = {
  meeting:     { fg: "#4338CA", bg: "#EEF2FF" },
  navigation:  { fg: "#0D9488", bg: "#F0FDFA" },
  ocr:         { fg: "#D97706", bg: "#FFFBEB" },
  exercise:    { fg: "#059669", bg: "#ECFDF5" },
  translation: { fg: "#2563EB", bg: "#EFF6FF" },
  memory:      { fg: "#7C3AED", bg: "#F5F3FF" },
  gesture:     { fg: "#EA580C", bg: "#FFF7ED" },
  device:      { fg: "#6366F1", bg: "#EEF2FF" },
};

/* ── Get icon by session type ── */
export function getIconForType(type) {
  switch (type) {
    case "meeting":     return MeetingIcon;
    case "navigation":  return MapRouteIcon;
    case "ocr":         return ScanTextIcon;
    case "exercise":    return ActivityIcon;
    case "translation": return LanguagesIcon;
    case "memory":      return SparklesIcon;
    default:            return SparklesIcon;
  }
}
