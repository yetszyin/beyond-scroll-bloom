import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import healthImg from "@/assets/health-nutrition.jpg";
import buddyImg from "@/assets/buddy-walk.jpg";
import { useAppState } from "@/components/app/AppStateProvider";
import { BuddyPostCard } from "@/components/app/activity-ui";
import { Disclaimer, PageHeader, SectionTitle, TONE_CLASSES, ThemeIcon } from "@/components/app/common";
import { DEMO_BUDDY_POST, HEALTH_EVENT, THEMES } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/activities/")({
  head: () => ({
    meta: [
      { title: "活動｜智齡樂活 Silver Spark" },
      { name: "description", content: "健康、藝術文化、音樂、園藝、義工主題線下活動，仲可以搵街坊結伴同行（示範）。" },
      { property: "og:title", content: "線下活動｜智齡樂活 Silver Spark" },
      { property: "og:description", content: "健康、藝術文化、音樂、園藝、義工主題線下活動同結伴同行（示範）。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ActivitiesPage,
});

function ActivitiesPage() {
  const { state } = useAppState();
  return (
    <div>
      <PageHeader title="線下活動" subtitle="走出屋企，認識新朋友" />
      <div className="space-y-7 px-5">
        {/* Featured */}
        <Link to="/activities/$theme" params={{ theme: "health" }} className="tap app-card block overflow-hidden">
          <img src={healthImg} alt="雞蛋、豆腐、魚、牛奶等營養食物插畫" width={1024} height={640} className="aspect-[16/9] w-full object-cover" />
          <div className="p-4">
            <span className="inline-flex rounded-full bg-primary px-3 py-0.5 text-sm font-bold text-primary-foreground">精選・官方活動</span>
            <h2 className="mt-2 text-xl font-bold text-primary-deep">{HEALTH_EVENT.title}</h2>
            <p className="mt-1 text-lg text-muted-foreground">
              {HEALTH_EVENT.date}・{HEALTH_EVENT.organiser}
            </p>
            <span className="mt-2 inline-flex items-center text-lg font-bold text-primary">
              了解更多 <ChevronRight className="size-5" />
            </span>
          </div>
        </Link>

        {/* Themes */}
        <section>
          <SectionTitle>活動主題</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map((t, i) => (
              <Link
                key={t.id}
                to="/activities/$theme"
                params={{ theme: t.id }}
                className={cn(
                  "tap flex flex-col gap-2 rounded-3xl p-4 shadow-[var(--shadow-card)]",
                  TONE_CLASSES[t.tone],
                  i === THEMES.length - 1 && "col-span-2 flex-row items-center",
                )}
              >
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-card text-primary-deep">
                  <ThemeIcon id={t.id} className="size-8" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xl font-bold">{t.name}</span>
                  <span className="block text-base opacity-80">{t.tagline}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Buddy */}
        <section>
          <SectionTitle>結伴同行</SectionTitle>
          <div className="app-card mb-4 overflow-hidden">
            <img src={buddyImg} alt="兩位長者姊妹結伴行去社區中心嘅插畫" width={1024} height={640} loading="lazy" className="aspect-[16/8] w-full object-cover" />
            <p className="p-4 text-lg">一個人唔想出門？搵街坊一齊去，安全又開心！喺活動頁可以「發起結伴」。</p>
          </div>
          <div className="space-y-3">
            {state.buddyPosts.map((p) => (
              <BuddyPostCard key={p.id} id={p.id} author="陳伯伯（你）" authorNote="示範用戶" message={p.message} activityId={p.activityId} postedAgo="啱啱" baseJoined={0} mine />
            ))}
            <BuddyPostCard {...DEMO_BUDDY_POST} />
          </div>
        </section>

        <Disclaimer />
      </div>
    </div>
  );
}
