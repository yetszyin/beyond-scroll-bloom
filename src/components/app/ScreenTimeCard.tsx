import { Clock, Sparkles } from "lucide-react";

import {
  DAILY_GOAL_MINUTES,
  demoToday,
  encouragement,
  formatMinutes,
} from "@/lib/screen-time";

/**
 * 首頁「今日螢幕使用時間」板塊。示範數據，非真實監測；
 * 語氣友善不批判，鼓勵長者建立健康的數位生活習慣。
 */
export function ScreenTimeCard() {
  const today = demoToday();
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

        <Link
          to="/challenges"
          className="tap inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-accent-soft px-4 text-lg font-bold text-accent-foreground"
        >
          放低手機做運動 ›
        </Link>
      </div>
    </section>
  );
}
