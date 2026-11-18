import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, CheckCircle2, Clock, Heart, Route as RouteIcon, Share2 } from "lucide-react";
import { toast } from "sonner";

import { useAppState } from "@/components/app/AppStateProvider";
import { DemoBadge } from "@/components/app/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { WORKOUT_EMOJI, WORKOUT_LABEL, formatDateKey, formatDuration, type Workout, type WorkoutType } from "@/lib/workouts";

export const TYPE_TONE: Record<WorkoutType, string> = {
  walk: "bg-accent-soft text-accent-foreground",
  stretch: "bg-sage-soft text-secondary-foreground",
  eye: "bg-sky-soft text-foreground",
};

export const TYPE_DOT: Record<WorkoutType, string> = {
  walk: "bg-accent",
  stretch: "bg-primary",
  eye: "bg-chart-5",
};

export function workoutTitle(w: { type: WorkoutType; courseTitle?: string | undefined }) {
  return w.courseTitle ? `${WORKOUT_LABEL[w.type]}・${w.courseTitle}` : WORKOUT_LABEL[w.type];
}

export function WorkoutRow({ w }: { w: Workout }) {
  return (
    <div className="flex items-center gap-3 p-4">
      <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl text-2xl", TYPE_TONE[w.type])} aria-hidden>
        {WORKOUT_EMOJI[w.type]}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-lg font-bold">{workoutTitle(w)}</p>
        <p className="text-base text-muted-foreground">
          {formatDuration(w.durationSec)}
          {w.distanceKm !== undefined && `・${w.distanceKm} 公里`}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm text-muted-foreground">{formatDateKey(w.date).replace(/^\d+年/, "")}</p>
        {w.demo && <DemoBadge className="mt-1 text-xs">示範紀錄</DemoBadge>}
      </div>
    </div>
  );
}

const QUICK_LINES = ["今日精神好！", "一齊郁動吓！", "聽日繼續加油！"];

/** Completion summary + "share to in-app friend circle or not" choice. */
export function WorkoutFinish({ workout, againLabel, onAgain }: { workout: Workout; againLabel: string; onAgain: () => void }) {
  const { dispatch } = useAppState();
  const [text, setText] = useState("");
  const [choice, setChoice] = useState<null | "shared" | "skipped">(null);

  return (
    <div className="space-y-5">
      <div className="rounded-4xl bg-gradient-forest p-6 text-center text-primary-foreground">
        <CheckCircle2 className="mx-auto size-16 animate-pop-in" />
        <p className="mt-2 text-lg opacity-90">完成！做得好</p>
        <h2 className="text-3xl font-bold">{workoutTitle(workout)}</h2>
      </div>

      <div className="app-card divide-y divide-border">
        <SummaryRow icon={CalendarDays} label="日期" value={formatDateKey(workout.date)} />
        <SummaryRow icon={Clock} label="總時間" value={formatDuration(workout.durationSec)} />
        {workout.type === "walk" && (
          <SummaryRow
            icon={RouteIcon}
            label="步行距離（手動輸入）"
            value={workout.distanceKm !== undefined ? `${workout.distanceKm} 公里` : "未有填寫"}
          />
        )}
      </div>
      <p className="text-center text-base text-muted-foreground">已記錄到你嘅打卡日曆 📅</p>

      {choice === null ? (
        <div className="app-card space-y-4 p-5">
          <h3 className="text-xl font-bold text-primary-deep">分享到 App 內朋友圈？</h3>
          <label className="block">
            <span className="mb-2 block text-base text-muted-foreground">加一句說話（可以唔填）</span>
            <Input
              value={text}
              maxLength={40}
              onChange={(e) => setText(e.target.value)}
              placeholder="例如：今日精神好！"
              className="h-14 rounded-2xl text-lg"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {QUICK_LINES.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setText(l)}
                className="tap rounded-full border-2 border-border bg-muted px-4 py-2 text-base font-medium"
              >
                {l}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            示範功能：貼文只會出現喺本 App 嘅朋友圈，唔會分享去 WhatsApp、Facebook 或其他外部平台。
          </p>
          <Button
            variant="hero"
            size="xxl"
            className="w-full"
            onClick={() => {
              dispatch({ type: "shareWorkout", workoutId: workout.id, text });
              setChoice("shared");
              toast.success("已發布到 App 內朋友圈（示範）");
            }}
          >
            <Share2 /> 分享至朋友圈
          </Button>
          <Button variant="soft" size="xl" className="w-full" onClick={() => setChoice("skipped")}>
            暫不分享
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="rounded-2xl bg-sage-soft p-4 text-center text-lg font-bold text-secondary-foreground">
            {choice === "shared" ? "已發布到 App 內朋友圈（示範）" : "好，今次唔分享，紀錄已經儲存。"}
          </p>
          {choice === "shared" && (
            <Button asChild variant="forest" size="xl" className="w-full">
              <Link to="/activities/feed">去朋友圈睇吓</Link>
            </Button>
          )}
          <Button asChild variant={choice === "shared" ? "soft" : "forest"} size="xl" className="w-full">
            <Link to="/me">睇打卡日曆</Link>
          </Button>
          <Button variant="soft" size="xl" className="w-full" onClick={onAgain}>
            {againLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

function SummaryRow({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-4">
      <Icon className="size-6 shrink-0 text-primary" />
      <span className="flex-1 text-lg text-muted-foreground">{label}</span>
      <span className="text-xl font-bold">{value}</span>
    </div>
  );
}

export function FeedCard({
  id,
  author,
  note,
  when,
  type,
  durationSec,
  distanceKm,
  courseTitle,
  text,
  baseLikes,
  demo,
}: {
  id: string;
  author: string;
  note: string;
  when: string;
  type: WorkoutType;
  durationSec: number;
  distanceKm?: number;
  courseTitle?: string;
  text: string;
  baseLikes: number;
  demo: boolean;
}) {
  const { state, dispatch } = useAppState();
  const liked = state.likedPosts.includes(id);
  return (
    <article className="app-card p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-full bg-accent-soft text-xl font-bold text-accent-foreground">
          {author[0]}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold">{author}</p>
          <p className="text-sm text-muted-foreground">
            {note}・{when}
          </p>
        </div>
        {demo ? <DemoBadge>示範貼文</DemoBadge> : <DemoBadge className="border-primary bg-sage-soft text-secondary-foreground">我的分享</DemoBadge>}
      </div>
      {text && <p className="mt-3 text-lg leading-relaxed">{text}</p>}
      <div className={cn("mt-3 flex items-center gap-3 rounded-2xl p-3", TYPE_TONE[type])}>
        <span className="text-3xl" aria-hidden>
          {WORKOUT_EMOJI[type]}
        </span>
        <div>
          <p className="text-lg font-bold">{workoutTitle({ type, courseTitle })}</p>
          <p className="text-base">
            {formatDuration(durationSec)}
            {type === "walk" && distanceKm !== undefined && `・${distanceKm} 公里`}
          </p>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          aria-pressed={liked}
          onClick={() => dispatch({ type: "toggleLike", postId: id })}
          className={cn(
            "tap inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-base font-bold",
            liked ? "border-flower bg-flower-soft text-flower" : "border-border text-muted-foreground",
          )}
        >
          <Heart className={cn("size-5", liked && "fill-current")} /> 讚好 {baseLikes + (liked ? 1 : 0)}
        </button>
      </div>
    </article>
  );
}
