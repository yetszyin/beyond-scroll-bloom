// Activity records (walk / stretch / eye) and the date maths behind the check-in calendar.
// Pure functions only so the rules can be unit-tested.

export type WorkoutType = "walk" | "run" | "stretch" | "eye";

export const WORKOUT_LABEL: Record<WorkoutType, string> = {
  walk: "散步",
  run: "跑步",
  stretch: "伸展運動",
  eye: "眼部運動",
};

export const WORKOUT_EMOJI: Record<WorkoutType, string> = {
  walk: "🚶",
  run: "🏃",
  stretch: "🧘",
  eye: "👀",
};

export interface Workout {
  id: string;
  type: WorkoutType;
  /** local date key YYYY-MM-DD */
  date: string;
  durationSec: number;
  /** walk / run only, manually entered by the user */
  distanceKm?: number;
  /** walk / run only, optionally entered from a pedometer */
  steps?: number;
  courseId?: string;
  courseTitle?: string;
  /** seeded sample record, shown with a 示範 label */
  demo?: boolean;
}

export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  r.setDate(r.getDate() + n);
  return r;
}

export function formatDateKey(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return `${y}年${m}月${d}日`;
}

export function formatDuration(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h > 0) return m ? `${h} 小時 ${m} 分鐘` : `${h} 小時`;
  if (m > 0) return r ? `${m} 分 ${r} 秒` : `${m} 分鐘`;
  return `${r} 秒`;
}

export function formatClock(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const r = String(s % 60).padStart(2, "0");
  return h > 0 ? `${h}:${m}:${r}` : `${m}:${r}`;
}

/** Distinct days with at least one completed activity in the given month (month is 0-based). */
export function monthCheckInDays(workouts: Workout[], year: number, month: number): number {
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}-`;
  return new Set(workouts.filter((w) => w.date.startsWith(prefix)).map((w) => w.date)).size;
}

/**
 * Consecutive check-in days ending today. If today has no activity yet, the streak
 * still counts up to yesterday (it is not broken until a full day is missed).
 */
export function currentStreak(workouts: Workout[], today: Date): number {
  const days = new Set(workouts.map((w) => w.date));
  let cursor = days.has(toDateKey(today)) ? today : addDays(today, -1);
  let streak = 0;
  while (days.has(toDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function workoutsOn(workouts: Workout[], dateKey: string): Workout[] {
  return workouts.filter((w) => w.date === dateKey);
}

/** Sample history relative to "today" so the calendar never looks empty in the demo. */
export function seedWorkouts(today: Date): Workout[] {
  const plan: [number, WorkoutType, number, number | undefined, string | undefined][] = [
    [1, "walk", 32 * 60, 1.8, undefined],
    [1, "eye", 4 * 60, undefined, "眼部放鬆操"],
    [2, "stretch", 8 * 60, undefined, "椅上全身伸展"],
    [3, "walk", 25 * 60, 1.5, undefined],
    [5, "eye", 4 * 60, undefined, "眼部放鬆操"],
    [6, "walk", 40 * 60, 2.3, undefined],
    [6, "stretch", 5 * 60, undefined, "肩頸放鬆"],
    [9, "walk", 20 * 60, 1.2, undefined],
    [12, "stretch", 8 * 60, undefined, "椅上全身伸展"],
  ];
  return plan.map(([ago, type, durationSec, distanceKm, courseTitle], i) => ({
    id: `seed-w${i}`,
    type,
    date: toDateKey(addDays(today, -ago)),
    durationSec,
    ...(distanceKm !== undefined ? { distanceKm } : {}),
    ...(courseTitle ? { courseTitle } : {}),
    demo: true,
  }));
}
