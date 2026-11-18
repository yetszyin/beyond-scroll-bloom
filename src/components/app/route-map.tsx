import { Info, MapPin, Flag } from "lucide-react";

import { DemoBadge } from "@/components/app/common";
import { cn } from "@/lib/utils";
import { routeToPath, type DemoRoute } from "@/lib/routes-demo";

/**
 * 靜態路線示意圖。用 SVG 畫出示範路線，標示起點終點同基本資料；
 * 唔係 GPS 定位，亦唔會追蹤位置。
 */
export function RouteMapCard({ route, className }: { route: DemoRoute; className?: string }) {
  const stroke = route.type === "run" ? "var(--color-accent)" : "var(--color-primary)";
  const first = route.points[0];
  const last = route.points[route.points.length - 1];
  const closed = first[0] === last[0] && first[1] === last[1];

  return (
    <section className={cn("app-card overflow-hidden", className)} aria-label="運動路線紀錄（示意圖）">
      <div className="flex items-center justify-between gap-2 bg-sky-soft px-5 py-3">
        <h3 className="flex items-center gap-2 text-xl font-bold text-foreground">
          <MapPin className="size-6 text-primary" aria-hidden />
          {route.name}
        </h3>
        <DemoBadge>示意路線</DemoBadge>
      </div>

      <div className="bg-sky-soft/60 px-5 pb-2">
        <svg viewBox="0 0 100 100" className="h-52 w-full" role="img" aria-label={`${route.name}路線示意圖，全長約 ${route.distanceKm} 公里`}>
          {/* grid backdrop for a map feel */}
          <defs>
            <pattern id="map-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="var(--color-border)" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#map-grid)" rx="4" />
          {/* riversque green patches as decoration */}
          <circle cx="24" cy="24" r="9" fill="var(--color-sage-soft)" />
          <circle cx="82" cy="76" r="12" fill="var(--color-sage-soft)" />
          <rect x="60" y="8" width="16" height="12" rx="2" fill="var(--color-accent-soft)" />

          <path d={routeToPath(route.points)} fill="none" stroke={stroke} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={route.type === "run" ? undefined : "0.5 0"} />
          {/* direction arrows */}
          <path d={routeToPath(route.points)} fill="none" stroke={stroke} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.15" strokeWidth="6" />

          {/* start marker */}
          <circle cx={first[0]} cy={first[1]} r="3.4" fill="var(--color-card)" stroke={stroke} strokeWidth="1.6" />
          <circle cx={first[0]} cy={first[1]} r="1.4" fill={stroke} />
          {/* end marker */}
          {!closed && (
            <>
              <rect x={last[0] - 3} y={last[1] - 3} width="6" height="6" rx="1.2" fill="var(--color-flower)" stroke="var(--color-card)" strokeWidth="1.2" />
            </>
          )}
        </svg>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 text-base text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Flag className="size-5 text-primary" /> 起點：{route.landmarks[0]}</span>
        <span>終點：{closed ? `返回${route.landmarks[0]}（循環線）` : route.landmarks[route.landmarks.length - 1]}</span>
      </div>
      <dl className="grid grid-cols-3 divide-x divide-border border-t border-border text-center">
        <div className="p-3">
          <dt className="text-base text-muted-foreground">距離</dt>
          <dd className="text-xl font-bold text-primary-deep">{route.distanceKm} 公里</dd>
        </div>
        <div className="p-3">
          <dt className="text-base text-muted-foreground">時間</dt>
          <dd className="text-xl font-bold text-primary-deep">{Math.round(route.durationSec / 60)} 分鐘</dd>
        </div>
        <div className="p-3">
          <dt className="text-base text-muted-foreground">步數</dt>
          <dd className="text-xl font-bold text-primary-deep">{route.steps.toLocaleString()}</dd>
        </div>
      </dl>
      <p className="flex items-start gap-2 border-t border-border bg-muted/60 px-5 py-3 text-base text-muted-foreground">
        <Info className="mt-0.5 size-5 shrink-0" aria-hidden />
        呢個係運動紀錄嘅示意路線（示範數據），唔係即時 GPS 定位，亦唔會追蹤你嘅位置。
      </p>
    </section>
  );
}
