import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Eye, Armchair, Footprints, Puzzle, CheckCircle2, ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { useAppState } from "@/components/app/AppStateProvider";
import { MemoryGame } from "@/components/app/MemoryGame";
import { PageHeader } from "@/components/app/common";
import { Button } from "@/components/ui/button";
import { CHALLENGE_REWARD } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/challenges")({
  head: () => ({
    meta: [
      { title: "挑戰｜智醒樂活 Beyond Scroll" },
      { name: "description", content: "護眼操、椅上伸展、散步打卡同記憶翻牌益智遊戲，放低手機郁動吓。" },
      { property: "og:title", content: "今日挑戰｜智醒樂活 Beyond Scroll" },
      { property: "og:description", content: "護眼操、椅上伸展、散步打卡同記憶翻牌益智遊戲。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChallengesPage,
});

const rewardText = `+${CHALLENGE_REWARD.points} 積分、+${CHALLENGE_REWARD.flowers} 朵小紅花`;

function useComplete() {
  const { state, dispatch } = useAppState();
  const complete = useCallback(
    (id: string, title: string) => {
      if (state.completedChallenges.includes(id)) {
        toast("今日已經打過卡啦，聽日再嚟！");
        return;
      }
      dispatch({ type: "completeChallenge", id, title });
      toast.success(`打卡成功！${rewardText}`);
    },
    [dispatch, state.completedChallenges],
  );
  return { done: (id: string) => state.completedChallenges.includes(id), complete, count: state.completedChallenges.length };
}

function ChallengesPage() {
  const { done, count } = useComplete();
  return (
    <div>
      <PageHeader title="今日挑戰" subtitle="放低手機，郁動吓身體同腦筋" />
      <div className="px-5">
        <div className="mb-5 rounded-3xl bg-gradient-forest p-5 text-primary-foreground">
          <p className="text-lg">今日進度</p>
          <p className="text-3xl font-black">已完成 {count} / 4 項</p>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-primary-foreground/25">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(count / 4) * 100}%` }} />
          </div>
          <p className="mt-2 text-base opacity-90">每完成一項：{rewardText}</p>
        </div>
        <div className="space-y-4">
          <ChallengeCard id="eye" icon={<Eye className="size-7" />} title="護眼操" desc="約 1 分鐘・跟住做 4 個步驟" done={done("eye")} tone="bg-sky-soft">
            <EyeExercise />
          </ChallengeCard>
          <ChallengeCard id="stretch" icon={<Armchair className="size-7" />} title="椅上伸展" desc="坐喺椅度都做得・4 個動作" done={done("stretch")} tone="bg-sage-soft">
            <ChairStretch />
          </ChallengeCard>
          <ChallengeCard id="walk" icon={<Footprints className="size-7" />} title="散步任務" desc="揀時間，行完就打卡" done={done("walk")} tone="bg-accent-soft">
            <WalkTask />
          </ChallengeCard>
          <ChallengeCard id="game" icon={<Puzzle className="size-7" />} title="益智遊戲：記憶翻牌" desc="配對相同圖案，訓練記性" done={done("game")} tone="bg-lilac-soft">
            <GameTask />
          </ChallengeCard>
        </div>
      </div>
    </div>
  );
}

function ChallengeCard({
  id,
  icon,
  title,
  desc,
  done,
  tone,
  children,
}: {
  id: string;
  icon: ReactNode;
  title: string;
  desc: string;
  done: boolean;
  tone: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <article className="app-card overflow-hidden" id={`challenge-${id}`}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="tap flex w-full items-center gap-4 p-4 text-left"
      >
        <span className={cn("flex size-14 shrink-0 items-center justify-center rounded-2xl text-primary-deep", tone)}>{icon}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-xl font-bold text-primary-deep">{title}</span>
          <span className="block text-base text-muted-foreground">{desc}</span>
          {done && (
            <span className="mt-1 inline-flex items-center gap-1 text-base font-bold text-primary">
              <CheckCircle2 className="size-5" /> 今日已打卡
            </span>
          )}
        </span>
        <ChevronDown className={cn("size-7 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="border-t border-border p-4">{children}</div>}
    </article>
  );
}

const EYE_STEPS = [
  { text: "用力眨眼 10 次", seconds: 10 },
  { text: "望向遠處綠色景物 20 秒", seconds: 20 },
  { text: "眼球慢慢轉圈，順時針、逆時針各 5 次", seconds: 15 },
  { text: "搓暖雙手，輕輕敷住雙眼", seconds: 10 },
];

function EyeExercise() {
  const { complete, done } = useComplete();
  const [step, setStep] = useState(-1);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    if (step < 0 || step >= EYE_STEPS.length) return;
    setLeft(EYE_STEPS[step].seconds);
    const t = window.setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => window.clearInterval(t);
  }, [step]);

  if (step < 0) {
    return (
      <div className="space-y-3">
        <ol className="list-decimal space-y-1 pl-6 text-lg">
          {EYE_STEPS.map((s) => (
            <li key={s.text}>{s.text}</li>
          ))}
        </ol>
        <Button variant="forest" size="xl" className="w-full" onClick={() => setStep(0)}>
          開始護眼操
        </Button>
      </div>
    );
  }

  if (step >= EYE_STEPS.length) {
    return (
      <div className="space-y-3 text-center">
        <p className="text-5xl" aria-hidden>👏</p>
        <p className="text-xl font-bold">做完啦！雙眼舒服啲未？</p>
        <Button variant="hero" size="xl" className="w-full" disabled={done("eye")} onClick={() => complete("eye", "護眼操")}>
          {done("eye") ? "今日已打卡" : "完成打卡"}
        </Button>
        <Button variant="soft" size="xl" className="w-full" onClick={() => setStep(0)}>
          再做一次
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-center">
      <p className="text-base text-muted-foreground">
        第 {step + 1} / {EYE_STEPS.length} 步
      </p>
      <p className="text-2xl font-bold text-primary-deep">{EYE_STEPS[step].text}</p>
      <p className="text-6xl font-black tabular-nums text-accent-foreground" aria-live="polite">
        {left}
        <span className="ml-1 text-2xl">秒</span>
      </p>
      <Button variant="forest" size="xl" className="w-full" onClick={() => setStep((s) => s + 1)}>
        {step === EYE_STEPS.length - 1 ? "做完" : "下一步"}
      </Button>
    </div>
  );
}

const STRETCHES = ["坐直，慢慢深呼吸 5 次", "輪流抬起雙腿，各 10 次", "雙肩向後轉圈 10 次", "雙手舉高，向左右兩邊伸展"];

function ChairStretch() {
  const { complete, done } = useComplete();
  const [checked, setChecked] = useState<number[]>([]);
  const all = checked.length === STRETCHES.length;
  return (
    <div className="space-y-3">
      <p className="text-base text-muted-foreground">請用有靠背、穩陣嘅椅，做每個動作都慢慢嚟。</p>
      <ul className="space-y-2">
        {STRETCHES.map((s, i) => {
          const on = checked.includes(i);
          return (
            <li key={s}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setChecked((c) => (on ? c.filter((x) => x !== i) : [...c, i]))}
                className={cn(
                  "tap flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left text-lg",
                  on ? "border-sage bg-sage-soft font-bold" : "border-border bg-card",
                )}
              >
                <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full border-2", on ? "border-primary bg-primary text-primary-foreground" : "border-input")}>
                  {on && <CheckCircle2 className="size-6" />}
                </span>
                {s}
              </button>
            </li>
          );
        })}
      </ul>
      <Button variant="hero" size="xl" className="w-full" disabled={!all || done("stretch")} onClick={() => complete("stretch", "椅上伸展")}>
        {done("stretch") ? "今日已打卡" : all ? "完成打卡" : `完成全部動作先可以打卡（${checked.length}/4）`}
      </Button>
    </div>
  );
}

function WalkTask() {
  const { complete, done } = useComplete();
  const [mins, setMins] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      <p className="text-lg">今日想行幾耐？</p>
      <div className="grid grid-cols-3 gap-2">
        {[10, 20, 30].map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mins === m}
            onClick={() => setMins(m)}
            className={cn(
              "tap rounded-2xl border-2 py-4 text-xl font-bold",
              mins === m ? "border-accent bg-accent-soft text-accent-foreground" : "border-border bg-card",
            )}
          >
            {m} 分鐘
          </button>
        ))}
      </div>
      <Button
        variant="hero"
        size="xl"
        className="w-full"
        disabled={!mins || done("walk")}
        onClick={() => mins && complete("walk", `散步任務 ${mins} 分鐘`)}
      >
        {done("walk") ? "今日已打卡" : mins ? `我行完 ${mins} 分鐘喇，打卡！` : "請先揀時間"}
      </Button>
      <p className="text-sm text-muted-foreground">示範：打卡以自行確認為準，本 Demo 不會讀取步數或位置。</p>
    </div>
  );
}

function GameTask() {
  const { complete, done } = useComplete();
  const onWin = useCallback(() => {
    if (done("game")) {
      toast.success("再次完成，好叻！今日已經打過卡啦。");
    } else {
      complete("game", "記憶翻牌遊戲");
    }
  }, [complete, done]);
  return <MemoryGame onWin={onWin} />;
}
