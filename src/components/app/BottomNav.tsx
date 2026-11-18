import { Link } from "@tanstack/react-router";
import { Home, Trophy, CalendarHeart, UserRound } from "lucide-react";

const ITEMS = [
  { to: "/", label: "首頁", icon: Home, exact: true },
  { to: "/challenges", label: "挑戰", icon: Trophy, exact: false },
  { to: "/activities", label: "活動", icon: CalendarHeart, exact: false },
  { to: "/me", label: "我的", icon: UserRound, exact: false },
] as const;

export function BottomNav() {
  return (
    <nav
      aria-label="主要導航"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-float)] backdrop-blur"
    >
      <ul className="grid grid-cols-4 gap-1 px-2 py-2">
        {ITEMS.map(({ to, label, icon: Icon, exact }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact }}
              className="tap group flex flex-col items-center gap-0.5 rounded-2xl py-2 text-muted-foreground data-[status=active]:bg-secondary data-[status=active]:text-primary-deep"
            >
              <Icon className="size-7" strokeWidth={2.2} />
              <span className="text-base font-bold">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
