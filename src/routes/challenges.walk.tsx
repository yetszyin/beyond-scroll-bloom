import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Pause, Play, Square, Info } from "lucide-react";

import { useAppState } from "@/components/app/AppStateProvider";
import { WorkoutFinish, WorkoutRow } from "@/components/app/workout-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newId } from "@/lib/app-state";
import { formatClock, toDateKey, type Workout } from "@/lib/workouts";

export const Route = createFileRoute("/challenges/walk")({
  head: () => ({
    meta: [
      { title: "散步計時｜智醒樂活 Beyond Scroll" },
      { name: "description", content: "按開始散步計時，行完手動填寫距離，記錄每次散步。" },
      { property: "og:title", content: "散步計時｜智醒樂活 Beyond Scroll" },
      { property: "og:description", content: "按開始散步計時，行完手動填寫距離。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WalkPage,
});

type Phase = "idle" | "running" | "paused" | "form" | "done";

function WalkPage() {
  const { state, dispatch } = useAppState();
  const [phase, setPhase] = useState<Phase>("idle");
  const [acc, setAcc] = useState(0); // ms accumulated before current run
  const [runStart, setRunStart] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [distance, setDistance] = useState("");
  const [minutes, setMinutes] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<Workout | null>(null);

  useEffect(() => {
    if (phase !== "running") return;
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(t);
  }, [phase]);

  const elapsedSec = Math.floor((acc + (phase === "running" && runStart ? now - runStart : 0)) / 1000);
  const prefillMin = String(Math.max(1, Math.round(elapsedSec / 60)));

  const start = () => {
    const t = Date.now();
    setRunStart(t);
    setNow(t);
    setPhase("running");
  };
  const pause = () => {
    setAcc((a) => a + (runStart ? Date.now() - runStart : 0));
    setRunStart(null);
    setPhase("paused");
  };
  const finish = () => {
    const total = acc + (phase === "running" && runStart ? Date.now() - runStart : 0);
    setAcc(total);
    setRunStart(null);
    setMinutes(String(Math.max(1, Math.round(total / 60000))));
    setPhase("form");
  };
  const restart = () => {
    setPhase("idle");
    setAcc(0);
    setRunStart(null);
    setDistance("");
    setMinutes("");
    setError("");
    setSaved(null);
  };

  const save = () => {
    const km = distance.trim() === "" ? undefined : Number(distance);
    const min = Number(minutes);
    if (km !== undefined && (!Number.isFinite(km) || km <= 0 || km > 50)) {
      setError("請輸入 0.1 至 50 之間嘅公里數，或者留空。");
      return;
    }
    if (!Number.isFinite(min) || min <= 0 || min > 600) {
      setError("請輸入 1 至 600 之間嘅分鐘數。");
      return;
    }
    // Keep the exact timer seconds unless the user changed the minutes.
    const durationSec = minutes === prefillFromAcc(acc) && acc >= 1000 ? Math.round(acc / 1000) : Math.round(min * 60);
    const w: Workout = {
      id: newId("w"),
      type: "walk",
      date: toDateKey(new Date()),
      durationSec,
      ...(km !== undefined ? { distanceKm: Math.round(km * 100) / 100 } : {}),
    };
    dispatch({ type: "addWorkout", workout: w });
    setSaved(w);
    setPhase("done");
  };

  const history = state.workouts.filter((w) => w.type === "walk").slice(0, 5);

  return (
    <div className="px-5 pt-4">
      <Link to="/challenges" className="tap -ml-2 inline-flex items-center gap-1 rounded-full px-2 py-2 text-lg font-bold">
        <ArrowLeft className="size-6" /> 返回挑戰
      </Link>
      <h1 className="mt-1 text-3xl font-bold text-primary-deep">🚶 散步</h1>

      {phase === "done" && saved ? (
        <div className="mt-5">
          <WorkoutFinish workout={saved} againLabel="再行一次" onAgain={restart} />
        </div>
      ) : phase === "form" ? (
        <div className="mt-5 space-y-5">
          <div className="app-card p-5 text-center">
            <p className="text-lg text-muted-foreground">計時器紀錄</p>
            <p className="text-5xl font-black tabular-nums text-primary-deep">{formatClock(acc / 1000)}</p>
          </div>
          <div className="app-card space-y-4 p-5">
            <label className="block">
              <span className="mb-2 block text-xl font-bold">步行距離（公里）</span>
              <Input
                type="number"
                inputMode="decimal"
                step="0.1"
                min="0"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="例如 1.5"
                className="h-16 rounded-2xl text-2xl"
              />
              <span className="mt-2 block text-base text-muted-foreground">手動輸入：可以參考計步器或者大概估計，唔知可以留空。</span>
            </label>
            <label className="block">
              <span className="mb-2 block text-xl font-bold">總時間（分鐘）</span>
              <Input
                type="number"
                inputMode="numeric"
                min="1"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="h-16 rounded-2xl text-2xl"
              />
              <span className="mt-2 block text-base text-muted-foreground">已按計時器自動填寫，有需要可以修改。</span>
            </label>
            {error && <p className="rounded-2xl bg-flower-soft p-3 text-lg font-bold text-destructive">{error}</p>}
            <Button variant="hero" size="xxl" className="w-full" onClick={save}>
              儲存紀錄
            </Button>
            <Button variant="soft" size="xl" className="w-full" onClick={() => setPhase("paused")}>
              返回繼續行
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          <div className="rounded-4xl bg-gradient-forest p-6 text-center text-primary-foreground">
            <p className="text-lg opacity-90">
              {phase === "idle" ? "準備好就開始" : phase === "running" ? "散步中…" : "已暫停"}
            </p>
            <p className="my-3 text-7xl font-black tabular-nums" aria-live="polite" role="timer">
              {formatClock(elapsedSec)}
            </p>
            <p className="text-base opacity-90">計時器</p>
          </div>

          {phase === "idle" && (
            <Button variant="hero" size="xxl" className="h-20 w-full text-2xl" onClick={start}>
              <Play className="fill-current" /> 開始散步
            </Button>
          )}
          {phase === "running" && (
            <div className="grid grid-cols-2 gap-3">
              <Button variant="soft" size="xxl" onClick={pause}>
                <Pause /> 暫停
              </Button>
              <Button variant="hero" size="xxl" onClick={finish}>
                <Square className="fill-current" /> 完成
              </Button>
            </div>
          )}
          {phase === "paused" && (
            <div className="grid grid-cols-2 gap-3">
              <Button variant="forest" size="xxl" onClick={start}>
                <Play className="fill-current" /> 繼續
              </Button>
              <Button variant="hero" size="xxl" onClick={finish}>
                <Square className="fill-current" /> 完成
              </Button>
            </div>
          )}

          <div className="flex gap-3 rounded-2xl border border-accent bg-accent-soft p-4 text-base text-accent-foreground">
            <Info className="mt-0.5 size-6 shrink-0" />
            <p className="font-medium">示範版本：暫未接入 GPS 定位，唔會追蹤你嘅位置或自動計距離。行完請手動輸入距離。</p>
          </div>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-primary-deep">散步紀錄</h2>
            {history.length === 0 ? (
              <p className="app-card p-4 text-lg text-muted-foreground">未有散步紀錄。</p>
            ) : (
              <ul className="app-card divide-y divide-border">
                {history.map((w) => (
                  <li key={w.id}>
                    <WorkoutRow w={w} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function prefillFromAcc(accMs: number) {
  return String(Math.max(1, Math.round(accMs / 60000)));
}
