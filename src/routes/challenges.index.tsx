import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Footprints, Play, Brain } from "lucide-react";

import stretchImg from "@/assets/stretch-chair.jpg";
import eyeImg from "@/assets/eye-relax.jpg";
import { CheckInStats } from "@/components/app/CheckInCalendar";
import { PageHeader, SectionTitle } from "@/components/app/common";
import { Button } from "@/components/ui/button";
import { COURSES, type Course } from "@/lib/demo-data";

export const Route = createFileRoute("/challenges/")({
  head: () => ({
    meta: [
      { title: "挑戰｜智齡樂活 Silver Spark" },
      { name: "description", content: "散步跑步計時記錄、跟做伸展運動同眼部運動，仲有動動腦筋小遊戲。" },
      { property: "og:title", content: "今日挑戰｜智齡樂活 Silver Spark" },
      { property: "og:description", content: "散步、跑步、伸展運動、眼部運動、動腦筋，一按就開始。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChallengesPage,
});

function ChallengesPage() {
  const stretch = COURSES.filter((c) => c.type === "stretch");
  const eye = COURSES.filter((c) => c.type === "eye");
  return (
    <div>
      <PageHeader title="今日挑戰" subtitle="揀一樣，即刻郁動吓" />
      <div className="space-y-8 px-5">
        <CheckInStats compact />

        <section>
          <SectionTitle>🚶 散步 / 跑步</SectionTitle>
          <div className="rounded-4xl bg-gradient-sunrise p-5 shadow-[var(--shadow-cta)]">
            <p className="text-2xl font-bold text-accent-foreground">出去郁動吓，記低每一步</p>
            <p className="mt-1 text-lg text-accent-foreground">揀散步或者跑步，按開始就計時</p>
            <Button asChild variant="forest" size="xxl" className="mt-4 w-full">
              <Link to="/challenges/walk">
                <Footprints /> 開始散步 / 跑步
              </Link>
            </Button>
          </div>
        </section>

        <section>
          <SectionTitle>🧠 動動腦筋</SectionTitle>
          <Link to="/challenges/brain" className="tap app-card flex items-center gap-4 p-5">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-3xl bg-sage-soft text-4xl" aria-hidden>🧠</span>
            <span className="min-w-0 flex-1">
              <span className="block text-2xl font-bold text-primary-deep">動動腦筋</span>
              <span className="block text-lg text-muted-foreground">記憶・邏輯・常識・眼力，日日郁一郁腦</span>
            </span>
            <ChevronRight className="size-8 shrink-0 text-muted-foreground" />
          </Link>
        </section>

        <section>
          <SectionTitle>🧘 伸展運動</SectionTitle>
          <div className="space-y-3">
            {stretch.map((c) => (
              <CourseCard key={c.id} course={c} img={stretchImg} />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>👀 眼部運動</SectionTitle>
          <div className="space-y-3">
            {eye.map((c) => (
              <CourseCard key={c.id} course={c} img={eyeImg} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export function CourseCard({ course, img }: { course: Course; img: string }) {
  return (
    <Link to="/challenges/course/$courseId" params={{ courseId: course.id }} className="tap app-card flex items-center gap-4 overflow-hidden p-3">
      <div className="relative w-28 shrink-0">
        <img src={img} alt="" width={1088} height={608} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-card/90 text-primary">
            <Play className="size-5 fill-current" />
          </span>
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xl font-bold text-primary-deep">{course.title}</p>
        <p className="text-base text-muted-foreground">
          {course.minutes} 分鐘・{course.level}
        </p>
      </div>
      <ChevronRight className="size-6 shrink-0 text-muted-foreground" />
    </Link>
  );
}
