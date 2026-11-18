import { createContext, useContext, useEffect, useReducer, useRef, type ReactNode } from "react";
import { INITIAL_STATE, reducer, type Action, type AppState } from "@/lib/app-state";

const STORAGE_KEY = "beyond-scroll-demo-v1";

const Ctx = createContext<{ state: AppState; dispatch: (a: Action) => void } | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", state: { ...INITIAL_STATE, ...JSON.parse(raw) } });
    } catch {
      /* ignore broken demo data */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable: demo still works in memory */
    }
  }, [state]);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAppState must be used inside AppStateProvider");
  return v;
}
