"use client";

import { useState, useSyncExternalStore } from "react";
import type { Post } from "@/lib/types";
import { PostCard } from "./post-card";
import { addLikeNotification } from "@/lib/notifications";

import { isBlocked, useModeration } from "@/lib/moderation";

type FeedMode = "following" | "recommended";
const feedModeKey = "daily-dare-feed-mode";
const feedModeEvent = "daily-dare-feed-mode-updated";

function getFeedMode(): FeedMode {
  if (typeof window === "undefined") return "recommended";
  try {
    const savedMode = window.sessionStorage.getItem(feedModeKey);
    return savedMode === "following" ? "following" : "recommended";
  } catch {
    return "recommended";
  }
}

function subscribeFeedMode(listener: () => void) {
  window.addEventListener(feedModeEvent, listener);
  return () => window.removeEventListener(feedModeEvent, listener);
}

function saveFeedMode(mode: FeedMode) {
  try { window.sessionStorage.setItem(feedModeKey, mode); } catch { /* Keep the current selection for this render. */ }
  window.dispatchEvent(new Event(feedModeEvent));
}

export function Feed({ initialPosts }: { initialPosts: Post[] }) {
  const { blocks } = useModeration();
  const [posts, setPosts] = useState(initialPosts);
  const mode = useSyncExternalStore(subscribeFeedMode, getFeedMode, () => "recommended");
  function changeMode(nextMode: "following" | "recommended") {
    saveFeedMode(nextMode);
  }
  function toggleLike(id: string) {
    const post = posts.find((item) => item.id === id);
    if (post && post.creator.id === "p1" && !post.liked) addLikeNotification(post.caption, post.id);
    setPosts((current) => current.map((post) => post.id === id ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) } : post));
  }
  function toggleRepost(id: string) {
    setPosts((current) => current.map((post) => post.id === id ? { ...post, reposted: !post.reposted, reposts: (post.reposts ?? 0) + (post.reposted ? -1 : 1) } : post));
  }
  function toggleFollow(profileId: string) {
    setPosts((current) => current.map((post) => post.creator.id === profileId ? { ...post, creator: { ...post.creator, isFollowing: !post.creator.isFollowing } } : post));
  }
  const allowedPosts = posts.filter(post => !isBlocked(blocks, post.creator.id));
  const visiblePosts = mode === "following"
    ? allowedPosts.filter((post) => post.creator.isFollowing)
    : [...allowedPosts].sort((first, second) => second.likes - first.likes);
  return <section className="mt-6" aria-labelledby="feed-heading"><div className="mb-5 flex items-center justify-between gap-4"><h2 id="feed-heading" className="text-sm font-semibold">Today’s moments</h2><div className="flex rounded-full border border-[#171717]/10 p-1 dark:border-neutral-700" aria-label="Choose feed"><button type="button" onClick={() => changeMode("following")} aria-pressed={mode === "following"} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${mode === "following" ? "bg-[#171717] text-white dark:bg-white dark:text-neutral-950" : "text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"}`}>Following</button><button type="button" onClick={() => changeMode("recommended")} aria-pressed={mode === "recommended"} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${mode === "recommended" ? "bg-[#171717] text-white dark:bg-white dark:text-neutral-950" : "text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"}`}>Recommended</button></div></div><div className="space-y-8">{visiblePosts.map((post) => <PostCard key={post.id} post={post} onLike={toggleLike} onRepost={toggleRepost} onFollow={toggleFollow} />)}</div><p className="py-10 text-center text-xs text-neutral-400 dark:text-neutral-400">{mode === "following" && visiblePosts.length === 0 ? "Follow a few people to build your feed." : "You’re all caught up. Go make a moment."}</p></section>;
}
