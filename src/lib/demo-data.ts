// All content shown in the demo. Only the health activity is a real, sourced event;
// everything else is clearly labelled sample content.

export const DISCLAIMER =
  "此為產品示範，活動資料及名額請以主辦機構最新公布為準；示範報名不會實際提交至主辦機構。";

export const ASK_ORGANISER = "詳情請向主辦機構查詢";

export type ThemeId = "health" | "arts" | "music" | "garden" | "volunteer";

export interface Activity {
  id: string;
  themeId: ThemeId;
  title: string;
  organiser: string;
  date: string;
  intro: string;
  time: string;
  location: string;
  fee: string;
  quota: string;
  deadline: string;
  /** true = real event from an official source; false = fictional sample for the demo */
  official: boolean;
  sourceUrl?: string;
}

export interface Theme {
  id: ThemeId;
  name: string;
  tagline: string;
  tone: "sage" | "accent" | "sky" | "lilac" | "flower";
  featured: Activity;
  /** how many locked "coming soon" slots to show under the featured activity */
  lockedSlots: number;
}

const SAMPLE_INFO = "示範內容，暫無實際安排";

export const HEALTH_EVENT: Activity = {
  id: "hkhs-sarcopenia-talk",
  themeId: "health",
  title: "「食出肌肉－認識肌少症與長者營養」講座",
  organiser: "香港房協長者安居資源中心",
  date: "2026年11月25日",
  intro: "認識肌少症與長者營養，了解日常飲食與肌肉健康。",
  time: ASK_ORGANISER,
  location: ASK_ORGANISER,
  fee: ASK_ORGANISER,
  quota: ASK_ORGANISER,
  deadline: ASK_ORGANISER,
  official: true,
  sourceUrl: "https://erc.hkhs.com/event/page/calendar?page=1",
};

function sample(id: string, themeId: ThemeId, title: string, intro: string): Activity {
  return {
    id,
    themeId,
    title,
    organiser: "示範內容（非真實主辦機構）",
    date: SAMPLE_INFO,
    intro,
    time: SAMPLE_INFO,
    location: SAMPLE_INFO,
    fee: SAMPLE_INFO,
    quota: SAMPLE_INFO,
    deadline: SAMPLE_INFO,
    official: false,
  };
}

export const THEMES: Theme[] = [
  {
    id: "health",
    name: "健康",
    tagline: "食得好、郁得多",
    tone: "sage",
    featured: HEALTH_EVENT,
    lockedSlots: 3,
  },
  {
    id: "arts",
    name: "藝術文化",
    tagline: "畫畫寫字，陶冶性情",
    tone: "accent",
    featured: sample(
      "sample-arts",
      "arts",
      "水彩小品體驗（示範活動）",
      "示範用活動：用簡單水彩畫出身邊小事物，享受慢活時光。",
    ),
    lockedSlots: 3,
  },
  {
    id: "music",
    name: "音樂",
    tagline: "一齊唱返啲懷舊金曲",
    tone: "sky",
    featured: sample(
      "sample-music",
      "music",
      "懷舊金曲合唱小組（示範活動）",
      "示範用活動：同街坊一齊唱歌，練練中氣、開心減壓。",
    ),
    lockedSlots: 3,
  },
  {
    id: "garden",
    name: "園藝",
    tagline: "種番盆綠色好心情",
    tone: "lilac",
    featured: sample(
      "sample-garden",
      "garden",
      "窗台香草種植入門（示範活動）",
      "示範用活動：學識喺屋企窗台種薄荷、九層塔等香草。",
    ),
    lockedSlots: 3,
  },
  {
    id: "volunteer",
    name: "義工",
    tagline: "助人自助，生活更有意義",
    tone: "flower",
    featured: sample(
      "sample-volunteer",
      "volunteer",
      "社區關懷探訪體驗（示範活動）",
      "示範用活動：了解點樣陪伴身邊有需要嘅長者街坊。",
    ),
    lockedSlots: 3,
  },
];

export function getTheme(id: string): Theme | undefined {
  return THEMES.find((t) => t.id === id);
}

export function getActivity(id: string): Activity | undefined {
  return THEMES.map((t) => t.featured).find((a) => a.id === id);
}

export interface DailyTask {
  id: string;
  title: string;
  hint: string;
  emoji: string;
}

export const DAILY_TASKS: DailyTask[] = [
  { id: "water", title: "飲一杯暖水", hint: "慢慢飲，潤吓喉", emoji: "💧" },
  { id: "chat", title: "同屋企人或朋友傾偈 5 分鐘", hint: "打個電話問候吓", emoji: "☎️" },
  { id: "sun", title: "落街曬太陽 10 分鐘", hint: "記得帶定帽同水", emoji: "☀️" },
  { id: "rest-eyes", title: "放低手機，望遠 20 秒", hint: "讓眼睛休息一陣", emoji: "👀" },
];

export const FRIENDS = [
  { id: "lee", name: "李婆婆", note: "晨運好拍檔" },
  { id: "wong", name: "黃姨姨", note: "合唱團團友" },
  { id: "cheung", name: "張伯伯", note: "行山老友記" },
  { id: "ho", name: "何太", note: "樓下街坊" },
];

export const DEMO_BUDDY_POST = {
  id: "demo-post-lee",
  author: "李婆婆",
  authorNote: "示範用戶",
  activityId: HEALTH_EVENT.id,
  message:
    "11月25日想去聽「食出肌肉」講座，有冇街坊想一齊去？可以約定喺屋苑門口等齊再出發 😊",
  postedAgo: "2 小時前",
  baseJoined: 2,
};

/** Demo-only screen time numbers. Never presented as real monitoring. */
export const DEMO_SCREEN_TIME = {
  totalMinutes: 135,
  goalMinutes: 120,
  breakdown: [
    { label: "視像通話", minutes: 35 },
    { label: "睇新聞", minutes: 40 },
    { label: "短片", minutes: 60 },
  ],
};

export function formatMinutes(m: number): string {
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h === 0) return `${r} 分鐘`;
  if (r === 0) return `${h} 小時`;
  return `${h} 小時 ${r} 分`;
}
