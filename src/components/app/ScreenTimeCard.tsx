import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BarChart3, Clock, Sparkles } from "lucide-react";

import {
  DAILY_GOAL_MINUTES,
  demoWeek,
  encouragement,
  formatMinutes,
} from "@/lib/screen-time";

/**
 * 首頁「今日螢幕使用時間」板塊。示範數據，非真實監測；
 * 語氣友善不批判，鼓勵長者建立健康的數位生活習慣。
 */
export function ScreenTimeCard() {
  const [showWeek, setShowWeek] = useState(false);
  const week = useMemo(() => demoWeek(), []);
  const today = week[week.length - 1];
  const pct = Math.min(100, Math.round((today.minutes / DAILY_GOAL_MINUTES) * 100));
  const over = today.minutes > DAILY_GOAL_MINUTES;

  return (
    <section className="app-card overflow-hidden">
      <div className="bg-gradient-forest p-5 text-primary-foreground">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Clock className="size-7" aria-hidden />
            今日螢幕使用時間
          </h2>
          <span className="rounded-full border border-primary-foreground/40 px-3 py-0.5 text-sm font-bold">
            示範數據
          </span>
        </div>

        <p className="mt-4 text-5xl font-bold leading-none tracking-wide">
          {formatMinutes(today.minutes)}
        </p>
        <p className="mt-2 text-lg text-primary-foreground/90">
          {over
            ? `比目標多咗 ${formatMinutes(today.minutes - DAILY_GOAL_MINUTES)}`
            : `距離每日目標仲有 ${formatMinutes(DAILY_GOAL_MINUTES - today.minutes)}`}
        </p>

        <div
          className="mt-4 h-4 overflow-hidden rounded-full bg-primary-foreground/20"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="今日使用時間進度"
        >
          <div
            className={`h-full rounded-full transition-[width] duration-700 ${over ? "bg-accent" : "bg-secondary"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-base text-primary-foreground/80">
          每日目標：唔超過 {formatMinutes(DAILY_GOAL_MINUTES)}
        </p>
      </div>

      <div className="space-y-3 p-5">
        <p className="flex gap-2 text-lg leading-relaxed text-foreground">
          <Sparkles className="mt-1 size-6 shrink-0 text-accent-foreground" aria-hidden />
          {encouragement(today.minutes, DAILY_GOAL_MINUTES)}
        </p>

        <p className="text-base text-muted-foreground">
          當中約 {formatMinutes(today.activeMinutes)} 用喺散步、伸展等有益身心嘅活動，做得好好！
        </p>

        {showWeek && (
          <div className="rounded-2xl border border-border bg-muted/60 p-4">
            <p className="text-lg font-bold text-primary-deep">過去 7 日（示範數據）</p>
            <ul className="mt-3 space-y-2">
              {week.map((d, i) => {
                const wd = ["日", "一", "二", "三", "四", "五", "六"][new Date(`${d.date}T00:00:00`).getDay()];
                return (
                  <li key={d.date} className="flex items-center gap-3">
                    <span className="w-12 shrink-0 text-base text-muted-foreground">
                      {i === week.length - 1 ? "今日" : i === week.length - 2 ? "昨日" : `週${wd}`}
                    </span>
                    <span className="h-3 flex-1 overflow-hidden rounded-full bg-border">
                      <span
                        className="block h-full rounded-full bg-primary transition-[width] duration-500"
                        style={{ width: `${Math.min(100, (d.minutes / Math.max(...week.map((w) => w.minutes)))) * 100}%` }}
                      />
                    </span>
                    <span className="w-24 shrink-0 text-right text-base font-bold text-primary-deep">
                      {formatMinutes(d.minutes)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-base text-muted-foreground">
              小提示：數字只係參考，最重要係用得放心、活得充實。
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={() => setShowWeek((v) => !v)}
            className="tap inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-secondary px-4 text-lg font-bold text-secondary-foreground"
            aria-expanded={showWeek}
          >
            <BarChart3 className="size-6" aria-hidden />
            {showWeek ? "收起每週報告" : "睇每週使用報告"}
          </button>
          <Link
            to="/challenges"
            className="tap inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-accent-soft px-4 text-lg font-bold text-accent-foreground"
          >
            放低手機做運動 ›
          </Link>
        </div>
      </div>
    </section>
  );
}
