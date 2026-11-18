import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, ChevronRight, Trophy, CalendarHeart, Smartphone, Sparkles } from "lucide-react";
import { toast } from "sonner";

import heroPark from "@/assets/hero-park.jpg";
import { useAppState } from "@/components/app/AppStateProvider";
import { DemoBadge, FlowerCount, SectionTitle } from "@/components/app/common";
import { DAILY_TASKS, DEMO_SCREEN_TIME, HEALTH_EVENT, formatMinutes } from "@/lib/demo-data";
import { TASK_REWARD } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "首頁｜智醒樂活 Beyond Scroll" },
      { name: "description", content: "今日數碼生活時間（示範）、每日小任務同小紅花、挑戰及線下活動入口。" },
      { property: "og:title", content: "智醒樂活 Beyond Scroll｜首頁" },
      { property: "og:description", content: "陪長者放低手機、郁動身體、參加線下活動嘅互動示範 App。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const CHALLENGE_TOTAL = 4;

function useGreeting() {
  const [g, setG] = useState({ hello: "你好", date: "" });
  useEffect(() => {
    const now = new Date();
    const h = now.getHours();
    const hello = h < 12 ? "早晨" : h < 18 ? "午安" : "晚安";
    const week = ["日", "一", "二", "三", "四", "五", "六"][now.getDay()];
    setG({ hello, date: `${now.getMonth() + 1}月${now.getDate()}日・星期${week}` });
  }, []);
  return g;
}

function HomePage() {
  const { state, dispatch } = useAppState();
  const { hello, date } = useGreeting();
  const doneCount = state.completedTasks.length;
  const screen = DEMO_SCREEN_TIME;
  const pct = Math.min(100, Math.round((screen.totalMinutes / screen.goalMinutes) * 100));

  return (
    <div className="space-y-7">
      {/* Greeting */}
      <section className="bg-gradient-hero px-5 pb-6 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-bold text-primary">
              智醒樂活 <span className="font-medium text-muted-foreground">Beyond Scroll</span>
            </p>
            <p className="text-lg text-muted-foreground">{date || "\u00a0"}</p>
            <h1 className="mt-1 text-3xl font-bold leading-tight text-primary-deep">
              陳伯伯，{hello}！
            </h1>
            <p className="mt-1 text-lg">今日都要精精神神咁過 🌿</p>
          </div>
          <Link to="/me" className="tap flex flex-col items-end gap-1 rounded-2xl bg-card px-3 py-2 shadow-[var(--shadow-card)]">
            <FlowerCount count={state.flowers} className="text-xl" />
            <span className="text-sm font-bold text-primary">{state.points} 積分</span>
          </Link>
        </div>
        <img
          src={heroPark}
          alt="一對長者夫婦喺公園散步嘅插畫"
          width={1024}
          height={768}
          className="mt-5 aspect-[16/10] w-full rounded-4xl object-cover shadow-[var(--shadow-card)]"
        />
      </section>

      {/* Screen time (demo data) */}
      <section className="px-5">
        <div className="app-card p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary-deep">
              <Smartphone className="size-6" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-primary-deep">今日數碼生活時間</h2>
              <DemoBadge className="mt-1">示範數據</DemoBadge>
            </div>
          </div>
          <p className="mt-4 text-4xl font-black text-primary-deep">{formatMinutes(screen.totalMinutes)}</p>
          <div className="mt-3 h-4 overflow-hidden rounded-full bg-muted" role="img" aria-label={`已用示範目標嘅 ${pct}%`}>
            <div className="h-full rounded-full bg-gradient-sunrise" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-base text-muted-foreground">
            示範目標：每日 {formatMinutes(screen.goalMinutes)}以內
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {screen.breakdown.map((b) => (
              <div key={b.label} className="rounded-2xl bg-muted px-1 py-3 text-center">
                <p className="text-sm text-muted-foreground">{b.label}</p>
                <p className="text-lg font-bold">{formatMinutes(b.minutes)}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-2xl bg-sage-soft p-3 text-lg font-medium text-secondary-foreground">
            💡 每睇半個鐘，就放低手機郁動吓啦！
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            以上為示範數據，本 Demo 並無讀取或監測你部機嘅使用情況。
          </p>
        </div>
      </section>

      {/* Entries */}
      <section className="grid grid-cols-2 gap-3 px-5">
        <Link to="/challenges" className="tap app-card flex flex-col gap-3 bg-sage-soft p-4">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Trophy className="size-7" />
          </span>
          <div>
            <h3 className="text-xl font-bold text-primary-deep">今日挑戰</h3>
            <p className="text-base text-muted-foreground">
              已完成 {state.completedChallenges.length}/{CHALLENGE_TOTAL}
            </p>
          </div>
          <span className="mt-auto inline-flex items-center text-base font-bold text-primary">
            去挑戰 <ChevronRight className="size-5" />
          </span>
        </Link>
        <Link to="/activities" className="tap app-card flex flex-col gap-3 bg-accent-soft p-4">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <CalendarHeart className="size-7" />
          </span>
          <div>
            <h3 className="text-xl font-bold text-primary-deep">線下活動</h3>
            <p className="text-base text-muted-foreground">精選：{HEALTH_EVENT.date}健康講座</p>
          </div>
          <span className="mt-auto inline-flex items-center text-base font-bold text-accent-foreground">
            睇活動 <ChevronRight className="size-5" />
          </span>
        </Link>
      </section>

      {/* Daily tasks */}
      <section className="px-5">
        <SectionTitle action={<span className="text-lg font-bold text-flower">{doneCount}/{DAILY_TASKS.length} 朵</span>}>
          每日小任務
        </SectionTitle>
        <p className="mb-3 text-lg text-muted-foreground">完成一項，送你一朵小紅花 🌺</p>
        <ul className="space-y-3">
          {DAILY_TASKS.map((t) => {
            const done = state.completedTasks.includes(t.id);
            return (
              <li key={t.id}>
                <button
                  type="button"
                  disabled={done}
                  onClick={() => {
                    dispatch({ type: "completeTask", id: t.id, title: t.title });
                    toast.success(`做得好！+${TASK_REWARD.flowers} 朵小紅花、+${TASK_REWARD.points} 積分`);
                  }}
                  className={cn(
                    "tap app-card flex w-full items-center gap-4 p-4 text-left disabled:cursor-default",
                    done && "border-sage bg-sage-soft",
                  )}
                >
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-muted text-3xl" aria-hidden>
                    {t.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block text-lg font-bold", done && "text-secondary-foreground")}>{t.title}</span>
                    <span className="block text-base text-muted-foreground">{t.hint}</span>
                  </span>
                  {done ? (
                    <span className="flex shrink-0 flex-col items-center">
                      <span className="animate-pop-in text-3xl" aria-hidden>🌺</span>
                      <span className="text-sm font-bold text-primary">已完成</span>
                    </span>
                  ) : (
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-primary text-primary">
                      <Check className="size-6" />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        {doneCount === DAILY_TASKS.length && (
          <div className="mt-4 flex items-center gap-3 rounded-3xl bg-gradient-forest p-5 text-primary-foreground">
            <Sparkles className="size-8 shrink-0 animate-float-soft" />
            <p className="text-lg font-bold">今日小任務全部完成！你真係好叻 👏</p>
          </div>
        )}
      </section>
    </div>
  );
}
