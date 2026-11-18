import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronRight, Footprints, Eye, Armchair, Users, CalendarHeart, Brain } from "lucide-react";

import heroPark from "@/assets/hero-park.jpg";
import { useAppState } from "@/components/app/AppStateProvider";
import { CheckInStats } from "@/components/app/CheckInCalendar";
import { SectionTitle } from "@/components/app/common";
import { ScreenTimeCard } from "@/components/app/ScreenTimeCard";
import { WorkoutRow } from "@/components/app/workout-ui";
import { dailyGameIndex, gameMeta } from "@/lib/brain";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "首頁｜智齡樂活 Silver Spark" },
      { name: "description", content: "開始散步、跟做伸展運動同眼部運動，記錄每日活動，同朋友分享，建立健康數位生活。" },
      { property: "og:title", content: "智齡樂活 Silver Spark｜首頁" },
      { property: "og:description", content: "幫助長者放低短視頻，將時間投入益腦活動、運動、興趣同真實社交嘅示範 App。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function useGreeting() {
  const [g, setG] = useState({ hello: "你好", date: "" });
  useEffect(() => {
    const now = new Date();
    const h = now.getHours();
    const week = ["日", "一", "二", "三", "四", "五", "六"][now.getDay()];
    setG({ hello: h < 12 ? "早晨" : h < 18 ? "午安" : "晚安", date: `${now.getMonth() + 1}月${now.getDate()}日・星期${week}` });
  }, []);
  return g;
}

function HomePage() {
  const { state, ready } = useAppState();
  const { hello, date } = useGreeting();
  const recent = state.workouts.slice(0, 3);
  const todayBrain = gameMeta(dailyGameIndex(new Date()));

  return (
    <div className="space-y-7">
      <section className="bg-gradient-hero px-5 pb-6 pt-6">
        <p className="text-base font-bold text-primary">
          智齡樂活 <span className="font-medium text-muted-foreground">Silver Spark</span>
        </p>
        <p className="text-lg text-muted-foreground">{date || "\u00a0"}</p>
        <h1 className="mt-1 text-3xl font-bold leading-tight text-primary-deep">陳伯伯，{hello}！</h1>
        <p className="mt-1 text-lg">今日想郁動吓邊樣？</p>
        <img src={heroPark} alt="一對長者夫婦喺公園散步嘅插畫" width={1024} height={768} className="mt-5 aspect-[16/9] w-full rounded-4xl object-cover shadow-[var(--shadow-card)]" />
      </section>

      <section className="px-5">
        <ScreenTimeCard />
      </section>

      <section className="space-y-3 px-5">
        <Link to="/challenges/brain" className="tap app-card flex items-center gap-4 border-2 border-primary/30 bg-sage-soft/60 p-5">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-3xl bg-primary text-primary-foreground">
            <Brain className="size-9" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-2xl font-bold text-primary-deep">今日動動腦</span>
            <span className="block text-lg text-muted-foreground">{todayBrain.emoji} {todayBrain.title}：{todayBrain.subtitle}</span>
          </span>
          <ChevronRight className="size-8 shrink-0 text-muted-foreground" />
        </Link>
        <Link to="/challenges/walk" className="tap flex items-center gap-4 rounded-4xl bg-gradient-sunrise p-5 shadow-[var(--shadow-cta)]">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-3xl bg-card text-accent-foreground">
            <Footprints className="size-9" />
          </span>
          <span className="flex-1">
            <span className="block text-2xl font-bold text-accent-foreground">開始散步 / 跑步</span>
            <span className="block text-lg text-accent-foreground">計時＋記錄距離同步數</span>
          </span>
          <ChevronRight className="size-8 text-accent-foreground" />
        </Link>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/challenges/course/$courseId" params={{ courseId: "stretch-chair" }} className="tap app-card flex flex-col gap-3 bg-sage-soft p-4">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Armchair className="size-8" />
            </span>
            <span className="text-xl font-bold text-primary-deep">伸展運動</span>
            <span className="text-base text-muted-foreground">跟住做，郁吓全身</span>
          </Link>
          <Link to="/challenges/course/$courseId" params={{ courseId: "eye-basic" }} className="tap app-card flex flex-col gap-3 bg-sky-soft p-4">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Eye className="size-8" />
            </span>
            <span className="text-xl font-bold text-primary-deep">眼部運動</span>
            <span className="text-base text-muted-foreground">放低手機，休息一陣</span>
          </Link>
        </div>
      </section>

      <section className="px-5">
        <SectionTitle action={<Link to="/me" className="text-lg font-bold text-primary">睇日曆 ›</Link>}>我的打卡</SectionTitle>
        <CheckInStats />
        <div className="app-card mt-3 overflow-hidden">
          {!ready ? (
            <div className="h-40 animate-pulse" />
          ) : recent.length === 0 ? (
            <p className="p-4 text-lg text-muted-foreground">未有紀錄，揀一樣運動開始啦！</p>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((w) => (
                <li key={w.id}>
                  <WorkoutRow w={w} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 px-5">
        <Link to="/activities/feed" className="tap app-card flex flex-col gap-2 p-4">
          <Users className="size-8 text-primary" />
          <span className="text-xl font-bold text-primary-deep">朋友圈</span>
          <span className="text-base text-muted-foreground">睇朋友嘅分享</span>
        </Link>
        <Link to="/activities" className="tap app-card flex flex-col gap-2 p-4">
          <CalendarHeart className="size-8 text-accent-foreground" />
          <span className="text-xl font-bold text-primary-deep">社區活動</span>
          <span className="text-base text-muted-foreground">搵線下活動參加</span>
        </Link>
      </section>
    </div>
  );
}
