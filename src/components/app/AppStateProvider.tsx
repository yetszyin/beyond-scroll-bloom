import { createContext, useContext, useEffect, useReducer, useRef, useState, type ReactNode } from "react";
import { INITIAL_STATE, reducer, type Action, type AppState } from "@/lib/app-state";
import { seedWorkouts } from "@/lib/workouts";

// v2: activity-log product direction (old reminder-task data is discarded).
const STORAGE_KEY = "beyond-scroll-demo-v2";

interface Ctx {
  state: AppState;
  dispatch: (a: Action) => void;
  /** false during SSR / first paint; date-dependent UI waits for this */
  ready: boolean;
  resetDemo: () => void;
}

const AppCtx = createContext<Ctx | null>(null);

function freshState(): AppState {
  return { ...INITIAL_STATE, workouts: seedWorkouts(new Date()) };
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    let next = freshState();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) next = { ...INITIAL_STATE, ...JSON.parse(raw) };
    } catch {
      /* ignore broken demo data */
    }
    dispatch({ type: "hydrate", state: next });
    hydrated.current = true;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable: demo still works in memory */
    }
  }, [state]);

  const resetDemo = () => dispatch({ type: "reset", state: freshState() });

  return <AppCtx.Provider value={{ state, dispatch, ready, resetDemo }}>{children}</AppCtx.Provider>;
}

export function useAppState() {
  const v = useContext(AppCtx);
  if (!v) throw new Error("useAppState must be used inside AppStateProvider");
  return v;
}
