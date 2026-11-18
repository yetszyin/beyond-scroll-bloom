// 示範散步／跑步路線：純 SVG 座標（0-100 viewport），唔係真實 GPS。
// 每條路線有起點、終點、示意距離同時間，只作靜態展示。

export interface DemoRoute {
  id: string;
  name: string;
  type: "walk" | "run";
  /** schematic path in a 0-100 coordinate space */
  points: [number, number][];
  distanceKm: number;
  durationSec: number;
  steps: number;
  landmarks: string[];
}

export const DEMO_ROUTES: DemoRoute[] = [
  {
    id: "park-loop",
    name: "公園晨運圈",
    type: "walk",
    points: [
      [12, 78],
      [30, 62],
      [52, 68],
      [70, 50],
      [60, 30],
      [38, 26],
      [20, 40],
      [12, 78],
    ],
    distanceKm: 2.4,
    durationSec: 34 * 60,
    steps: 3400,
    landmarks: ["東門入口", "荷花池", "涼亭", "體育館"],
  },
  {
    id: "river-jog",
    name: "河畔跑步線",
    type: "run",
    points: [
      [10, 85],
      [22, 70],
      [38, 60],
      [55, 55],
      [72, 42],
      [88, 28],
    ],
    distanceKm: 3.8,
    durationSec: 27 * 60,
    steps: 5200,
    landmarks: ["橋底起步點", "觀景台", "終點長廊"],
  },
  {
    id: "estate-stroll",
    name: "屋邨慢慢行",
    type: "walk",
    points: [
      [15, 25],
      [35, 30],
      [45, 50],
      [60, 65],
      [80, 72],
      [85, 50],
      [65, 20],
      [40, 15],
      [15, 25],
    ],
    distanceKm: 1.6,
    durationSec: 24 * 60,
    steps: 2300,
    landmarks: ["街市", "圖書館", "巴士站"],
  },
];

export function routeToPath(points: [number, number][]): string {
  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");
}

/** turn a finished workout into a display route: pick by type, alternate per date+id */
export function routeForWorkout(date: string, id: string, type: "walk" | "run"): DemoRoute {
  const pool = DEMO_ROUTES.filter((r) => r.type === type);
  const list = pool.length > 0 ? pool : DEMO_ROUTES;
  let hash = 0;
  for (const ch of `${date}${id}`) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return list[hash % list.length];
}
