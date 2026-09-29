import { demoComments, demoPosts, todayChallenge } from "./demo-data";
import type { Comment, Post } from "./types";

export type FeedRepository = {
  getFeed: () => Promise<Post[]>;
  getTodayChallenge: () => Promise<typeof todayChallenge>;
  getComments: (postId: string) => Promise<Comment[]>;
};

export const demoRepository: FeedRepository = {
  getFeed: async () => demoPosts,
  getTodayChallenge: async () => todayChallenge,
  getComments: async (postId) => demoComments[postId] ?? [],
};
