import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, Clock, MapPin, Wallet, Users, ExternalLink, CheckCircle2, UserPlus, Footprints, Building2, Hourglass } from "lucide-react";
import { toast } from "sonner";

import { useAppState } from "@/components/app/AppStateProvider";
import { DemoBadge, Disclaimer } from "@/components/app/common";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FRIENDS, getActivity, type Activity } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const dialogClass = "w-[calc(100%-2rem)] max-w-[440px] max-h-[90dvh] overflow-y-auto rounded-3xl bg-card p-6";

export function InfoRow({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex gap-3 py-2">
      <Icon className="mt-1 size-6 shrink-0 text-primary" />
      <div>
        <p className="text-base text-muted-foreground">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}

export function ActivityDetails({ activity }: { activity: Activity }) {
  return (
    <div className="divide-y divide-border">
      <InfoRow icon={Building2} label="主辦機構" value={activity.organiser} />
      <InfoRow icon={CalendarDays} label="日期" value={activity.date} />
      <InfoRow icon={Clock} label="時間" value={activity.time} />
      <InfoRow icon={MapPin} label="地點" value={activity.location} />
      <InfoRow icon={Wallet} label="收費" value={activity.fee} />
      <InfoRow icon={Users} label="名額" value={activity.quota} />
      <InfoRow icon={Hourglass} label="截止報名" value={activity.deadline} />
    </div>
  );
}

export function SourceLink({ activity }: { activity: Activity }) {
  if (!activity.sourceUrl) return null;
  return (
    <a
      href={activity.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="tap inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary bg-card px-5 py-3 text-lg font-bold text-primary"
    >
      <ExternalLink className="size-6" /> 查看主辦機構官方活動資料
    </a>
  );
}

export function ActivityActions({ activity }: { activity: Activity }) {
  const { state } = useAppState();
  const [dialog, setDialog] = useState<null | "register" | "invite" | "buddy">(null);
  const registered = state.registrations.includes(activity.id);
  return (
    <>
      <div className="space-y-3">
        <Button variant={registered ? "sage" : "hero"} size="xxl" className="w-full" onClick={() => setDialog("register")}>
          {registered ? (
            <>
              <CheckCircle2 /> 已示範報名
            </>
          ) : (
            "示範報名"
          )}
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="soft" size="xl" onClick={() => setDialog("invite")}>
            <UserPlus /> 邀請好友
          </Button>
          <Button variant="soft" size="xl" onClick={() => setDialog("buddy")}>
            <Footprints /> 發起結伴
          </Button>
        </div>
      </div>
      <RegisterDialog activity={activity} open={dialog === "register"} onClose={() => setDialog(null)} />
      <InviteDialog activity={activity} open={dialog === "invite"} onClose={() => setDialog(null)} />
      <BuddyDialog activity={activity} open={dialog === "buddy"} onClose={() => setDialog(null)} />
    </>
  );
}

function RegisterDialog({ activity, open, onClose }: { activity: Activity; open: boolean; onClose: () => void }) {
  const { state, dispatch } = useAppState();
  const registered = state.registrations.includes(activity.id);
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={dialogClass}>
        {registered ? (
          <div className="space-y-4 text-center">
            <CheckCircle2 className="mx-auto size-20 animate-pop-in text-primary" />
            <DialogHeader className="text-center sm:text-center">
              <DialogTitle className="text-2xl text-primary-deep">示範報名完成</DialogTitle>
              <DialogDescription className="text-lg text-foreground">
                呢個只係產品示範，<b>並未</b>提交任何資料至主辦機構。
              </DialogDescription>
            </DialogHeader>
            <p className="text-lg">
              如想真正參加，請瀏覽主辦機構官方資料或直接向主辦機構查詢。
            </p>
            <SourceLink activity={activity} />
            <Button variant="forest" size="xl" className="w-full" onClick={onClose}>
              知道了
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="pr-10 text-2xl text-primary-deep">確認示範報名</DialogTitle>
              <DialogDescription className="text-lg text-foreground">{activity.title}</DialogDescription>
            </DialogHeader>
            <div className="rounded-2xl bg-muted p-4 text-lg">
              <p>
                報名人：<b>陳伯伯</b>（示範用戶）
              </p>
              <p>
                日期：<b>{activity.date}</b>
              </p>
            </div>
            <Disclaimer />
            <Button
              variant="hero"
              size="xxl"
              className="w-full"
              onClick={() => {
                dispatch({ type: "register", activityId: activity.id, title: activity.title });
                toast.success("示範報名完成（未有實際提交）");
              }}
            >
              確認示範報名
            </Button>
            <Button variant="soft" size="xl" className="w-full" onClick={onClose}>
              取消
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function InviteDialog({ activity, open, onClose }: { activity: Activity; open: boolean; onClose: () => void }) {
  const { state, dispatch } = useAppState();
  const [picked, setPicked] = useState<string[]>([]);
  const invited = (id: string) => state.invites.some((i) => i.activityId === activity.id && i.friendId === id);
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setPicked([]);
          onClose();
        }
      }}
    >
      <DialogContent className={dialogClass}>
        <DialogHeader>
          <DialogTitle className="pr-10 text-2xl text-primary-deep">邀請好友一齊去</DialogTitle>
          <DialogDescription className="text-lg text-foreground">揀想邀請嘅好友（示範好友）</DialogDescription>
        </DialogHeader>
        <ul className="space-y-2">
          {FRIENDS.map((f) => {
            const done = invited(f.id);
            const on = picked.includes(f.id);
            return (
              <li key={f.id}>
                <button
                  type="button"
                  disabled={done}
                  aria-pressed={on}
                  onClick={() => setPicked((p) => (on ? p.filter((x) => x !== f.id) : [...p, f.id]))}
                  className={cn(
                    "tap flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left disabled:cursor-default",
                    done ? "border-sage bg-sage-soft" : on ? "border-accent bg-accent-soft" : "border-border bg-card",
                  )}
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-xl font-bold text-primary-deep">
                    {f.name[0]}
                  </span>
                  <span className="flex-1">
                    <span className="block text-lg font-bold">{f.name}</span>
                    <span className="block text-base text-muted-foreground">{f.note}</span>
                  </span>
                  <span className="text-base font-bold text-primary">{done ? "已邀請" : on ? "已揀選" : ""}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="text-base text-muted-foreground">示範功能：不會真正發送訊息畀任何人。</p>
        <Button
          variant="hero"
          size="xl"
          className="w-full"
          disabled={picked.length === 0}
          onClick={() => {
            const names = FRIENDS.filter((f) => picked.includes(f.id)).map((f) => f.name);
            dispatch({ type: "invite", activityId: activity.id, friendIds: picked, friendNames: names });
            toast.success(`已模擬邀請：${names.join("、")}（示範，未有實際發送）`);
            setPicked([]);
            onClose();
          }}
        >
          {picked.length ? `模擬邀請 ${picked.length} 位好友` : "請揀選好友"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function BuddyDialog({ activity, open, onClose }: { activity: Activity; open: boolean; onClose: () => void }) {
  const { dispatch } = useAppState();
  const [msg, setMsg] = useState(`我想去「${activity.title.replace(/[「」]/g, "")}」，有冇街坊想結伴一齊去？`);
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={dialogClass}>
        <DialogHeader>
          <DialogTitle className="pr-10 text-2xl text-primary-deep">發起結伴同行</DialogTitle>
          <DialogDescription className="text-lg text-foreground">寫低你想講嘅說話，搵街坊一齊出發</DialogDescription>
        </DialogHeader>
        <Textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={4} className="rounded-2xl text-lg" aria-label="結伴貼文內容" />
        <p className="text-base text-muted-foreground">示範功能：貼文只會喺你部機度顯示，不會公開發佈。</p>
        <Button
          variant="hero"
          size="xl"
          className="w-full"
          disabled={!msg.trim()}
          onClick={() => {
            dispatch({ type: "createBuddyPost", activityId: activity.id, message: msg.trim() });
            toast.success("已發起示範結伴貼文，可喺「活動」頁睇到");
            onClose();
          }}
        >
          發起（示範）
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export function BuddyPostCard({
  id,
  author,
  authorNote,
  message,
  activityId,
  postedAgo,
  baseJoined,
  mine,
}: {
  id: string;
  author: string;
  authorNote: string;
  message: string;
  activityId: string;
  postedAgo: string;
  baseJoined: number;
  mine?: boolean;
}) {
  const { state, dispatch } = useAppState();
  const joined = state.joinedPosts.includes(id);
  const activity = getActivity(activityId);
  return (
    <article className="app-card p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-full bg-accent-soft text-xl font-bold text-accent-foreground">
          {author[0]}
        </span>
        <div className="flex-1">
          <p className="text-lg font-bold">{author}</p>
          <p className="text-sm text-muted-foreground">
            {authorNote}・{postedAgo}
          </p>
        </div>
        <DemoBadge>示範貼文</DemoBadge>
      </div>
      <p className="mt-3 text-lg leading-relaxed">{message}</p>
      {activity && (
        <Link
          to="/activities/$theme"
          params={{ theme: activity.themeId }}
          className="tap mt-3 block rounded-2xl bg-muted p-3 text-base"
        >
          📌 {activity.title}
          <span className="block text-sm text-muted-foreground">{activity.date}</span>
        </Link>
      )}
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-base text-muted-foreground">
          已有 {baseJoined + (joined ? 1 : 0)} 人加入
        </span>
        {mine ? (
          <span className="text-base font-bold text-primary">你發起嘅結伴</span>
        ) : (
          <Button
            variant={joined ? "sage" : "forest"}
            size="xl"
            onClick={() => {
              dispatch({ type: "toggleJoin", postId: id, label: `${author}嘅結伴` });
              toast.success(joined ? "已退出結伴（示範）" : "已加入結伴（示範，未有通知對方）");
            }}
          >
            {joined ? "已加入 ✓" : "加入結伴"}
          </Button>
        )}
      </div>
    </article>
  );
}
