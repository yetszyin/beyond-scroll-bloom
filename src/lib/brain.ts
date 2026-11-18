// 動動腦筋專區的資料與規則。純前端示範，題庫內置，紀錄只存於本機。
// 純函數拆出來方便單元測試。

export type BrainGameId = "memory" | "logic" | "trivia" | "spot";

export interface BrainGameMeta {
  id: BrainGameId;
  title: string;
  subtitle: string;
  emoji: string;
  tone: string;
  howto: string;
}

export const BRAIN_GAMES: BrainGameMeta[] = [
  {
    id: "memory",
    title: "記憶挑戰",
    subtitle: "睇一組圖案，然後憑記憶答問題",
    emoji: "🧠",
    tone: "bg-sage-soft text-secondary-foreground",
    howto: "第一步：睇清楚排好嘅圖案，俾 15 秒時間你記住。第二步：圖案會收起，答吓頭先見到乜。",
  },
  {
    id: "logic",
    title: "邏輯挑戰",
    subtitle: "簡單推理同數字排律",
    emoji: "🔢",
    tone: "bg-sky-soft text-foreground",
    howto: "每題有一個小謎題，睇完揀一個答案。答錯都唔緊要，會即刻解釋。",
  },
  {
    id: "trivia",
    title: "常識問答",
    subtitle: "香港生活、文化同日常知識",
    emoji: "💡",
    tone: "bg-accent-soft text-accent-foreground",
    howto: "四揀一嘅問答題，全部同香港日常生活有關，答完有簡短解釋。",
  },
  {
    id: "spot",
    title: "眼力挑戰",
    subtitle: "喺圖案入面搵出唔同嗰個",
    emoji: "🔍",
    tone: "bg-flower-soft text-flower",
    howto: "幾個圖案入面有一個同其他唔同，一眼就認得出嘅話就最叻！",
  },
];

export function gameMeta(id: BrainGameId): BrainGameMeta {
  return BRAIN_GAMES.find((g) => g.id === id) ?? BRAIN_GAMES[0];
}

// ---------- 記憶挑戰 ----------

export interface MemoryRound {
  /** emoji sequence the user must remember */
  sequence: string[];
  /** which position (0-based) the question asks about */
  askIndex: number;
  options: string[];
}

export function buildMemoryRounds(count: number, seed: number): MemoryRound[] {
  const rounds: MemoryRound[] = [];
  for (let i = 0; i < count; i += 1) {
    const s = mulberry(seed + i * 97);
    const seqLen = 3 + (i % 3); // 3 to 5 items
    const pool = ["🍎", "🌻", "🐦", "🍵", "🪑", "☂️", "🥕", "🐟"];
    const seq: string[] = [];
    for (let k = 0; k < seqLen; k += 1) {
      seq.push(pool[Math.floor(s() * pool.length)]);
    }
    const askIndex = Math.floor(s() * seqLen);
    const answer = seq[askIndex];
    const wrong = pool.filter((p) => p !== answer).sort(() => s() - 0.5).slice(0, 2);
    const options = [answer, ...wrong].sort(() => s() - 0.5);
    rounds.push({ sequence: seq, askIndex, options });
  }
  return rounds;
}

// ---------- 邏輯挑戰 ----------

export interface ChoiceQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explain: string;
}

export const LOGIC_QUESTIONS: ChoiceQuestion[] = [
  {
    question: "2、4、6、8，跟住落嚟應該係？",
    options: ["9", "10", "12", "14"],
    answerIndex: 1,
    explain: "每次加 2：2、4、6、8、10。",
  },
  {
    question: "一打雞蛋有 12 隻，食咗 5 隻，仲剩幾多隻？",
    options: ["5 隻", "6 隻", "7 隻", "8 隻"],
    answerIndex: 2,
    explain: "12 − 5 = 7，仲剩 7 隻。",
  },
  {
    question: "小明排第 3，佢前面有幾多人？",
    options: ["1 人", "2 人", "3 人", "4 人"],
    answerIndex: 1,
    explain: "排第 3 即係前面有 2 個人。",
  },
  {
    question: "1、2、4、8，跟住落嚟每個數都係前一個乘 2，下一個係？",
    options: ["10", "12", "16", "24"],
    answerIndex: 2,
    explain: "8 乘 2 等於 16。",
  },
  {
    question: "3 個蘋果分俾 3 個人，每人 1 個，啱啱好分完，啱唔啱？",
    options: ["啱", "唔啱"],
    answerIndex: 0,
    explain: "3 除以 3 等於 1，每人剛好一個。",
  },
];

// ---------- 常識問答（香港） ----------

export const TRIVIA_QUESTIONS: ChoiceQuestion[] = [
  {
    question: "香港著名嘅「天星小輪」主要來往哪兩個地方？",
    options: ["尖沙咀 — 中環", "觀塘 — 北角", "深水埗 — 大澳", "屯門 — 沙田"],
    answerIndex: 0,
    explain: "天星小輪行走維多利亞港，來往尖沙咀同中環一帶，係百年歷史嘅交通工具。",
  },
  {
    question: "以下邊個係香港嘅地質公園景點？",
    options: ["獅子山", "萬宜水庫東壩", "大笨象山", "青馬大橋"],
    answerIndex: 1,
    explain: "西貢萬宜水庫東壩一帶嘅六角形岩柱係香港地質公園嘅標誌景點。",
  },
  {
    question: "傳統飲茶「一盅兩件」嘅「一盅」係指乜嘢？",
    options: ["一盅飯", "一盅茶", "一盅湯", "一盅糖水"],
    answerIndex: 1,
    explain: "「一盅」係一盅茶，「兩件」係兩籠點心。",
  },
  {
    question: "香港最早嘅鐵路系統（九廣鐵路英段）喺邊一年通車？",
    options: ["1910 年", "1935 年", "1955 年", "1979 年"],
    answerIndex: 0,
    explain: "九廣鐵路英段喺 1910 年通車，當年由尖沙咀去羅湖。",
  },
  {
    question: "飲早茶時俾人斟茶，通常會用幾隻手指叩枱表示多謝？",
    options: ["一隻", "兩隻", "三隻", "五隻"],
    answerIndex: 2,
    explain: "傳統用三隻手指輕叩枱面，代表「叩謝」之意。",
  },
  {
    question: "長洲太平清蘸最著名嘅活動係？",
    options: ["搶包山", "舞火龍", "賽龍舟", "放天燈"],
    answerIndex: 0,
    explain: "長洲太平清蘸嘅「搶包山」比賽最為人熟悉；舞火龍係大坑中秋習俗。",
  },
];

// ---------- 眼力挑戰 ----------

export interface SpotRound {
  grid: string[];
  /** index of the odd one out */
  oddIndex: number;
  /** what makes it odd, e.g. "茄汁豆入面混咗一粒提子" */
  hint: string;
}

export function buildSpotRounds(count: number, seed: number): SpotRound[] {
  const pairs: [string, string, string][] = [
    ["🍎", "🍏", "紅蘋果入面混咗一個青蘋果"],
    ["🌞", "🌕", "太陽入面混咗一個月亮"],
    ["🐶", "🐺", "狗狗入面混咗一隻狼"],
    ["🍵", "☕", "茶杯入面混咗一杯咖啡"],
    ["🚌", "🚐", "巴士入面混咗一架小巴"],
  ];
  const rounds: SpotRound[] = [];
  for (let i = 0; i < count; i += 1) {
    const [base, odd, hint] = pairs[i % pairs.length];
    const s = mulberry(seed + i * 131);
    const size = 6 + (i % 2) * 3; // 6 or 9 cells
    const grid = Array.from({ length: size }, () => base);
    const oddIndex = Math.floor(s() * size);
    grid[oddIndex] = odd;
    rounds.push({ grid, oddIndex, hint });
  }
  return rounds;
}

// ---------- 進度紀錄（本機示範） ----------

export interface BrainResult {
  gameId: BrainGameId;
  date: string;
  score: number;
  total: number;
}

export function brainProgress(results: BrainResult[]) {
  const plays = results.length;
  const days = new Set(results.map((r) => r.date)).size;
  const perfect = results.filter((r) => r.score === r.total).length;
  return { plays, days, perfect };
}

export function brainEncouragement(score: number, total: number): string {
  if (score === total) return "全部答啱！腦筋好靈活，繼續保持！";
  if (score >= total / 2) return "做得唔錯，動咗腦就已經係贏！聽日再嚟玩吓。";
  return "唔緊要，動動腦筋最重要係好玩，聽日再試一次。";
}

// ---------- helpers ----------

/** tiny deterministic PRNG so demo rounds are stable within a day */
function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function dailyGameIndex(d: Date): BrainGameId {
  const day = Math.floor(d.getTime() / 86400000);
  return BRAIN_GAMES[day % BRAIN_GAMES.length].id;
}
