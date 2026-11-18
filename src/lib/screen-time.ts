// 示範用螢幕使用時間數據。全部為前端模擬，並非真實監測。

export interface DayScreenTime {
  /** YYYY-MM-DD */
  date: string;
  /** 當日手機使用總分鐘數 */
  minutes: number;
  /** 當日用於益腦、運動等主動活動的分鐘數（示範值） */
  activeMinutes: number;
}

export const DAILY_GOAL_MINUTES = 120;

export function formatMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m} 分鐘`;
  if (m === 0) return `${h} 小時`;
  return `${h} 小時 ${m} 分鐘`;
}

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 依今天日期生成最近 7 天的示範數據（今天排最後）。 */
export function demoWeek(daysOffsetToday = 0): DayScreenTime[] {
  const base = new Date();
  base.setDate(base.getDate() + daysOffsetToday);
  const pattern = [95, 140, 110, 165, 88, 122, 0];
  return pattern.map((minutes, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() - (6 - i));
    const isToday = i === 6;
    return {
      date: dateKey(d),
      minutes: isToday ? 96 : minutes,
      activeMinutes: isToday ? 41 : Math.round(minutes * 0.35),
    };
  });
}

/** 友善、不批判的鼓勵語句，按使用情況挑選。 */
export function encouragement(todayMinutes: number, goal: number): string {
  if (todayMinutes <= goal * 0.5) {
    return "今日用得真節制！多出來的時間，正好做做自己喜歡的事。";
  }
  if (todayMinutes <= goal) {
    return "進度良好！記得每隔一陣就放低手機，望望遠處、伸展一下。";
  }
  return "用得稍為多咗少少，唔緊要，而家放低手機做做眼部運動，或者出去散散步都唔遲。";
}
