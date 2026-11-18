import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppStateProvider } from "@/components/app/AppStateProvider";
import { BottomNav } from "@/components/app/BottomNav";
import { DemoStrip } from "@/components/app/common";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-6xl" aria-hidden>
          🌿
        </p>
        <h1 className="mt-4 text-2xl font-bold text-primary-deep">搵唔到呢一頁</h1>
        <p className="mt-2 text-lg text-muted-foreground">呢個頁面唔存在或者已經搬咗。</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex h-14 items-center justify-center rounded-2xl bg-primary px-6 text-lg font-bold text-primary-foreground"
          >
            返回首頁
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-primary-deep">頁面暫時未能載入</h1>
        <p className="mt-2 text-lg text-muted-foreground">請再試一次，或者返回首頁。</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex h-14 items-center justify-center rounded-2xl bg-primary px-6 text-lg font-bold text-primary-foreground"
          >
            再試一次
          </button>
          <a
            href="/"
            className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-border bg-card px-6 text-lg font-bold text-foreground"
          >
            返回首頁
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#2f5d43" },
      { title: "智齡樂活 Silver Spark｜長者數碼健康生活示範" },
      { name: "description", content: "智齡樂活 Silver Spark：陪長者放低手機、郁動身體、參加線下活動嘅互動示範 App。" },
      { property: "og:title", content: "智齡樂活 Silver Spark" },
      { property: "og:description", content: "陪長者放低手機、郁動身體、參加線下活動嘅互動示範 App。" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "zh_HK" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=LXGW+WenKai+TC:wght@400;700&family=Noto+Sans+TC:wght@400;500;700;900&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-HK">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AppStateProvider>
        <div className="relative mx-auto min-h-dvh max-w-[480px] bg-background shadow-[var(--shadow-card)]">
          <DemoStrip />
          <main className="pb-32">
            <Outlet />
          </main>
          <BottomNav />
        </div>
        <Toaster position="top-center" />
      </AppStateProvider>
    </QueryClientProvider>
  );
}
