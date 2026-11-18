import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { useAppState } from "@/components/app/AppStateProvider";
import { PageHeader } from "@/components/app/common";
import { BrainMemory, BrainChoices, BrainSpot } from "@/components/app/brain-games";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toDateKey } from "@/lib/workouts";
import {
  BRAIN_GAMES,
  LOGIC_QUESTIONS,
  TRIVIA_QUESTIONS,
  brainEncouragement,
  brainProgress,
  buildMemoryRounds,
  buildSpotRounds,
  dailyGameIndex,
  gameMeta,
  type BrainGameId,
} from "@/lib/brain";

export const Route = createFileRoute("/challenges/brain")({
  head: () => ({
    meta: [
      { title: "動動腦筋｜智齡樂活 Silver Spark" },
      { name: "description", content: "記憶、邏輯、常識問答、眼力四款小遊戲，日日動腦保持思考活力。" },
      { property: "og:title", content: "動動腦筋｜智齡樂活 Silver Spark" },
      { property: "og:description", content: "四款長者友善嘅動腦小遊戲，日日玩三分鐘。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BrainPage,
});

export function BrainPage() {
  const { state, dispatch } = useAppState();
  const [active, setActive] = useState<BrainGameId | null>(null);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);

  const today = dailyGameIndex(new Date());
  const progress = brainProgress(state.brainResults);

  const finish = (gameId: BrainGameId, score: number, total: number) => {
    dispatch({ type: "addBrainResult", result: { gameId, date: toDateKey(new Date()), score, total } });
    setResult({ score, total });
  };

  const meta = active ? gameMeta(active) : null;

  return (
    <div>
      <PageHeader
        title="動動腦筋"
        subtitle="日日郁一郁腦，保持思考活力"
        back={{
          label: active ? "返回專區" : "返回挑戰",
          to: active ? "/challenges/brain" : "/challenges",
        }}
      />
      <div className="space-y-6 px-5">
        {active === null && meta === null ? (
          <>
            <section className="rounded-4xl bg-gradient-forest p-5 text-primary-foreground">
              <p className="text-lg opacity-90">今日推薦</p>
              <p className="mt-1 text-2xl font-bold">{gameMeta(today).emoji} {gameMeta(today).title}</p>
              <p className="mt-1 text-lg opacity-90">{gameMeta(today).subtitle}</p>
              <Button variant="sunrise" size="xl" className="mt-4 w-full" onClick={() => setActive(today)}>
                王住嚟玩
              </Button>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-bold text-primary-deep">揀一款開始</h2>
              <div className="grid grid-cols-2 gap-3">
                {BRAIN_GAMES.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setActive(g.id)}
                    className="tap app-card flex flex-col gap-2 p-4 text-left"
                  >
                    <span className={cn("flex size-14 items-center justify-center rounded-2xl text-3xl", g.tone)} aria-hidden>
                      {g.emoji}
                    </span>
                    <span className="text-xl font-bold text-primary-deep">{g.title}</span>
                    <span className="text-base text-muted-foreground">{g.subtitle}</span>
                    {g.id === today && <span className="w-fit rounded-full bg-secondary px-2 py-0.5 text-sm font-bold text-secondary-foreground">今日推薦</span>}
                  </button>
                ))}
              </div>
            </section>

            <section className="app-card p-5">
              <h2 className="text-2xl font-bold text-primary-deep">我的動腦紀錄</h2>
              <p className="mt-2 text-lg text-muted-foreground">
                {progress.plays === 0
                  ? "仲未玩過，玩完一局就會喺呢度睇到進度。"
                  : `已經玩咗 ${progress.plays} 局，其中 ${progress.perfect} 局全對，仲有 ${progress.days} 日玩過。`}
              </p>
              <p className="mt-2 text-base text-muted-foreground">紀錄只存喺本機，係簡單嘅個人進度，唔設排行榜。</p>
            </section>
          </>
        ) : result ? (
          <div className="space-y-5">
            <div className="rounded-4xl bg-gradient-forest p-6 text-center text-primary-foreground">
              <p className="text-5xl animate-pop-in" aria-hidden>🎉</p>
              <h2 className="mt-2 text-3xl font-bold">
                {result.score} / {result.total} 正確
              </h2>
              <p className="mt-2 text-lg opacity-90">{brainEncouragement(result.score, result.total)}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Button variant="hero" size="xxl" onClick={() => { setResult(null); }}>
                再玩一次
              </Button>
              <Button variant="soft" size="xl" onClick={() => { setResult(null); setActive(null); }}>
                揀另一款
              </Button>
            </div>
          </div>
        ) : (
          meta && (
            <div className="space-y-5">
              <div className={cn("rounded-4xl p-5", meta.tone)}>
                <p className="text-2xl font-bold">{meta.emoji} {meta.title}</p>
                <p className="mt-2 text-lg leading-relaxed">{meta.howto}</p>
              </div>
              {active === "memory" && <BrainMemory onDone={(s, t) => finish("memory", s, t)} />}
              {active === "logic" && <BrainChoices questions={LOGIC_QUESTIONS} onDone={(s, t) => finish("logic", s, t)} />}
              {active === "trivia" && <BrainChoices questions={TRIVIA_QUESTIONS} onDone={(s, t) => finish("trivia", s, t)} />}
              {active === "spot" && <BrainSpot onDone={(s, t) => finish("spot", s, t)} />}
              <Button variant="soft" size="xl" className="w-full" onClick={() => setActive(null)}>
                返回專區
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
