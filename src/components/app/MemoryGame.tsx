import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SYMBOLS = ["🍊", "🌻", "🍵", "🐦"];

interface Card {
  key: number;
  symbol: string;
  matched: boolean;
}

function shuffled(): Card[] {
  const deck = [...SYMBOLS, ...SYMBOLS].map((symbol, key) => ({ key, symbol, matched: false }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = deck[i]!;
    deck[i] = deck[j]!;
    deck[j] = tmp;
  }
  return deck;
}

export function MemoryGame({ onWin }: { onWin: (moves: number) => void }) {
  const [cards, setCards] = useState<Card[] | null>(null);
  const [open, setOpen] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const winRef = useRef(onWin);
  winRef.current = onWin;

  const start = () => {
    setCards(shuffled());
    setOpen([]);
    setMoves(0);
    setWon(false);
  };

  useEffect(() => {
    if (!cards || open.length !== 2) return;
    const [a, b] = open as [number, number];
    const isMatch = cards[a]?.symbol === cards[b]?.symbol;
    const t = window.setTimeout(
      () => {
        if (isMatch) {
          const next = cards.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c));
          setCards(next);
          if (next.every((c) => c.matched)) {
            setWon(true);
            winRef.current(moves);
          }
        }
        setOpen([]);
      },
      isMatch ? 350 : 900,
    );
    return () => window.clearTimeout(t);
  }, [open, cards, moves]);

  const flip = (i: number) => {
    if (!cards || open.length === 2 || open.includes(i) || cards[i]?.matched) return;
    if (open.length === 1) setMoves((m) => m + 1);
    setOpen((o) => [...o, i]);
  };

  if (!cards) {
    return (
      <div className="space-y-3">
        <p className="text-lg">翻開兩張卡，如果圖案一樣就配對成功。試吓用最少步數完成！</p>
        <Button variant="forest" size="xl" className="w-full" onClick={start}>
          開始遊戲
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-lg">
        <span>
          步數：<b>{moves}</b>
        </span>
        <span>
          已配對：<b>{cards.filter((c) => c.matched).length / 2}</b>/{SYMBOLS.length}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {cards.map((c, i) => {
          const faceUp = c.matched || open.includes(i);
          return (
            <button
              key={c.key}
              type="button"
              aria-label={faceUp ? `卡片：${c.symbol}` : "未翻開嘅卡片"}
              onClick={() => flip(i)}
              className={cn(
                "tap flex aspect-[3/4] items-center justify-center rounded-2xl border-2 text-4xl font-black transition-colors",
                faceUp
                  ? c.matched
                    ? "border-sage bg-sage-soft"
                    : "border-accent bg-accent-soft"
                  : "border-primary bg-gradient-forest text-primary-foreground",
              )}
            >
              {faceUp ? <span className="animate-pop-in">{c.symbol}</span> : "？"}
            </button>
          );
        })}
      </div>
      {won && (
        <p className="rounded-2xl bg-sage-soft p-3 text-center text-lg font-bold text-secondary-foreground">
          🎉 全部配對成功！用咗 {moves} 步
        </p>
      )}
      <Button variant="soft" size="xl" className="w-full" onClick={start}>
        <RotateCcw /> 重新開始
      </Button>
    </div>
  );
}
