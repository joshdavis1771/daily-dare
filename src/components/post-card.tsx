"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, Heart, MessageCircle, Repeat2, Share2, UserPlus, Volume2, VolumeX, X } from "lucide-react";
import type { Post } from "@/lib/types";
import { formatCount, parseCaption } from "@/lib/utils";
import { demoComments, demoProfiles } from "@/lib/demo-data";

export function PostCard({ post, onLike, onRepost, onFollow }: { post: Post; onLike: (id: string) => void; onRepost: (id: string) => void; onFollow: (profileId: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [muted, setMuted] = useState(true);
  const [shareMessage, setShareMessage] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [likedCommentIds, setLikedCommentIds] = useState<string[]>([]);
  const comments = demoComments[post.id] ?? [];
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio > 0.65), { threshold: [0.65] });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (visible) void videoRef.current?.play().catch(() => undefined);
    else videoRef.current?.pause();
  }, [visible]);
  const profileHref = post.creator.id === demoProfiles[0].id ? "/profile" : `/profile/${post.creator.username}`;
  async function sharePost() {
    const shareUrl = `${window.location.origin}${profileHref}`;
    const shareData = { title: `${post.creator.displayName} on Daily Dare`, text: post.caption, url: shareUrl };
    try {
      if (navigator.share) await navigator.share(shareData);
      else await navigator.clipboard.writeText(shareUrl);
      setShareMessage("Share link copied.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareMessage("Could not share this post.");
    }
  }
  function shareWith(profileId: string) {
    const recipient = demoProfiles.find((profile) => profile.id === profileId);
    if (!recipient) return;
    const message = {
      username: recipient.username,
      body: `Shared a dare from ${post.creator.displayName}.`,
      fromMe: true,
      createdAt: "now",
      sharedPost: {
        creatorName: post.creator.displayName,
        creatorUsername: post.creator.username,
        caption: post.caption,
        challengeTitle: post.challenge.title,
        profileUrl: profileHref,
        avatarUrl: post.creator.avatarUrl,
        posterUrl: post.posterUrl,
      },
    };
    const key = "daily-dare-shared-messages-v1";
    const saved = JSON.parse(window.localStorage.getItem(key) ?? "[]") as typeof message[];
    window.localStorage.setItem(key, JSON.stringify([...saved, message]));
    window.dispatchEvent(new Event("daily-dare-messages-updated"));
    setShareOpen(false);
    setShareMessage(`Sent to @${recipient.username} in Messages.`);
  }
  function toggleCommentLike(commentId: string) {
    setLikedCommentIds((current) => current.includes(commentId) ? current.filter((id) => id !== commentId) : [...current, commentId]);
  }
  return <article>
    <div className="mb-3 flex items-center gap-2.5"><Link href={profileHref} className="flex min-w-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-teal-500"><Image src={post.creator.avatarUrl} alt={`${post.creator.displayName} profile`} width={36} height={36} unoptimized className="h-9 w-9 rounded-full object-cover" /><span className="min-w-0"><span className="block truncate text-sm font-semibold">{post.creator.displayName}</span><span className="block truncate text-[11px] text-neutral-500 dark:text-neutral-300">@{post.creator.username}</span></span></Link><button type="button" onClick={() => onFollow(post.creator.id)} aria-pressed={post.creator.isFollowing} className={`flex min-h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors ${post.creator.isFollowing ? "border border-[#171717]/15 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800" : "bg-teal-700 text-white hover:bg-teal-800"}`}><UserPlus size={14} /> {post.creator.isFollowing ? "Following" : "Follow"}</button><span className="ml-auto shrink-0 text-xs text-neutral-400 dark:text-neutral-400">{post.createdAt}</span></div>
    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
      {post.mediaType === "photo" ? <Image src={post.photoUrl} alt={`${post.creator.displayName} completing ${post.challenge.title}`} fill unoptimized sizes="(max-width: 640px) 100vw, 576px" className="object-cover" /> : <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" src={post.videoUrl} poster={post.posterUrl} loop muted={muted} playsInline preload="metadata" aria-label={`${post.creator.displayName} completing ${post.challenge.title}`} />}
      {post.mediaType !== "photo" && <button onClick={() => setMuted((value) => !value)} className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-black/40 text-white backdrop-blur" aria-label={muted ? "Unmute video" : "Mute video"}>{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>}
    </div>
    <div className="mt-2 flex items-center gap-4"><button onClick={() => onLike(post.id)} className={`flex min-h-11 items-center gap-1.5 text-xs transition-colors ${post.liked ? "text-red-600 dark:text-red-400" : "text-neutral-600 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400"}`} aria-pressed={post.liked} aria-label={post.liked ? "Unlike post" : "Like post"}><Heart size={20} fill={post.liked ? "currentColor" : "none"} /> {formatCount(post.likes)}</button><button onClick={() => setCommentsOpen(true)} className="flex min-h-11 items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-teal-700 dark:text-neutral-300 dark:hover:text-teal-300" aria-label={`${post.comments} comments`}><MessageCircle size={19} /> {formatCount(post.comments)}</button><button onClick={() => onRepost(post.id)} className={`flex min-h-11 items-center gap-1.5 text-xs transition-colors ${post.reposted ? "text-teal-700 dark:text-teal-300" : "text-neutral-600 dark:text-neutral-300 hover:text-teal-700 dark:hover:text-teal-300"}`} aria-pressed={post.reposted} aria-label={post.reposted ? "Undo repost" : "Repost"} title={post.reposted ? "Undo repost" : "Repost"}><Repeat2 size={19} /> {formatCount(post.reposts ?? 0)}</button><button onClick={() => setShareOpen(true)} className="grid min-h-11 min-w-11 place-items-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-teal-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-teal-300" aria-label="Share post" title="Share post"><Share2 size={19} /></button></div>
    {shareOpen && <div role="dialog" aria-modal="true" aria-label="Share post" className="fixed inset-0 z-50 grid place-items-end bg-black/30 p-4 sm:place-items-center"><div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl dark:bg-neutral-900"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">Share this dare</p><h3 className="mt-1 text-lg font-bold">To contacts and other users</h3></div><button type="button" onClick={() => setShareOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800" aria-label="Close share dialog"><X size={18} /></button></div><div className="mt-5 space-y-2">{demoProfiles.filter((profile) => profile.id !== post.creator.id).map((profile) => <button key={profile.id} type="button" onClick={() => shareWith(profile.id)} className="flex w-full items-center gap-3 rounded-2xl p-3 text-left hover:bg-teal-50 dark:hover:bg-teal-950"><Image src={profile.avatarUrl} alt="" width={40} height={40} unoptimized className="h-10 w-10 rounded-full object-cover" /><span className="flex-1"><strong className="block text-sm">{profile.displayName}</strong><span className="text-xs text-neutral-500 dark:text-neutral-400">@{profile.username}</span></span><Check size={17} className="text-neutral-300" /></button>)}</div><button type="button" onClick={() => void sharePost()} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 text-sm font-semibold hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"><Share2 size={17} /> Use device share</button></div></div>}
    {commentsOpen && <div role="dialog" aria-modal="true" aria-label="Comments" className="fixed inset-0 z-50 grid place-items-end bg-black/30 p-4 sm:place-items-center"><div className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl dark:bg-neutral-900"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">Join the moment</p><h3 className="mt-1 text-lg font-bold">Comments</h3></div><button type="button" onClick={() => setCommentsOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800" aria-label="Close comments"><X size={18} /></button></div><div className="mt-5 space-y-5">{comments.length ? comments.map((comment) => { const liked = likedCommentIds.includes(comment.id); const likes = (comment.likes ?? 0) + (liked ? 1 : 0); return <article key={comment.id} className="flex gap-3"><Image src={comment.author.avatarUrl} alt={`${comment.author.displayName} profile`} width={36} height={36} unoptimized className="h-9 w-9 rounded-full object-cover" /><div className="min-w-0 flex-1"><div className="flex items-baseline justify-between gap-3"><strong className="text-sm">{comment.author.displayName}</strong><time className="text-xs text-neutral-400">{comment.createdAt}</time></div><p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{comment.body}</p><button type="button" onClick={() => toggleCommentLike(comment.id)} className={`mt-2 flex items-center gap-1.5 text-xs ${liked ? "text-red-600 dark:text-red-400" : "text-neutral-500 hover:text-red-600 dark:text-neutral-400"}`} aria-pressed={liked} aria-label={liked ? `Unlike comment by ${comment.author.displayName}` : `Like comment by ${comment.author.displayName}`}><Heart size={15} fill={liked ? "currentColor" : "none"} /> {formatCount(likes)}</button></div></article>; }) : <p className="py-8 text-center text-sm text-neutral-500">No comments yet.</p>}</div></div></div>}
    {shareMessage && <p role="status" className="mt-1 text-xs text-teal-700 dark:text-teal-300">{shareMessage}</p>}
    <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{parseCaption(post.caption).map((part) => <span key={part.key} className={part.kind !== "text" ? "font-medium text-teal-700 dark:text-teal-300" : ""}>{part.text}</span>)}</p>
  </article>;
}
