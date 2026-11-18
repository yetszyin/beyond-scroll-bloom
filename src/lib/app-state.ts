// Pure, front-end-only state for the demo. Nothing here is sent anywhere.

export const TASK_REWARD = { points: 10, flowers: 1 };
export const CHALLENGE_REWARD = { points: 20, flowers: 1 };

export interface LogEntry {
  id: string;
  text: string;
  when: string;
  kind: "task" | "challenge" | "activity" | "social";
}

export interface BuddyPost {
  id: string;
  author: string;
  activityId: string;
  message: string;
}

export interface AppState {
  points: number;
  flowers: number;
  completedTasks: string[];
  completedChallenges: string[];
  registrations: string[];
  invites: { activityId: string; friendId: string }[];
  joinedPosts: string[];
  myPosts: BuddyPost[];
  log: LogEntry[];
}

export const INITIAL_STATE: AppState = {
  points: 320,
  flowers: 12,
  completedTasks: [],
  completedChallenges: [],
  registrations: [],
  invites: [],
  joinedPosts: [],
  myPosts: [],
  log: [
    { id: "seed-1", text: "完成散步任務 20 分鐘", when: "昨日", kind: "challenge" },
    { id: "seed-2", text: "完成每日小任務：飲一杯暖水", when: "昨日", kind: "task" },
    { id: "seed-3", text: "完成護眼操", when: "前日", kind: "challenge" },
  ],
};

let counter = 0;
function newId(prefix: string) {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

function addLog(state: AppState, text: string, kind: LogEntry["kind"]): LogEntry[] {
  return [{ id: newId("log"), text, when: "今日", kind }, ...state.log].slice(0, 40);
}

export type Action =
  | { type: "completeTask"; id: string; title: string }
  | { type: "completeChallenge"; id: string; title: string }
  | { type: "register"; activityId: string; title: string }
  | { type: "invite"; activityId: string; friendIds: string[]; friendNames: string[] }
  | { type: "toggleJoin"; postId: string; label: string }
  | { type: "createPost"; activityId: string; message: string }
  | { type: "hydrate"; state: AppState }
  | { type: "reset" };

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "completeTask": {
      if (state.completedTasks.includes(action.id)) return state;
      return {
        ...state,
        points: state.points + TASK_REWARD.points,
        flowers: state.flowers + TASK_REWARD.flowers,
        completedTasks: [...state.completedTasks, action.id],
        log: addLog(state, `完成每日小任務：${action.title}`, "task"),
      };
    }
    case "completeChallenge": {
      if (state.completedChallenges.includes(action.id)) return state;
      return {
        ...state,
        points: state.points + CHALLENGE_REWARD.points,
        flowers: state.flowers + CHALLENGE_REWARD.flowers,
        completedChallenges: [...state.completedChallenges, action.id],
        log: addLog(state, `完成${action.title}`, "challenge"),
      };
    }
    case "register": {
      if (state.registrations.includes(action.activityId)) return state;
      return {
        ...state,
        registrations: [...state.registrations, action.activityId],
        log: addLog(state, `示範報名：${action.title}`, "activity"),
      };
    }
    case "invite": {
      const fresh = action.friendIds.filter(
        (f) => !state.invites.some((i) => i.activityId === action.activityId && i.friendId === f),
      );
      if (fresh.length === 0) return state;
      return {
        ...state,
        invites: [...state.invites, ...fresh.map((friendId) => ({ activityId: action.activityId, friendId }))],
        log: addLog(state, `示範邀請好友：${action.friendNames.join("、")}`, "social"),
      };
    }
    case "toggleJoin": {
      const joined = state.joinedPosts.includes(action.postId);
      return {
        ...state,
        joinedPosts: joined
          ? state.joinedPosts.filter((p) => p !== action.postId)
          : [...state.joinedPosts, action.postId],
        log: addLog(state, `${joined ? "退出" : "加入"}結伴同行（示範）：${action.label}`, "social"),
      };
    }
    case "createPost": {
      const post: BuddyPost = {
        id: newId("post"),
        author: "陳伯伯",
        activityId: action.activityId,
        message: action.message,
      };
      return {
        ...state,
        myPosts: [post, ...state.myPosts],
        log: addLog(state, "發起結伴同行（示範）", "social"),
      };
    }
    case "hydrate":
      return action.state;
    case "reset":
      return INITIAL_STATE;
  }
}
