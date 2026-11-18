import { describe, expect, it } from "vitest";
import { INITIAL_STATE, reducer } from "@/lib/app-state";
import { ASK_ORGANISER, DISCLAIMER, HEALTH_EVENT, THEMES } from "@/lib/demo-data";
import { currentStreak, monthCheckInDays, type Workout } from "@/lib/workouts";

const walk: Workout = { id: "w1", type: "walk", date: "2026-11-18", durationSec: 1500, distanceKm: 1.5 };

describe("活動紀錄同分享", () => {
  it("散步紀錄包含手動輸入距離", () => {
    const s = reducer(INITIAL_STATE, { type: "addWorkout", workout: walk });
    expect(s.workouts[0]?.distanceKm).toBe(1.5);
  });
  it("分享至朋友圈會產生 App 內貼文，帶齊時長、距離同文字", () => {
    let s = reducer(INITIAL_STATE, { type: "addWorkout", workout: walk });
    s = reducer(s, { type: "shareWorkout", workoutId: "w1", text: "今日精神好！" });
    expect(s.feedPosts[0]).toMatchObject({ type: "walk", durationSec: 1500, distanceKm: 1.5, text: "今日精神好！" });
  });
  it("暫不分享就唔會有貼文", () => {
    const s = reducer(INITIAL_STATE, { type: "addWorkout", workout: walk });
    expect(s.feedPosts).toHaveLength(0);
  });
});

describe("打卡日曆", () => {
  const ws: Workout[] = [
    { id: "a", type: "walk", date: "2026-11-18", durationSec: 60 },
    { id: "b", type: "eye", date: "2026-11-17", durationSec: 60 },
    { id: "c", type: "stretch", date: "2026-11-17", durationSec: 60 },
    { id: "d", type: "walk", date: "2026-11-15", durationSec: 60 },
    { id: "e", type: "walk", date: "2026-10-31", durationSec: 60 },
  ];
  it("本月打卡日數按日計，同日多項只計一日", () => {
    expect(monthCheckInDays(ws, 2026, 10)).toBe(3);
  });
  it("連續打卡天數由今日向前數", () => {
    expect(currentStreak(ws, new Date(2026, 10, 18))).toBe(2);
  });
  it("今日未打卡時，連續天數計到昨日", () => {
    expect(currentStreak(ws, new Date(2026, 10, 19))).toBe(2);
  });
});

describe("健康主題官方活動", () => {
  it("日期同來源連結正確", () => {
    expect(HEALTH_EVENT.date).toBe("2026年11月25日");
    expect(HEALTH_EVENT.sourceUrl).toBe("https://erc.hkhs.com/event/page/calendar?page=1");
  });
  it("未知資料寫「詳情請向主辦機構查詢」", () => {
    for (const v of [HEALTH_EVENT.location, HEALTH_EVENT.fee, HEALTH_EVENT.quota, HEALTH_EVENT.deadline]) {
      expect(v).toBe(ASK_ORGANISER);
    }
  });
  it("只有健康主題係官方活動", () => {
    expect(THEMES.filter((t) => t.featured.official).map((t) => t.id)).toEqual(["health"]);
  });
  it("免責聲明字眼正確", () => {
    expect(DISCLAIMER).toBe("此為產品示範，活動資料及名額請以主辦機構最新公布為準；示範報名不會實際提交至主辦機構。");
  });
});
