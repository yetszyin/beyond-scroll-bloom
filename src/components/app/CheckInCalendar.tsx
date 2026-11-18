import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Flame, CalendarCheck } from "lucide-react";

import { useAppState } from "@/components/app/AppStateProvider";
import { TYPE_DOT, WorkoutRow } from "@/components/app/workout-ui";
import { cn } from "@/lib/utils";
import { WORKOUT_LABEL, currentStreak, formatDateKey, monthCheckInDays, toDateKey, workoutsOn, type WorkoutType } from "@/lib/workouts";

const WEEK = ["日", "一", "二", "三", "四", "五", "六"];

export function useToday() {
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(new Date()), []);
  return today;
}

export function CheckInStats({ compact }: { compact?: boolean }) {
  const { state, ready } = useAppState();
  const today = useToday();
  const month = today && ready ? monthCheckInDays(state.workouts, today.getFullYear(), today.getMonth()) : null;
  const streak = today && ready ? currentStreak(state.workouts, today) : null;
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className={cn("rounded-3xl bg-sage-soft p-4", compact && "p-3")}>
        <p className="flex items-center gap-1 text-base text-secondary-foreground">
          <CalendarCheck className="size-5" /> 本月打卡
        </p>
        <p className="text-3xl font-black text-primary-deep">
          {month ?? "–"} <span className="text-lg font-bold">日</span>
        </p>
      </div>
      <div className={cn("rounded-3xl bg-accent-soft p-4", compact && "p-3")}>
        <p className="flex items-center gap-1 text-base text-accent-foreground">
          <Flame className="size-5" /> 連續打卡
        </p>
        <p className="text-3xl font-black text-accent-foreground">
          {streak ?? "–"} <span className="text-lg font-bold">日</span>
        </p>
      </div>
    </div>
  );
}

export function CheckInCalendar() {
  const { state, ready } = useAppState();
  const today = useToday();
  const [view, setView] = useState<{ y: number; m: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (today && !view) {
      setView({ y: today.getFullYear(), m: today.getMonth() });
      setSelected(toDateKey(today));
    }
  }, [today, view]);

  const typesByDay = useMemo(() => {
    const map = new Map<string, Set<WorkoutType>>();
    for (const w of state.workouts) {
      if (!map.has(w.date)) map.set(w.date, new Set());
      map.get(w.date)!.add(w.type);
    }
    return map;
  }, [state.workouts]);

  if (!today || !view || !ready) {
    return <div className="app-card h-96 animate-pulse" aria-label="載入日曆中" />;
  }

  const first = new Date(view.y, view.m, 1);
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(first.getDay()).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const todayKey = toDateKey(today);
  const isCurrentMonth = view.y === today.getFullYear() && view.m === today.getMonth();
  const dayList = selected ? workoutsOn(state.workouts, selected) : [];

  const shift = (n: number) => {
    const d = new Date(view.y, view.m + n, 1);
    setView({ y: d.getFullYear(), m: d.getMonth() });
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      <div className="app-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <button type="button" onClick={() => shift(-1)} aria-label="上個月" className="tap flex size-12 items-center justify-center rounded-full bg-muted">
            <ChevronLeft className="size-6" />
          </button>
          <p className="text-xl font-bold text-primary-deep">
            {view.y}年{view.m + 1}月
          </p>
          <button
            type="button"
            onClick={() => shift(1)}
            disabled={isCurrentMonth}
            aria-label="下個月"
            className="tap flex size-12 items-center justify-center rounded-full bg-muted disabled:opacity-30"
          >
            <ChevronRight className="size-6" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEK.map((d) => (
            <span key={d} className="py-1 text-base font-bold text-muted-foreground">
              {d}
            </span>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <span key={`e${i}`} />;
            const key = toDateKey(new Date(view.y, view.m, day));
            const types = typesByDay.get(key);
            const isToday = key === todayKey;
            const isSel = key === selected;
            const future = key > todayKey;
            return (
              <button
                key={key}
                type="button"
                disabled={future}
                onClick={() => setSelected(key)}
                aria-label={`${view.m + 1}月${day}日${types ? `，已打卡：${[...types].map((t) => WORKOUT_LABEL[t]).join("、")}` : ""}`}
                className={cn(
                  "tap flex aspect-square flex-col items-center justify-center rounded-2xl text-lg font-bold disabled:opacity-35",
                  types ? "bg-secondary text-primary-deep" : "text-foreground",
                  isToday && "ring-2 ring-accent",
                  isSel && "bg-primary text-primary-foreground",
                )}
              >
                {day}
                <span className="mt-0.5 flex h-2 gap-0.5">
                  {types && [...types].map((t) => <span key={t} className={cn("size-2 rounded-full", TYPE_DOT[t])} />)}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          {(Object.keys(TYPE_DOT) as WorkoutType[]).map((t) => (
            <span key={t} className="inline-flex items-center gap-1">
              <span className={cn("size-3 rounded-full", TYPE_DOT[t])} /> {WORKOUT_LABEL[t]}
            </span>
          ))}
        </div>
      </div>

      {selected && (
        <div className="app-card overflow-hidden">
          <p className="border-b border-border bg-muted px-4 py-3 text-lg font-bold">{formatDateKey(selected)} 嘅活動</p>
          {dayList.length === 0 ? (
            <p className="p-4 text-lg text-muted-foreground">呢日未有打卡紀錄。</p>
          ) : (
            <ul className="divide-y divide-border">
              {dayList.map((w) => (
                <li key={w.id}>
                  <WorkoutRow w={w} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
