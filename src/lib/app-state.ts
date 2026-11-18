// Pure, front-end-only state for the demo. Nothing here is sent anywhere.
import type { Workout, WorkoutType } from "@/lib/workouts";
import type { BrainResult } from "@/lib/brain";

export interface BuddyPost {
  id: string;
  author: string;
  activityId: string;
  message: string;
}

/** A post in the in-app friend circle. Never sent to any external platform. */
export interface FeedPost {
  id: string;
  workoutId: string;
  type: WorkoutType;
  date: string;
  durationSec: number;
  distanceKm?: number;
  courseTitle?: string;
  text: string;
}

export interface AppState {
  workouts: Workout[];
  feedPosts: FeedPost[];
  likedPosts: string[];
  registrations: string[];
  invites: { activityId: string; friendId: string }[];
  joinedPosts: string[];
  buddyPosts: BuddyPost[];
  /** completed brain-game rounds, newest first (local demo record) */
  brainResults: BrainResult[];
}

export const INITIAL_STATE: AppState = {
  workouts: [],
  feedPosts: [],
  likedPosts: [],
  registrations: [],
  invites: [],
  joinedPosts: [],
  buddyPosts: [],
  brainResults: [],
};

let counter = 0;
export function newId(prefix: string) {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

export type Action =
  | { type: "addWorkout"; workout: Workout }
  | { type: "shareWorkout"; workoutId: string; text: string; postId?: string }
  | { type: "toggleLike"; postId: string }
  | { type: "register"; activityId: string; title: string }
  | { type: "invite"; activityId: string; friendIds: string[]; friendNames: string[] }
  | { type: "toggleJoin"; postId: string; label: string }
  | { type: "createBuddyPost"; activityId: string; message: string }
  | { type: "addBrainResult"; result: BrainResult }
  | { type: "hydrate"; state: AppState }
  | { type: "reset"; state: AppState };

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "addWorkout": {
      if (state.workouts.some((w) => w.id === action.workout.id)) return state;
      return { ...state, workouts: [action.workout, ...state.workouts] };
    }
    case "shareWorkout": {
      const w = state.workouts.find((x) => x.id === action.workoutId);
      if (!w || state.feedPosts.some((p) => p.workoutId === w.id)) return state;
      const post: FeedPost = {
        id: action.postId ?? newId("feed"),
        workoutId: w.id,
        type: w.type,
        date: w.date,
        durationSec: w.durationSec,
        ...(w.type === "walk" || w.type === "run") && w.distanceKm !== undefined ? { distanceKm: w.distanceKm } : {},
        ...(w.courseTitle ? { courseTitle: w.courseTitle } : {}),
        text: action.text.trim(),
      };
      return { ...state, feedPosts: [post, ...state.feedPosts] };
    }
    case "toggleLike": {
      const liked = state.likedPosts.includes(action.postId);
      return {
        ...state,
        likedPosts: liked ? state.likedPosts.filter((p) => p !== action.postId) : [...state.likedPosts, action.postId],
      };
    }
    case "register": {
      if (state.registrations.includes(action.activityId)) return state;
      return { ...state, registrations: [...state.registrations, action.activityId] };
    }
    case "invite": {
      const fresh = action.friendIds.filter(
        (f) => !state.invites.some((i) => i.activityId === action.activityId && i.friendId === f),
      );
      if (fresh.length === 0) return state;
      return {
        ...state,
        invites: [...state.invites, ...fresh.map((friendId) => ({ activityId: action.activityId, friendId }))],
      };
    }
    case "toggleJoin": {
      const joined = state.joinedPosts.includes(action.postId);
      return {
        ...state,
        joinedPosts: joined ? state.joinedPosts.filter((p) => p !== action.postId) : [...state.joinedPosts, action.postId],
      };
    }
    case "createBuddyPost": {
      const post: BuddyPost = { id: newId("post"), author: "陳伯伯", activityId: action.activityId, message: action.message };
      return { ...state, buddyPosts: [post, ...state.buddyPosts] };
    }
    case "addBrainResult": {
      return { ...state, brainResults: [action.result, ...state.brainResults] };
    }
    case "hydrate":
    case "reset":
      return action.state;
  }
}
