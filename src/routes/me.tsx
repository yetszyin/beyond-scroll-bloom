import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Trophy, CalendarHeart, Users, RotateCcw, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import avatar from "@/assets/avatar-chan.jpg";
import { useAppState } from "@/components/app/AppStateProvider";
import { DemoBadge, SectionTitle } from "@/components/app/common";
import { Button } from "@/components/ui/button";
import { FRIENDS, getActivity } from "@/lib/demo-data";
import type { LogEntry } from "@/lib/app-state";

export const Route = createFileRoute("/me")({
  head: () => ({
    meta: [
      { title: "我的｜智醒樂活 Beyond Scroll" },
      { name: "description", content: "陳伯伯嘅積分、小紅花、任務紀錄同好友（示範用戶）。" },
      { property: "og:title", content: "我的｜智醒樂活 Beyond Scroll" },
      { property: "og:description", content: "積分、小紅花、任務紀錄同好友一覽（示範）。" },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MePage,
});

const KIND_ICON: Record<LogEntry["kind"], typeof Trophy> = {
  task: CheckCircle2,
  challenge: Trophy,
  activity: CalendarHeart,
  social: Users,
};

function MePage() {
  const { state, dispatch } = useAppState();
  const shownFlowers = Math.min(state.flowers, 30);

  return (
    <div>
      <section className="bg-gradient-hero px-5 pb-6 pt-8 text-center">
        <img
          src={avatar}
          alt="陳伯伯頭像插畫"
          width={816}
          height={816}
          className="mx-auto size-28 rounded-full border-4 border-card object-cover shadow-[var(--shadow-card)]"
        />
        <h1 className="mt-3 text-3xl font-bold text-primary-deep">陳伯伯</h1>
        <div className="mt-1 flex items-center justify-center gap-2">
          <DemoBadge>示範用戶</DemoBadge>
          <span className="text-base text-muted-foreground">樂活第 28 日</span>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <Stat label="積分" value={state.points} />
          <Stat label="小紅花" value={state.flowers} accent />
          <Stat label="今日完成" value={state.completedTasks.length + state.completedChallenges.length} />
        </div>
      </section>

      <div className="space-y-7 px-5 pt-6">
        <section>
          <SectionTitle>我的小紅花</SectionTitle>
          <div className="app-card p-4">
            <div className="flex flex-wrap gap-1.5 text-2xl" aria-label={`共 ${state.flowers} 朵小紅花`}>
              {Array.from({ length: shownFlowers }).map((_, i) => (
                <span key={i} aria-hidden>
                  🌺
                </span>
              ))}
              {state.flowers > shownFlowers && <span className="text-lg font-bold text-flower">+{state.flowers - shownFlowers}</span>}
            </div>
            <p className="mt-3 text-base text-muted-foreground">完成每日小任務同挑戰就可以收集更多小紅花。</p>
          </div>
        </section>

        <section>
          <SectionTitle>任務紀錄</SectionTitle>
          <ul className="app-card divide-y divide-border">
            {state.log.slice(0, 12).map((l) => {
              const Icon = KIND_ICON[l.kind];
              return (
                <li key={l.id} className="flex items-center gap-3 p-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary-deep">
                    <Icon className="size-6" />
                  </span>
                  <span className="flex-1 text-lg">{l.text}</span>
                  <span className="shrink-0 text-base text-muted-foreground">{l.when}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section>
          <SectionTitle>我的示範報名</SectionTitle>
          {state.registrations.length === 0 ? (
            <Link to="/activities" className="tap app-card flex items-center justify-between p-4 text-lg">
              未有報名，去睇吓有咩活動 <ChevronRight className="size-6 text-primary" />
            </Link>
          ) : (
            <ul className="space-y-3">
              {state.registrations.map((id) => {
                const a = getActivity(id);
                if (!a) return null;
                return (
                  <li key={id}>
                    <Link to="/activities/$theme" params={{ theme: a.themeId }} className="tap app-card block p-4">
                      <p className="text-lg font-bold">{a.title}</p>
                      <p className="text-base text-muted-foreground">{a.date}・示範報名（未有實際提交）</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section>
          <SectionTitle>我的好友</SectionTitle>
          <ul className="grid grid-cols-2 gap-3">
            {FRIENDS.map((f) => (
              <li key={f.id} className="app-card flex items-center gap-3 p-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xl font-bold text-accent-foreground">
                  {f.name[0]}
                </span>
                <span className="min-w-0">
                  <span className="block text-lg font-bold">{f.name}</span>
                  <span className="block truncate text-sm text-muted-foreground">{f.note}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-muted-foreground">以上均為示範好友。</p>
        </section>

        <Button
          variant="soft"
          size="xl"
          className="w-full"
          onClick={() => {
            dispatch({ type: "reset" });
            toast("已重設示範資料");
          }}
        >
          <RotateCcw /> 重設示範資料
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-3xl bg-card p-3 shadow-[var(--shadow-card)]">
      <p className={accent ? "text-3xl font-black text-flower" : "text-3xl font-black text-primary-deep"}>{value}</p>
      <p className="text-base text-muted-foreground">{label}</p>
    </div>
  );
}
