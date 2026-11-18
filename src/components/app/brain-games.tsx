import { useEffect, useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  buildMemoryRounds,
  buildSpotRounds,
  type ChoiceQuestion,
  type SpotRound,
} from "@/lib/brain";

const ROUND_COUNT = 3;
const seedToday = () => Math.floor(Date.now() / 86400000);

function answerTone(chosen: boolean, correct: boolean) {
  if (correct && chosen) return "border-primary bg-sage-soft text-secondary-foreground";
  if (chosen && !correct) return "border-destructive bg-flower-soft text-destructive";
  return "border-border bg-card";
}

/** 記憶挑戰：先記住一組圖案，再答「第 N 個係乜」。 */
export function BrainMemory({ onDone }: { onDone: (score: number, total: number) => void }) {
  const rounds = useMemo(() => buildMemoryRounds(ROUND_COUNT, seedToday()), []);
  const [round, setRound] = useState(0);
  const [memorizing, setMemorizing] = useState(true);
  const [countdown, setCountdown] = useState(15);
  const [choice, setChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const current = rounds[round];

  useEffect(() => {
    if (!memorizing) return;
    setCountdown(15);
    const t = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          window.clearInterval(t);
          setMemorizing(false);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [round, memorizing]);

  if (choice !== null) {
    return (
      <div className="app-card space-y-4 p-5 text-center">
        <p className={cn("text-2xl font-bold", choice === current.sequence[current.askIndex] ? "text-primary" : "text-destructive")}>
          {choice === current.sequence[current.askIndex] ? "答啱喇！" : "哎呀，呢題答錯咗"}
        </p>
        <p className="text-lg">
          第 {current.askIndex + 1} 個係 <span className="text-3xl">{current.sequence[current.askIndex]}</span>
        </p>
        <Button
          variant="hero"
          size="xxl"
          className="w-full"
          onClick={() => {
            setChoice(null);
            if (round + 1 >= rounds.length) {
              onDone(score, rounds.length);
            } else {
              setRound(round + 1);
              setMemorizing(true);
            }
          }}
        >
          {round + 1 >= rounds.length ? "睇結果" : "下一題"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-center text-lg font-bold text-primary-deep">
        第 {round + 1} 題／共 {rounds.length} 題
      </p>
      <div className="app-card p-6 text-center">
        {memorizing ? (
          <>
            <p className="text-lg text-muted-foreground">睇清楚佢哋嘅次序…</p>
            <p className="mt-4 flex flex-wrap justify-center gap-3 text-6xl" aria-label="要記住嘅圖案">
              {current.sequence.map((e, i) => (
                <span key={i} role="img" aria-label={`第 ${i + 1} 個`}>{e}</span>
              ))}
            </p>
            <p className="mt-6 text-xl font-bold tabular-nums text-accent-foreground">{countdown} 秒</p>
          </>
        ) : (
          <>
            <p className="text-xl font-bold">頭先第 {current.askIndex + 1} 個圖案係邊個？</p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {current.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className="tap flex h-24 items-center justify-center rounded-3xl border-2 bg-card text-5xl"
                  onClick={() => {
                    setChoice(opt);
                    if (opt === current.sequence[current.askIndex]) setScore((s) => s + 1);
                  }}
                >
                  <span role="img" aria-label={opt}>{opt}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** 邏輯挑戰／常識問答共用：逐題四揀一（或二揀一），即時解釋。 */
export function BrainChoices({ questions, onDone }: { questions: ChoiceQuestion[]; onDone: (score: number, total: number) => void }) {
  const [round, setRound] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const q = questions[round % questions.length];
  const answered = choice !== null;

  return (
    <div className="space-y-4">
      <p className="text-center text-lg font-bold text-primary-deep">
        第 {round + 1} 題／共 {questions.length} 題
      </p>
      <div className="app-card space-y-4 p-5">
        <p className="text-2xl font-bold leading-snug">{q.question}</p>
        <div className="grid gap-3">
          {q.options.map((opt, i) => (
            <button
              key={opt}
              type="button"
              disabled={answered}
              onClick={() => {
                setChoice(i);
                if (i === q.answerIndex) setScore((s) => s + 1);
              }}
              className={cn(
                "tap flex min-h-14 items-center rounded-2xl border-2 px-4 py-3 text-left text-xl font-medium transition-colors",
                answered ? answerTone(i === choice, i === q.answerIndex) : "border-border bg-card",
              )}
            >
              {opt}
            </button>
          ))}
        </div>
        {answered && (
          <div className="space-y-3">
            <p className="rounded-2xl bg-sage-soft p-4 text-lg leading-relaxed text-secondary-foreground">{q.explain}</p>
            <Button
              variant="hero"
              size="xxl"
              className="w-full"
              onClick={() => {
                setChoice(null);
                if (round + 1 >= questions.length) {
                  onDone(score, questions.length);
                } else {
                  setRound(round + 1);
                }
              }}
            >
              {round + 1 >= questions.length ? "睇結果" : "下一題"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/** 眼力挑戰：喺圖案格入面搵出唔同嗰個。 */
export function BrainSpot({ onDone }: { onDone: (score: number, total: number) => void }) {
  const rounds = useMemo(() => buildSpotRounds(ROUND_COUNT, seedToday()), []);
  const [round, setRound] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const r: SpotRound = rounds[round];
  const answered = choice !== null;
  const correct = choice === r.oddIndex;

  return (
    <div className="space-y-4">
      <p className="text-center text-lg font-bold text-primary-deep">
        第 {round + 1} 題／共 {rounds.length} 題
      </p>
      <div className="app-card space-y-4 p-5">
        <p className="text-lg">有一個同其他唔同，搵出佢！</p>
        <div className={cn("grid gap-3", r.grid.length > 6 ? "grid-cols-3" : "grid-cols-3")}>
          {r.grid.map((cell, i) => (
            <button
              key={i}
              type="button"
              disabled={answered}
              aria-label={`第 ${i + 1} 格`}
              onClick={() => {
                setChoice(i);
                if (i === r.oddIndex) setScore((s) => s + 1);
              }}
              className={cn(
                "tap flex h-20 items-center justify-center rounded-2xl border-2 text-4xl",
                answered && i === r.oddIndex
                  ? "border-primary bg-sage-soft"
                  : answered && i === choice
                    ? "border-destructive bg-flower-soft"
                    : "border-border bg-card",
              )}
            >
              <span role="img" aria-hidden>{cell}</span>
            </button>
          ))}
        </div>
        {answered && (
          <div className="space-y-3">
            <p className={cn("rounded-2xl p-4 text-lg font-bold", correct ? "bg-sage-soft text-secondary-foreground" : "bg-flower-soft text-destructive")}>
              {correct ? "好眼力！" : "答案喺綠色嗰格。"}
            </p>
            <Button
              variant="hero"
              size="xxl"
              className="w-full"
              onClick={() => {
                setChoice(null);
                if (round + 1 >= rounds.length) {
                  onDone(score, rounds.length);
                } else {
                  setRound(round + 1);
                }
              }}
            >
              {round + 1 >= rounds.length ? "睇結果" : "下一題"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function BrainBackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="tap -ml-2 inline-flex items-center gap-1 rounded-full px-2 py-2 text-lg font-bold">
      <ChevronLeft className="size-6" /> {label}
    </Link>
  );
}
