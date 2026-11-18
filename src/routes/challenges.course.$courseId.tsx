import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Pause, Play, SkipForward, CheckCircle2, Info } from "lucide-react";

import stretchImg from "@/assets/stretch-chair.jpg";
import eyeImg from "@/assets/eye-relax.jpg";
import { useAppState } from "@/components/app/AppStateProvider";
import { DemoBadge } from "@/components/app/common";
import { WorkoutFinish } from "@/components/app/workout-ui";
import { Button } from "@/components/ui/button";
import { newId } from "@/lib/app-state";
import { courseSeconds, getCourse } from "@/lib/demo-data";
import { formatClock, toDateKey, WORKOUT_LABEL, type Workout } from "@/lib/workouts";

export const Route = createFileRoute("/challenges/course/$courseId")({
  loader: ({ params }) => {
    const c = getCourse(params.courseId);
    if (!c) throw notFound();
    return { courseId: c.id };
  },
  head: ({ params }) => {
    const c = getCourse(params.courseId);
    const title = c ? `${c.title}｜${WORKOUT_LABEL[c.type]}｜智齡樂活 Silver Spark` : "跟做課程｜智齡樂活 Silver Spark";
    const desc = c ? `${c.minutes} 分鐘跟做課程：${c.summary}` : "跟做運動課程";
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
  component: CoursePage,
});

type Phase = "preview" | "following" | "done";

function CoursePage() {
  const { courseId } = Route.useLoaderData();
  const course = getCourse(courseId)!;
  const { dispatch } = useAppState();
  const [phase, setPhase] = useState<Phase>("preview");
  const [step, setStep] = useState(0);
  const [left, setLeft] = useState(course.steps[0]?.seconds ?? 0);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [saved, setSaved] = useState<Workout | null>(null);
  const poster = course.type === "stretch" ? stretchImg : eyeImg;

  useEffect(() => {
    if (phase !== "following" || paused) return;
    const t = window.setInterval(() => {
      setElapsed((e) => e + 1);
      setLeft((l) => l - 1);
    }, 1000);
    return () => window.clearInterval(t);
  }, [phase, paused]);

  useEffect(() => {
    if (phase !== "following" || left > 0) return;
    if (step < course.steps.length - 1) {
      setStep((s) => s + 1);
      setLeft(course.steps[step + 1]?.seconds ?? 0);
    } else {
      setPaused(true);
    }
  }, [left, phase, step, course.steps]);

  const begin = () => {
    setStep(0);
    setLeft(course.steps[0]?.seconds ?? 0);
    setElapsed(0);
    setPaused(false);
    setPhase("following");
  };

  const next = () => {
    if (step < course.steps.length - 1) {
      setStep(step + 1);
      setLeft(course.steps[step + 1]?.seconds ?? 0);
    }
  };

  const complete = () => {
    const w: Workout = {
      id: newId("w"),
      type: course.type,
      date: toDateKey(new Date()),
      durationSec: elapsed > 0 ? elapsed : courseSeconds(course),
      courseId: course.id,
      courseTitle: course.title,
    };
    dispatch({ type: "addWorkout", workout: w });
    setSaved(w);
    setPhase("done");
  };

  const reset = () => {
    setSaved(null);
    setPhase("preview");
    setElapsed(0);
  };

  const cur = course.steps[step];
  const lastStepDone = step === course.steps.length - 1 && left <= 0;

  return (
    <div className="px-5 pt-4">
      <Link to="/challenges" className="tap -ml-2 inline-flex items-center gap-1 rounded-full px-2 py-2 text-lg font-bold">
        <ArrowLeft className="size-6" /> 返回挑戰
      </Link>

      {phase === "done" && saved ? (
        <div className="mt-4">
          <WorkoutFinish workout={saved} againLabel="再做一次" onAgain={reset} />
        </div>
      ) : (
        <div className="mt-3 space-y-5">
          {/* Video area: real video when available, otherwise an honest placeholder + guided follow-along */}
          <div className="relative overflow-hidden rounded-4xl bg-primary-deep shadow-[var(--shadow-card)]">
            {course.videoUrl ? (
              <video src={course.videoUrl} controls playsInline poster={poster} className="aspect-video w-full" />
            ) : phase === "preview" ? (
              <div className="relative">
                <img src={poster} alt={`${course.title}示意插畫`} width={1088} height={608} className="aspect-video w-full object-cover opacity-80" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-primary-deep/35 p-4 text-center">
                  <button
                    type="button"
                    onClick={begin}
                    aria-label="開始跟做"
                    className="tap flex size-20 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-[var(--shadow-cta)]"
                  >
                    <Play className="size-10 fill-current" />
                  </button>
                  <span className="rounded-full bg-card/95 px-3 py-1 text-sm font-bold text-foreground">影片預覽（示範佔位）・正式影片稍後加入</span>
                </div>
              </div>
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center gap-2 bg-gradient-forest p-5 text-center text-primary-foreground">
                <p className="text-base opacity-90">
                  第 {step + 1} / {course.steps.length} 個動作
                </p>
                <p className="text-2xl font-bold leading-snug">{lastStepDone ? "全部動作完成！" : cur?.text}</p>
                <p className="text-5xl font-black tabular-nums" role="timer" aria-live="polite">
                  {formatClock(Math.max(0, left))}
                </p>
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <DemoBadge>示範課程</DemoBadge>
              <span className="inline-flex items-center gap-1 text-base text-muted-foreground">
                <Clock className="size-5" /> {course.minutes} 分鐘・{course.level}
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-bold text-primary-deep">{course.title}</h1>
            <p className="mt-1 text-lg">{course.summary}</p>
          </div>

          {phase === "following" && (
            <div className="space-y-3">
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${((step + (lastStepDone ? 1 : 0)) / course.steps.length) * 100}%` }} />
              </div>
              <p className="text-center text-lg">已跟做 {formatClock(elapsed)}</p>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="soft" size="xl" onClick={() => setPaused((p) => !p)} disabled={lastStepDone}>
                  {paused ? (
                    <>
                      <Play /> 繼續
                    </>
                  ) : (
                    <>
                      <Pause /> 暫停
                    </>
                  )}
                </Button>
                <Button variant="soft" size="xl" onClick={next} disabled={step >= course.steps.length - 1}>
                  <SkipForward /> 下一個
                </Button>
              </div>
            </div>
          )}

          {phase === "preview" && (
            <Button variant="forest" size="xxl" className="w-full" onClick={begin}>
              <Play className="fill-current" /> 開始跟做
            </Button>
          )}

          <Button variant="hero" size="xxl" className="w-full" onClick={complete}>
            <CheckCircle2 /> 完成訓練
          </Button>

          <section className="app-card p-5">
            <h2 className="text-xl font-bold text-primary-deep">動作提示</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-6 text-lg">
              {course.steps.map((s, i) => (
                <li key={s.text} className={phase === "following" && i === step ? "font-bold text-primary" : undefined}>
                  {s.text}
                </li>
              ))}
            </ol>
            <ul className="mt-4 space-y-1 text-base text-muted-foreground">
              {course.tips.map((t) => (
                <li key={t}>・{t}</li>
              ))}
            </ul>
          </section>

          <div className="flex gap-3 rounded-2xl border border-accent bg-accent-soft p-4 text-base text-accent-foreground">
            <Info className="mt-0.5 size-6 shrink-0" />
            <p className="font-medium">
              示範內容：影片位置暫用插畫佔位，現時以文字步驟同計時跟做。此為一般活動練習，唔可以代替醫護人員意見；如感到不適請即停止。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
