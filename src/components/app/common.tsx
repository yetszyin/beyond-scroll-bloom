import type { ReactNode } from "react";
import { HeartPulse, Palette, Music, Sprout, HandHeart, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { DISCLAIMER, type Theme, type ThemeId } from "@/lib/demo-data";

export function DemoStrip() {
  return (
    <div className="sticky top-0 z-30 bg-primary-deep px-4 py-1.5 text-center text-sm font-medium text-primary-foreground">
      產品示範 Demo・所有數據及互動均為示範
    </div>
  );
}

export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <header className="flex items-start justify-between gap-3 px-5 pb-2 pt-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-deep">{title}</h1>
        {subtitle && <p className="mt-1 text-lg text-muted-foreground">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 className="text-2xl font-bold text-primary-deep">{children}</h2>
      {action}
    </div>
  );
}

export function DemoBadge({ children = "示範", className }: { children?: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-accent bg-accent-soft px-2.5 py-0.5 text-sm font-bold text-accent-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Disclaimer({ className }: { className?: string }) {
  return (
    <div className={cn("flex gap-3 rounded-2xl border border-accent bg-accent-soft p-4 text-base text-accent-foreground", className)}>
      <Info className="mt-0.5 size-6 shrink-0" />
      <p className="font-medium leading-relaxed">{DISCLAIMER}</p>
    </div>
  );
}

export const TONE_CLASSES: Record<Theme["tone"], string> = {
  sage: "bg-sage-soft text-secondary-foreground",
  accent: "bg-accent-soft text-accent-foreground",
  sky: "bg-sky-soft text-foreground",
  lilac: "bg-lilac-soft text-foreground",
  flower: "bg-flower-soft text-foreground",
};

const ICONS: Record<ThemeId, typeof HeartPulse> = {
  health: HeartPulse,
  arts: Palette,
  music: Music,
  garden: Sprout,
  volunteer: HandHeart,
};

export function ThemeIcon({ id, className }: { id: ThemeId; className?: string }) {
  const Icon = ICONS[id];
  return <Icon className={className} strokeWidth={2.2} />;
}

export function FlowerCount({ count, className }: { count: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 font-bold text-flower", className)}>
      <span aria-hidden>🌺</span>
      {count}
    </span>
  );
}
