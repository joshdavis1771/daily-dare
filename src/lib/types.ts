export type Difficulty = "gentle" | "steady" | "bold";

export type Profile = {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  followers: number;
  following: number;
  streak?: number;
  isFollowing?: boolean;
  isPlus?: boolean;
};

export type Challenge = {
  id: string;
  title: string;
  instructions: string;
  category: string;
  difficulty: Difficulty;
  date: string;
  accent: string;
};

export type Post = {
  id: string;
  creator: Profile;
  challenge: Challenge;
  caption: string;
  posterUrl: string;
  likes: number;
  comments: number;
  reposts?: number;
  reposted?: boolean;
  liked: boolean;
  createdAt: string;
} & ({ mediaType?: "video"; videoUrl: string } | { mediaType: "photo"; photoUrl: string });

export type Comment = {
  id: string;
  author: Profile;
  body: string;
  createdAt: string;
  likes?: number;
};

export type SharedPostPreview = {
  creatorName: string;
  creatorUsername: string;
  caption: string;
  challengeTitle: string;
  profileUrl: string;
  avatarUrl: string;
  posterUrl: string;
};

export type DirectMessage = {
  body: string;
  fromMe: boolean;
  createdAt: string;
  sharedPost?: SharedPostPreview;
};

export type MessageThread = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  messages: DirectMessage[];
};
