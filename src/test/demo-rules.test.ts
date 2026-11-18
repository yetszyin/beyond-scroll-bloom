import { describe, expect, it } from "vitest";
import { INITIAL_STATE, reducer } from "@/lib/app-state";
import { ASK_ORGANISER, DISCLAIMER, HEALTH_EVENT, THEMES } from "@/lib/demo-data";

describe("每日小任務", () => {
  it("完成一項送 1 朵小紅花", () => {
    const s = reducer(INITIAL_STATE, { type: "completeTask", id: "water", title: "飲水" });
    expect(s.flowers).toBe(INITIAL_STATE.flowers + 1);
  });
  it("同一項唔可以重複領獎", () => {
    const once = reducer(INITIAL_STATE, { type: "completeTask", id: "water", title: "飲水" });
    const twice = reducer(once, { type: "completeTask", id: "water", title: "飲水" });
    expect(twice.flowers).toBe(once.flowers);
    expect(twice.points).toBe(once.points);
  });
});

describe("示範報名", () => {
  it("報名只記錄喺本機狀態", () => {
    const s = reducer(INITIAL_STATE, { type: "register", activityId: HEALTH_EVENT.id, title: HEALTH_EVENT.title });
    expect(s.registrations).toEqual([HEALTH_EVENT.id]);
  });
});

describe("健康主題官方活動", () => {
  it("日期係 2026年11月25日", () => {
    expect(HEALTH_EVENT.date).toBe("2026年11月25日");
  });
  it("來源連結係房協長者安居資源中心活動日曆", () => {
    expect(HEALTH_EVENT.sourceUrl).toBe("https://erc.hkhs.com/event/page/calendar?page=1");
  });
  it("未知嘅地點、收費、名額、截止日期寫「詳情請向主辦機構查詢」", () => {
    for (const v of [HEALTH_EVENT.location, HEALTH_EVENT.fee, HEALTH_EVENT.quota, HEALTH_EVENT.deadline]) {
      expect(v).toBe(ASK_ORGANISER);
    }
    expect(ASK_ORGANISER).toBe("詳情請向主辦機構查詢");
  });
});

describe("活動主題", () => {
  it("有健康、藝術文化、音樂、園藝、義工五個主題", () => {
    expect(THEMES.map((t) => t.name)).toEqual(["健康", "藝術文化", "音樂", "園藝", "義工"]);
  });
  it("只有健康主題係官方活動，其餘係示範內容", () => {
    expect(THEMES.filter((t) => t.featured.official).map((t) => t.id)).toEqual(["health"]);
  });
  it("免責聲明字眼正確", () => {
    expect(DISCLAIMER).toBe("此為產品示範，活動資料及名額請以主辦機構最新公布為準；示範報名不會實際提交至主辦機構。");
  });
});
