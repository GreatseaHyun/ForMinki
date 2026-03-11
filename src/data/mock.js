// Device
export const MOCK_DEVICE = {
  connected: true,
  name: "AIVY-Pro",
  btConnected: true,
  wifiDirectConnected: true,
  battery: 72,
  temperature: 38.5,
  routeState: "local",
  firmwareVersion: "1.2.0",
  activeScenario: null,
};

// Recent activity sessions
export const MOCK_SESSIONS = [
  {
    id: 1,
    mode: "navigation",
    title: "강남역 방면 도보 안내",
    date: "오늘 14:32",
    preview: "총 1.2km, 도보 15분 소요",
    tags: ["도보", "도착완료"],
  },
  {
    id: 2,
    mode: "translation",
    title: "일본어 실시간 통역",
    date: "오늘 11:20",
    preview: "4턴 대화, 듣기 2회 / 말하기 2회",
    tags: ["일본어", "대화"],
  },
  {
    id: 3,
    mode: "meeting",
    title: "프로젝트 킥오프 미팅",
    date: "어제 15:00",
    preview: "결정사항 3건, 액션아이템 5건",
    tags: ["회의", "요약완료"],
  },
  {
    id: 4,
    mode: "exercise",
    title: "저녁 러닝 5km",
    date: "어제 19:30",
    preview: "평균 페이스 6:12/km, 32분",
    tags: ["러닝", "목표달성"],
  },
  {
    id: 5,
    mode: "ocr",
    title: "레스토랑 메뉴 인식",
    date: "3일 전",
    preview: "메뉴 12항목 인식, 번역 완료",
    tags: ["메뉴", "일본어"],
  },
];

// Navigation
export const MOCK_ROUTES = [
  {
    id: 1,
    type: "walk",
    label: "도보 (최단)",
    distance: "1.2km",
    duration: "15분",
    description: "큰길 위주, 횡단보도 2개",
  },
  {
    id: 2,
    type: "walk",
    label: "도보 (큰길)",
    distance: "1.5km",
    duration: "18분",
    description: "대로변, 야간 추천",
  },
  {
    id: 3,
    type: "transit",
    label: "대중교통",
    distance: "3.2km",
    duration: "12분",
    description: "버스 472번, 3정거장",
  },
];

export const MOCK_NAV_STEPS = [
  { instruction: "전방 200m 직진", detail: "GS25 편의점 방면", remaining: "1.2km" },
  { instruction: "우회전", detail: "강남대로 방면 횡단보도", remaining: "1.0km" },
  { instruction: "좌회전 후 150m 직진", detail: "스타벅스 건물 왼쪽", remaining: "0.5km" },
  { instruction: "도착", detail: "목적지 건물 1층", remaining: "0m" },
];

// Translation
export const MOCK_CONVERSATIONS = [
  {
    id: 1,
    speaker: "them",
    original: "すみません、この近くに駅はありますか？",
    translated: "실례합니다, 이 근처에 역이 있나요?",
    time: "14:32",
  },
  {
    id: 2,
    speaker: "me",
    original: "네, 저쪽으로 200미터 가시면 됩니다.",
    translated: "はい、あちらに200メートル行けば着きます。",
    time: "14:32",
  },
  {
    id: 3,
    speaker: "them",
    original: "ありがとうございます。所要時間はどのくらいですか？",
    translated: "감사합니다. 소요 시간은 얼마나 되나요?",
    time: "14:33",
  },
  {
    id: 4,
    speaker: "me",
    original: "걸어서 3분 정도요.",
    translated: "歩いて3分くらいです。",
    time: "14:33",
  },
];

// Memory
export const MOCK_MEMORY_SESSIONS = [
  {
    id: 1,
    mode: "meeting",
    title: "프로젝트 킥오프 미팅",
    date: "2025.01.08",
    preview: "예산 5,000만원 확정, 김부장 담당, 3월 말 마감",
    tags: ["예산", "마감일", "담당자"],
  },
  {
    id: 2,
    mode: "navigation",
    title: "강남역 도보 내비게이션",
    date: "2025.01.08",
    preview: "1.2km, 15분 소요, 횡단보도 2개",
    tags: ["도보", "도착"],
  },
  {
    id: 3,
    mode: "ocr",
    title: "이자카야 메뉴 인식",
    date: "2025.01.07",
    preview: "사시미 정식 ¥2,800 (~28,000원)",
    tags: ["메뉴", "가격"],
  },
  {
    id: 4,
    mode: "exercise",
    title: "저녁 러닝 5km",
    date: "2025.01.07",
    preview: "평균 페이스 6:12, 케이던스 168 SPM",
    tags: ["러닝", "기록"],
  },
  {
    id: 5,
    mode: "translation",
    title: "일본어 길 안내 통역",
    date: "2025.01.07",
    preview: "4턴 대화, 역 방면 안내",
    tags: ["일본어", "대화"],
  },
];

export const MOCK_AI_RESPONSE = {
  query: "어제 미팅에서 예산 얼마로 결정됐어?",
  answer:
    "어제 프로젝트 킥오프 미팅에서 예산은 5,000만원으로 확정되었습니다. 김부장이 예산 집행을 담당하며, 3월 말까지 1차 결과물 제출이 마감입니다.",
  entities: [
    { type: "MONEY", value: "5,000만원" },
    { type: "PERSON", value: "김부장" },
    { type: "DATE", value: "3월 말" },
    { type: "ACTION", value: "1차 결과물 제출" },
  ],
  source: "프로젝트 킥오프 미팅 (2025.01.08 15:00)",
};

// Pairing
export const MOCK_DISCOVERED_DEVICES = [
  { id: 1, name: "AIVY-Pro", signal: -42, battery: 85 },
  { id: 2, name: "AIVY-Lite", signal: -68, battery: 62 },
];

// Settings structure
export const SETTINGS_SECTIONS = [
  {
    id: "device",
    label: "기기",
    items: [
      { key: "deviceName", label: "연결된 기기", type: "value", value: "AIVY-Pro" },
      { key: "autoConnect", label: "자동 연결", type: "toggle", value: true },
    ],
  },
  {
    id: "connection",
    label: "연결",
    items: [
      { key: "bt", label: "Bluetooth (Audio SCO)", type: "toggle", value: true },
      { key: "wifiDirect", label: "WiFi Direct (Data)", type: "toggle", value: true },
      { key: "eventTransport", label: "이벤트 전송", type: "chip", value: "wifi", options: ["WiFi", "BT"] },
    ],
  },
  {
    id: "ai",
    label: "AI 엔진",
    items: [
      { key: "cloudLLM", label: "Cloud LLM", type: "chip", value: "claude", options: ["Claude", "GPT", "Gemini"] },
      { key: "onDeviceSLM", label: "On-Device SLM", type: "value", value: "Qwen3 1.7B" },
      { key: "offlineFallback", label: "오프라인 폴백", type: "toggle", value: true },
    ],
  },
  {
    id: "safety",
    label: "안전",
    items: [
      { key: "safetyFilter", label: "안전 사전 필터", type: "toggle", value: true },
      { key: "fallDetection", label: "낙상 감지", type: "toggle", value: true },
      { key: "emergencyContact", label: "긴급 연락처", type: "value", value: "010-1234-5678" },
    ],
  },
  {
    id: "audio",
    label: "오디오 및 음성",
    items: [
      { key: "ttsSpeed", label: "TTS 속도", type: "chip", value: "normal", options: ["느림", "보통", "빠름"] },
      { key: "spatialAudio", label: "3D 공간 오디오", type: "toggle", value: true },
      { key: "wakeWord", label: "웨이크 워드", type: "toggle", value: true },
    ],
  },
  {
    id: "battery",
    label: "배터리 및 성능",
    items: [
      { key: "lowBatThreshold", label: "저전력 임계값", type: "chip", value: "20%", options: ["10%", "20%", "30%"] },
      { key: "autoCloudOffload", label: "자동 클라우드 오프로드", type: "toggle", value: true },
    ],
  },
  {
    id: "language",
    label: "언어",
    items: [
      { key: "appLanguage", label: "앱 언어", type: "chip", value: "한국어", options: ["한국어", "English", "日本語"] },
      { key: "translationTarget", label: "번역 대상 언어", type: "chip", value: "자동", options: ["자동", "EN", "JA", "ZH"] },
    ],
  },
  {
    id: "about",
    label: "정보",
    items: [
      { key: "appVersion", label: "앱 버전", type: "value", value: "1.0.0-alpha" },
      { key: "architecture", label: "아키텍처", type: "value", value: "v3 Final" },
      { key: "slmSize", label: "SLM 크기", type: "value", value: "~1 GB" },
    ],
  },
];

// Mode definitions for home grid
export const MODES = [
  { id: "navigation", label: "내비게이션", description: "도보/대중교통 안내", icon: "MapPin", available: true },
  { id: "translation", label: "실시간 번역", description: "외국어 통역", icon: "Languages", available: true },
  { id: "ocr", label: "OCR", description: "텍스트 인식", icon: "ScanText", available: false },
  { id: "exercise", label: "러닝/워킹", description: "운동 트래킹", icon: "Footprints", available: false },
  { id: "meeting", label: "회의 요약", description: "회의록 자동 생성", icon: "FileText", available: false },
  { id: "memory", label: "메모리", description: "AI 기억 검색", icon: "Brain", available: true },
];
