import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Lock } from "lucide-react";

import healthImg from "@/assets/health-nutrition.jpg";
import { ActivityActions, ActivityDetails, SourceLink } from "@/components/app/activity-ui";
import { DemoBadge, Disclaimer, TONE_CLASSES, ThemeIcon } from "@/components/app/common";
import { getTheme } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/activities/$theme")({
  loader: ({ params }) => {
    const theme = getTheme(params.theme);
    if (!theme) throw notFound();
    return { themeId: theme.id };
  },
  head: ({ params }) => {
    const theme = getTheme(params.theme);
    const title = theme ? `${theme.name}活動｜智齡樂活 Silver Spark` : "活動｜智齡樂活 Silver Spark";
    const desc = theme ? `${theme.name}主題精選活動：${theme.featured.title}` : "主題活動";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ThemePage,
});

function ThemePage() {
  const { themeId } = Route.useLoaderData();
  const theme = getTheme(themeId)!;
  const a = theme.featured;

  return (
    <div>
      <div className={cn("px-5 pb-6 pt-4", TONE_CLASSES[theme.tone])}>
        <Link to="/activities" className="tap -ml-2 inline-flex items-center gap-1 rounded-full px-2 py-2 text-lg font-bold">
          <ArrowLeft className="size-6" /> 返回活動
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-card text-primary-deep">
            <ThemeIcon id={theme.id} className="size-9" />
          </span>
          <div>
            <h1 className="text-3xl font-bold">{theme.name}</h1>
            <p className="text-lg opacity-80">{theme.tagline}</p>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-5 pt-5">
        <h2 className="text-2xl font-bold text-primary-deep">精選活動</h2>
        <article className="app-card overflow-hidden">
          {a.official ? (
            <img src={healthImg} alt="雞蛋、豆腐、魚、牛奶等營養食物插畫" width={1024} height={640} className="aspect-[16/9] w-full object-cover" />
          ) : (
            <div className={cn("flex aspect-[16/7] items-center justify-center", TONE_CLASSES[theme.tone])}>
              <ThemeIcon id={theme.id} className="size-20 opacity-70" />
            </div>
          )}
          <div className="space-y-4 p-5">
            {a.official ? (
              <span className="inline-flex rounded-full bg-primary px-3 py-0.5 text-sm font-bold text-primary-foreground">官方活動資料</span>
            ) : (
              <DemoBadge>示範內容・虛構活動</DemoBadge>
            )}
            <h3 className="text-2xl font-bold leading-snug text-primary-deep">{a.title}</h3>
            <p className="text-lg leading-relaxed">{a.intro}</p>
            <ActivityDetails activity={a} />
            {a.official && (
              <p className="text-base text-muted-foreground">資料來源：{a.organiser}官方活動日曆</p>
            )}
            <SourceLink activity={a} />
            <ActivityActions activity={a} />
          </div>
        </article>

        <Disclaimer />

        <h2 className="pt-2 text-2xl font-bold text-primary-deep">更多活動</h2>
        <ul className="space-y-3">
          {Array.from({ length: theme.lockedSlots }).map((_, i) => (
            <li
              key={i}
              className="flex items-center gap-4 rounded-3xl border-2 border-dashed border-input bg-muted p-5 text-muted-foreground"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-card">
                <Lock className="size-6" />
              </span>
              <span className="text-xl font-bold">🔒 敬請期待</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
