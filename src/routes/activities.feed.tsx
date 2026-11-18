import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Info } from "lucide-react";

import { useAppState } from "@/components/app/AppStateProvider";
import { FeedCard } from "@/components/app/workout-ui";
import { Button } from "@/components/ui/button";
import { DEMO_FEED_POSTS } from "@/lib/demo-data";
import { formatDateKey } from "@/lib/workouts";

export const Route = createFileRoute("/activities/feed")({
  head: () => ({
    meta: [
      { title: "朋友圈｜智齡樂活 Silver Spark" },
      { name: "description", content: "睇吓朋友嘅散步、伸展同眼部運動分享（App 內示範朋友圈）。" },
      { property: "og:title", content: "朋友圈｜智齡樂活 Silver Spark" },
      { property: "og:description", content: "App 內示範朋友圈：分享每日活動。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FeedPage,
});

function FeedPage() {
  const { state } = useAppState();
  return (
    <div className="px-5 pt-4">
      <Link to="/activities" className="tap -ml-2 inline-flex items-center gap-1 rounded-full px-2 py-2 text-lg font-bold">
        <ArrowLeft className="size-6" /> 返回活動
      </Link>
      <h1 className="mt-1 text-3xl font-bold text-primary-deep">朋友圈</h1>
      <p className="mt-1 text-lg text-muted-foreground">同朋友一齊打卡，互相鼓勵</p>
      <div className="mt-4 flex gap-3 rounded-2xl border border-accent bg-accent-soft p-4 text-base text-accent-foreground">
        <Info className="mt-0.5 size-6 shrink-0" />
        <p className="font-medium">示範朋友圈：貼文只喺本 App 內顯示，唔會發送到 WhatsApp、Facebook 或其他外部平台。</p>
      </div>
      <div className="mt-5 space-y-4">
        {state.feedPosts.length === 0 && (
          <div className="app-card space-y-3 p-5 text-center">
            <p className="text-lg">你未有分享。完成一次活動就可以分享到朋友圈！</p>
            <Button asChild variant="forest" size="xl" className="w-full">
              <Link to="/challenges">去做運動</Link>
            </Button>
          </div>
        )}
        {state.feedPosts.map((p) => (
          <FeedCard
            key={p.id}
            id={p.id}
            author="陳伯伯（你）"
            note="示範用戶"
            when={formatDateKey(p.date)}
            type={p.type}
            durationSec={p.durationSec}
            {...(p.distanceKm !== undefined ? { distanceKm: p.distanceKm } : {})}
            {...(p.courseTitle ? { courseTitle: p.courseTitle } : {})}
            text={p.text}
            baseLikes={0}
            demo={false}
          />
        ))}
        {DEMO_FEED_POSTS.map((p) => (
          <FeedCard
            key={p.id}
            id={p.id}
            author={p.author}
            note="示範好友"
            when={p.when}
            type={p.type}
            durationSec={p.durationSec}
            {...(p.distanceKm !== undefined ? { distanceKm: p.distanceKm } : {})}
            {...(p.courseTitle ? { courseTitle: p.courseTitle } : {})}
            text={p.text}
            baseLikes={p.baseLikes}
            demo
          />
        ))}
      </div>
    </div>
  );
}
