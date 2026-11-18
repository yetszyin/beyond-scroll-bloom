import { createFileRoute, Link } from "@tanstack/react-router";
import { RotateCcw, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import avatar from "@/assets/avatar-chan.jpg";
import { useAppState } from "@/components/app/AppStateProvider";
import { CheckInCalendar, CheckInStats } from "@/components/app/CheckInCalendar";
import { DemoBadge, SectionTitle } from "@/components/app/common";
import { WorkoutRow } from "@/components/app/workout-ui";
import { Button } from "@/components/ui/button";
import { FRIENDS, getActivity } from "@/lib/demo-data";

export const Route = createFileRoute("/me")({
  head: () => ({
    meta: [
      { title: "我的｜智醒樂活 Beyond Scroll" },
      { name: "description", content: "陳伯伯嘅打卡日曆、活動紀錄同好友（示範用戶）。" },
      { property: "og:title", content: "我的｜智醒樂活 Beyond Scroll" },
      { property: "og:description", content: "個人打卡日曆同活動紀錄（示範）。" },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MePage,
});

function MePage() {
  const { state, resetDemo } = useAppState();
  return (
    <div>
      <section className="bg-gradient-hero px-5 pb-6 pt-8 text-center">
        <img src={avatar} alt="陳伯伯頭像插畫" width={816} height={816} className="mx-auto size-28 rounded-full border-4 border-card object-cover shadow-[var(--shadow-card)]" />
        <h1 className="mt-3 text-3xl font-bold text-primary-deep">陳伯伯</h1>
        <div className="mt-1 flex items-center justify-center gap-2">
          <DemoBadge>示範用戶</DemoBadge>
          <span className="text-base text-muted-foreground">共 {state.workouts.length} 次活動</span>
        </div>
        <div className="mt-5">
          <CheckInStats />
        </div>
      </section>

      <div className="space-y-7 px-5 pt-6">
        <section>
          <SectionTitle>打卡日曆</SectionTitle>
          <CheckInCalendar />
        </section>

        <section>
          <SectionTitle>活動紀錄</SectionTitle>
          {state.workouts.length === 0 ? (
            <p className="app-card p-4 text-lg text-muted-foreground">未有紀錄。</p>
          ) : (
            <ul className="app-card divide-y divide-border">
              {state.workouts.slice(0, 15).map((w) => (
                <li key={w.id}>
                  <WorkoutRow w={w} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <SectionTitle>我的示範報名</SectionTitle>
          {state.registrations.length === 0 ? (
            <Link to="/activities" className="tap app-card flex items-center justify-between p-4 text-lg">
              未有報名，去睇吓社區活動 <ChevronRight className="size-6 text-primary" />
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
          <SectionTitle action={<Link to="/activities/feed" className="text-lg font-bold text-primary">朋友圈 ›</Link>}>我的好友</SectionTitle>
          <ul className="grid grid-cols-2 gap-3">
            {FRIENDS.map((f) => (
              <li key={f.id} className="app-card flex items-center gap-3 p-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xl font-bold text-accent-foreground">{f.name[0]}</span>
                <span className="min-w-0">
                  <span className="block text-lg font-bold">{f.name}</span>
                  <span className="block truncate text-sm text-muted-foreground">{f.note}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-muted-foreground">以上均為示範好友。</p>
        </section>

        <Button variant="soft" size="xl" className="w-full" onClick={() => { resetDemo(); toast("已重設示範資料"); }}>
          <RotateCcw /> 重設示範資料
        </Button>
      </div>
    </div>
  );
}
