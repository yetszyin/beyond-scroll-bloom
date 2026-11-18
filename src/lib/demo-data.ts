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

export interface CourseStep {
  text: string;
  seconds: number;
}

export interface Course {
  id: string;
  type: "stretch" | "eye";
  title: string;
  minutes: number;
  level: string;
  summary: string;
  tips: string[];
  steps: CourseStep[];
  /** Real video URL once available. Until then the player shows a clearly-labelled placeholder. */
  videoUrl?: string;
}

export const COURSES: Course[] = [
  {
    id: "stretch-chair",
    type: "stretch",
    title: "椅上全身伸展",
    minutes: 8,
    level: "入門・坐低做",
    summary: "坐喺有靠背嘅椅度，由頸到腳慢慢伸展，郁動全身關節。",
    tips: ["揀一張穩陣、有靠背嘅椅", "每個動作慢慢做，唔好閉氣", "如有任何不適，請即停止"],
    steps: [
      { text: "坐直，雙腳踏實地面，慢慢深呼吸", seconds: 60 },
      { text: "頭部慢慢向左、向右轉", seconds: 60 },
      { text: "雙肩向後轉圈", seconds: 60 },
      { text: "雙手舉高，向左右兩邊側伸", seconds: 90 },
      { text: "輪流伸直雙腿，腳尖向上", seconds: 90 },
      { text: "腳踝順時針、逆時針轉圈", seconds: 60 },
      { text: "放鬆雙手，慢慢深呼吸收操", seconds: 60 },
    ],
  },
  {
    id: "stretch-shoulder",
    type: "stretch",
    title: "肩頸放鬆",
    minutes: 5,
    level: "入門・坐企都得",
    summary: "幾個簡單動作，郁吓膊頭同頸。",
    tips: ["動作幅度以舒服為準", "保持自然呼吸"],
    steps: [
      { text: "坐直，膊頭放鬆向下", seconds: 45 },
      { text: "頭部慢慢側向左邊，再到右邊", seconds: 60 },
      { text: "膊頭向上提起，再慢慢放低", seconds: 60 },
      { text: "雙手交叉向前推，背部微微拱起", seconds: 60 },
      { text: "慢慢深呼吸，放鬆收操", seconds: 75 },
    ],
  },
  {
    id: "stretch-legs",
    type: "stretch",
    title: "坐姿腿部伸展",
    minutes: 6,
    level: "入門・坐低做",
    summary: "坐住都可以郁動雙腿，適合行路前熱身。",
    tips: ["坐喺椅嘅前半部", "手可以扶住椅邊保持平衡"],
    steps: [
      { text: "坐喺椅前半部，雙腳踏地", seconds: 45 },
      { text: "輪流提起膝頭，好似原地踏步", seconds: 90 },
      { text: "伸直右腿，腳尖向上，再換左腿", seconds: 90 },
      { text: "腳跟、腳尖輪流踮起", seconds: 60 },
      { text: "放鬆雙腿，深呼吸收操", seconds: 75 },
    ],
  },
  {
    id: "eye-basic",
    type: "eye",
    title: "眼部放鬆操",
    minutes: 3,
    level: "入門・隨時做",
    summary: "放低手機，跟住做幾個簡單動作，讓眼睛休息一陣。",
    tips: ["做之前先放低手機或平板", "動作輕柔，唔好用力按眼"],
    steps: [
      { text: "輕輕眨眼 10 次", seconds: 30 },
      { text: "望向遠處景物", seconds: 40 },
      { text: "眼球慢慢向上、下、左、右望", seconds: 40 },
      { text: "眼球慢慢轉圈", seconds: 40 },
      { text: "搓暖雙手，輕輕敷住雙眼", seconds: 30 },
    ],
  },
  {
    id: "eye-focus",
    type: "eye",
    title: "遠近對焦練習",
    minutes: 4,
    level: "入門・隨時做",
    summary: "輪流望近處同遠處，讓眼睛轉換一下焦點。",
    tips: ["喺光線充足、安全嘅地方做", "如感到不適請即停止"],
    steps: [
      { text: "伸出手指放喺面前，望住指尖", seconds: 40 },
      { text: "轉望窗外遠處景物", seconds: 40 },
      { text: "再望返指尖", seconds: 40 },
      { text: "再望遠處，重複幾次", seconds: 60 },
      { text: "閉上眼睛，慢慢深呼吸", seconds: 60 },
    ],
  },
];

export function getCourse(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

export function courseSeconds(c: Course): number {
  return c.steps.reduce((sum, s) => sum + s.seconds, 0);
}

export interface DemoFeedPost {
  id: string;
  author: string;
  type: "walk" | "stretch" | "eye";
  when: string;
  durationSec: number;
  distanceKm?: number;
  courseTitle?: string;
  text: string;
  baseLikes: number;
}

export const DEMO_FEED_POSTS: DemoFeedPost[] = [
  {
    id: "demo-feed-lee",
    author: "李婆婆",
    type: "walk",
    when: "今日 08:15",
    durationSec: 35 * 60,
    distanceKm: 2.1,
    text: "朝早同老伴行公園，空氣好好！",
    baseLikes: 6,
  },
  {
    id: "demo-feed-wong",
    author: "黃姨姨",
    type: "stretch",
    when: "昨日 16:40",
    durationSec: 8 * 60,
    courseTitle: "椅上全身伸展",
    text: "睇完電視跟住做，膊頭鬆咗好多。",
    baseLikes: 4,
  },
  {
    id: "demo-feed-cheung",
    author: "張伯伯",
    type: "eye",
    when: "昨日 21:05",
    durationSec: 3 * 60,
    courseTitle: "眼部放鬆操",
    text: "放低手機休息吓，聽日再嚟！",
    baseLikes: 3,
  },
];
