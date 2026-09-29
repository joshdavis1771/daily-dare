"use client";

import { FormEvent, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Check,
  Crown,
  Edit3,
  Flame,
  Grid3X3,
  Heart,
  Link as LinkIcon,
  MessageCircle,
  UserPlus,
  X,
} from "lucide-react";
import type { Post, Profile } from "@/lib/types";
import { formatCount, PHOTO_ACCEPT, validateMediaFile } from "@/lib/utils";
import { currentStreak, localDate } from "@/lib/daily";
import { useCurrentTime, useDemoHistory } from "@/lib/plus-tools";
import { usePlus } from "@/lib/plus-store";
import { demoProfiles } from "@/lib/demo-data";

const profileStorageKey = "daily-dare-profile";
const profileUpdatedEvent = "daily-dare-profile-updated";

let savedProfileRaw: string | null | undefined;
let savedProfileSnapshot: Partial<Profile> | null = null;

function readSavedProfile(): Partial<Profile> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(profileStorageKey);
    if (raw === savedProfileRaw) return savedProfileSnapshot;
    savedProfileRaw = raw;
    const saved = raw ? (JSON.parse(raw) as unknown) : null;
    savedProfileSnapshot =
      saved && typeof saved === "object" && !Array.isArray(saved)
        ? (saved as Partial<Profile>)
        : null;
  } catch {
    savedProfileSnapshot = null;
  }
  return savedProfileSnapshot;
}

function subscribeSavedProfile(listener: () => void) {
  window.addEventListener(profileUpdatedEvent, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(profileUpdatedEvent, listener);
    window.removeEventListener("storage", listener);
  };
}

function subscribeNothing() {
  return () => {};
}

function readNoSavedProfile() {
  return null;
}

function writeSavedProfile(profile: Profile) {
  const serialized = JSON.stringify(profile);
  window.localStorage.setItem(profileStorageKey, serialized);
  savedProfileRaw = serialized;
  savedProfileSnapshot = profile;
  window.dispatchEvent(new Event(profileUpdatedEvent));
}

async function createAvatarDataUrl(file: File) {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new window.Image();
      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = () =>
        reject(new Error("This photo could not be read. Choose another one."));
      nextImage.src = objectUrl;
    });
    const scale = Math.min(
      1,
      512 / Math.max(image.naturalWidth, image.naturalHeight),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context)
      throw new Error("This photo could not be prepared. Choose another one.");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.85);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function ProfileView({
  profile,
  posts,
  editable = false,
  initialPostId,
}: {
  profile: Profile;
  posts: Post[];
  editable?: boolean;
  initialPostId?: string;
}) {
  const savedProfile = useSyncExternalStore(
    editable ? subscribeSavedProfile : subscribeNothing,
    editable ? readSavedProfile : readNoSavedProfile,
    readNoSavedProfile,
  );
  const currentProfile = { ...profile, ...savedProfile };
  const [following, setFollowing] = useState(Boolean(profile.isFollowing));
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [profileError, setProfileError] = useState("");
  const router = useRouter();
  const [selectedPost, setSelectedPost] = useState<Post | null>(() =>
    posts.find((post) => post.id === initialPostId) ?? null,
  );
  const plusState = usePlus();
  const dailyHistory = useDemoHistory();
  const currentTime = useCurrentTime();
  const streak = currentTime
    ? currentStreak(
        dailyHistory
          .filter((day) => day.completedAt || day.skippedAt)
          .map((day) => day.date),
        localDate(new Date(currentTime)),
      )
    : 0;
  const visibleStreak = editable ? streak : (profile.streak ?? 0);

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const username = draft.username.replace(/^@/, "").trim().toLowerCase();
    const unchangedLegacyUsername =
      username === currentProfile.username.toLowerCase();
    if (!unchangedLegacyUsername && !/^[a-z0-9._]+$/.test(username)) {
      setProfileError(
        "Username can only use letters, numbers, periods, and underscores.",
      );
      return;
    }
    if (
      demoProfiles.some(
        (candidate) =>
          candidate.id !== currentProfile.id &&
          candidate.username.toLowerCase() === username,
      )
    ) {
      setProfileError("That username is already taken. Choose another one.");
      return;
    }
    setProfileError("");
    const nextProfile = {
      ...currentProfile,
      ...draft,
      username: username || currentProfile.username,
    };
    setDraft(nextProfile);
    writeSavedProfile(nextProfile);
    setEditing(false);
  }

  function startEditing() {
    setDraft(currentProfile);
    setEditing(true);
  }

  function closePostSpotlight() {
    setSelectedPost(null);
    if (initialPostId) router.replace("/profile", { scroll: false });
  }

  async function changeAvatar(file: File) {
    const validationError = validateMediaFile(file);
    if (validationError || !file.type.startsWith("image/")) {
      setProfileError(validationError ?? "Choose a JPG, PNG, or WebP photo.");
      return;
    }
    try {
      setProfileError("");
      const avatarUrl = await createAvatarDataUrl(file);
      setDraft((current) => ({ ...current, avatarUrl }));
    } catch (error) {
      setProfileError(
        error instanceof Error
          ? error.message
          : "This photo could not be used. Choose another one.",
      );
    }
  }

  function cancelEditing() {
    setDraft(currentProfile);
    setProfileError("");
    setEditing(false);
  }

  const mutualFollow = Boolean(profile.isFollowing && following);
  const isPlusMember = editable ? plusState.enabled : Boolean(profile.isPlus);

  return (
    <div className="mx-auto max-w-4xl px-4 pb-32 pt-6 sm:px-8 sm:pt-10">
      {editing && profileError && (
        <p
          role="alert"
          className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
        >
          {profileError}
        </p>
      )}
      {editing ? (
        <form
          onSubmit={saveProfile}
          className="rounded-[1.5rem] border border-[#171717]/10 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">
                your corner
              </p>
              <h1 className="font-display mt-2 text-3xl font-black tracking-[-0.07em]">
                Edit profile
              </h1>
            </div>
            <button
              type="button"
              onClick={cancelEditing}
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
              aria-label="Cancel editing"
            >
              <X size={19} />
            </button>
          </div>
          <div className="mt-8 grid gap-5">
            <div className="grid gap-3 text-sm font-bold">
              <span>Profile picture</span>
              <div className="flex items-center gap-4">
                <Image
                  src={draft.avatarUrl}
                  alt="Profile picture preview"
                  width={80}
                  height={80}
                  unoptimized
                  className="h-20 w-20 rounded-full object-cover"
                />
                <label className="cursor-pointer rounded-full border border-[#171717]/15 px-4 py-2 text-sm font-bold dark:border-neutral-600">
                  Choose photo
                  <input
                    type="file"
                    accept={PHOTO_ACCEPT}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void changeAvatar(file);
                    }}
                    className="sr-only"
                  />
                </label>
              </div>
              <span className="text-xs font-normal text-[#171717]/55 dark:text-neutral-400">
                JPG, PNG, or WebP. Your photo is saved on this device in the
                demo.
              </span>
            </div>
            <label className="grid gap-2 text-sm font-bold">
              Display name
              <input
                value={draft.displayName}
                onChange={(event) =>
                  setDraft({ ...draft, displayName: event.target.value })
                }
                required
                className="rounded-xl border border-[#171717]/10 bg-transparent px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-600"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Username
              <input
                value={draft.username}
                onChange={(event) =>
                  setDraft({ ...draft, username: event.target.value })
                }
                pattern="[A-Za-z0-9._]+"
                title="Use letters, numbers, periods, and underscores only."
                required
                className="rounded-xl border border-[#171717]/10 bg-transparent px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-600"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Bio
              <textarea
                value={draft.bio}
                onChange={(event) =>
                  setDraft({ ...draft, bio: event.target.value })
                }
                rows={3}
                maxLength={160}
                className="resize-none rounded-xl border border-[#171717]/10 bg-transparent px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-600"
              />
            </label>
          </div>
          <div className="mt-7 flex justify-end gap-3">
            <button
              type="button"
              onClick={cancelEditing}
              className="rounded-full border border-[#171717]/15 px-5 py-3 text-sm font-bold dark:border-neutral-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-full bg-teal-700 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800"
            >
              <Check size={16} /> Save changes
            </button>
          </div>
        </form>
      ) : (
        <>
          <section aria-label="Profile information">
            <div className="flex items-start gap-5 sm:gap-12">
              <Image
                src={currentProfile.avatarUrl}
                alt={`${currentProfile.displayName} profile`}
                width={144}
                height={144}
                unoptimized
                className="h-20 w-20 shrink-0 rounded-full object-cover ring-1 ring-neutral-200 sm:h-36 sm:w-36 dark:ring-neutral-700"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl font-normal sm:text-2xl">
                    {currentProfile.username}
                  </h1>
                  {isPlusMember && (
                    <span
                      className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-amber-800 dark:bg-amber-950 dark:text-amber-200"
                      title="Daily Dare Plus member"
                    >
                      <Crown size={12} /> Plus
                    </span>
                  )}
                  {editable ? (
                    <button
                      type="button"
                      onClick={startEditing}
                      className="group hidden items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-neutral-100/80 px-4 py-1.5 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-px hover:border-teal-700/25 hover:bg-white hover:text-teal-800 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 sm:flex dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-teal-400/30 dark:hover:bg-neutral-700 dark:hover:text-teal-200"
                    >
                      <Edit3
                        size={15}
                        className="text-neutral-500 transition-colors group-hover:text-teal-700 dark:text-neutral-400 dark:group-hover:text-teal-300"
                      />{" "}
                      Edit profile
                    </button>
                  ) : mutualFollow ? (
                    <Link
                      href={`/messages?user=${profile.username}`}
                      className="hidden items-center justify-center gap-2 rounded-lg bg-neutral-100 px-4 py-1.5 text-sm font-semibold hover:bg-neutral-200 sm:flex dark:bg-neutral-800 dark:hover:bg-neutral-700"
                    >
                      <MessageCircle size={16} /> Message
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setFollowing(!following)}
                      className={`hidden items-center justify-center gap-2 rounded-lg px-4 py-1.5 text-sm font-semibold sm:flex ${following ? "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700" : "bg-teal-700 text-white hover:bg-teal-800"}`}
                    >
                      {following ? (
                        "Following"
                      ) : (
                        <>
                          <UserPlus size={16} /> Follow
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="mt-4 hidden gap-8 text-sm sm:flex">
                  <span>
                    <strong>{formatCount(posts.length)}</strong> posts
                  </span>
                  <span>
                    <strong>
                      {formatCount(
                        currentProfile.followers + (following ? 1 : 0),
                      )}
                    </strong>{" "}
                    followers
                  </span>
                  <span>
                    <strong>{formatCount(currentProfile.following)}</strong>{" "}
                    following
                  </span>
                </div>
                <div className="mt-3 sm:mt-5">
                  <h2 className="font-semibold">
                    {currentProfile.displayName}
                  </h2>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-[#171717]/70 dark:text-neutral-300">
                    {currentProfile.bio}
                  </p>
                  {(editable || profile.streak !== undefined) && (
                    <span
                      role="img"
                      aria-label={`${visibleStreak} day streak`}
                      title={`${visibleStreak} day streak`}
                      className="mt-3 inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1.5 text-xs font-semibold tabular-nums text-red-600 dark:bg-red-950/50 dark:text-red-300"
                    >
                      <Flame size={14} fill="currentColor" aria-hidden="true" />
                      {visibleStreak}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-5 sm:hidden">
              <div className="grid grid-cols-3 border-y border-neutral-200 py-3 text-center text-xs dark:border-neutral-700">
                <span>
                  <strong className="block text-sm">
                    {formatCount(posts.length)}
                  </strong>{" "}
                  posts
                </span>
                <span>
                  <strong className="block text-sm">
                    {formatCount(
                      currentProfile.followers + (following ? 1 : 0),
                    )}
                  </strong>{" "}
                  followers
                </span>
                <span>
                  <strong className="block text-sm">
                    {formatCount(currentProfile.following)}
                  </strong>{" "}
                  following
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                {editable ? (
                  <button
                    type="button"
                    onClick={startEditing}
                    className="group flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-neutral-100/80 px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 hover:border-teal-700/25 hover:bg-white hover:text-teal-800 hover:shadow-md active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-teal-400/30 dark:hover:bg-neutral-700 dark:hover:text-teal-200"
                  >
                    <Edit3
                      size={15}
                      className="text-neutral-500 transition-colors group-hover:text-teal-700 dark:text-neutral-400 dark:group-hover:text-teal-300"
                    />
                    Edit profile
                  </button>
                ) : mutualFollow ? (
                  <Link
                    href={`/messages?user=${profile.username}`}
                    className="flex-1 rounded-lg bg-neutral-100 px-4 py-2 text-center text-sm font-semibold dark:bg-neutral-800"
                  >
                    Message
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setFollowing(!following)}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold ${following ? "bg-neutral-100 dark:bg-neutral-800" : "bg-teal-700 text-white"}`}
                  >
                    {following ? "Following" : "Follow"}
                  </button>
                )}
              </div>
            </div>
          </section>
          <div className="mt-8 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex h-12 items-center justify-center gap-2 border-t border-neutral-900 text-xs font-semibold uppercase tracking-[0.12em] dark:border-neutral-100">
              <Grid3X3 size={15} /> Posts
            </div>
            <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
              {posts.map((post) => (
                <button
                  key={post.id}
                  id={post.id}
                  type="button"
                  onClick={() => setSelectedPost(post)}
                  aria-label={`${post.challenge.title}, ${formatCount(post.likes)} likes, ${formatCount(post.comments)} comments`}
                  className="group relative aspect-square overflow-hidden bg-neutral-100 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500 dark:bg-neutral-800"
                >
                  <Image
                    src={
                      post.mediaType === "photo"
                        ? post.photoUrl
                        : post.posterUrl
                    }
                    alt={post.challenge.title}
                    width={512}
                    height={512}
                    unoptimized
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/65 via-transparent to-transparent p-2 text-[10px] font-semibold text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                    {post.challenge.title}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#171717]/45 dark:text-neutral-400">
            <LinkIcon size={14} /> daily-dare.app/@{currentProfile.username}
          </div>
        </>
      )}
      {selectedPost && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Dare spotlight"
          className="fixed inset-0 z-50 grid place-items-end bg-black/30 p-4 sm:place-items-center"
        >
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-neutral-900">
            <div className="bg-teal-800 px-5 pb-5 pt-4 text-white dark:bg-teal-950 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-100">
                  Today&apos;s dare{" "}
                  <span className="mx-1 text-teal-300">/</span>{" "}
                  {selectedPost.challenge.category}
                </p>
                <button
                  type="button"
                  onClick={closePostSpotlight}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  aria-label="Close dare spotlight"
                >
                  <X size={18} />
                </button>
              </div>
              <h2 className="mt-2 text-2xl font-bold leading-tight">
                {selectedPost.challenge.title}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-teal-50/85">
                {selectedPost.challenge.instructions}
              </p>
            </div>
            <div className="aspect-[4/5] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              <Image
                src={
                  selectedPost.mediaType === "photo"
                    ? selectedPost.photoUrl
                    : selectedPost.posterUrl
                }
                alt={selectedPost.challenge.title}
                width={768}
                height={960}
                unoptimized
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <Image
                  src={currentProfile.avatarUrl}
                  alt=""
                  width={40}
                  height={40}
                  unoptimized
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-neutral-800 dark:text-neutral-100">
                    A moment from {currentProfile.displayName}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {selectedPost.caption}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-5 border-t border-neutral-200 pt-4 text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Heart
                    size={15}
                    fill={selectedPost.liked ? "currentColor" : "none"}
                    className={
                      selectedPost.liked ? "text-red-600 dark:text-red-400" : ""
                    }
                  />
                  {formatCount(selectedPost.likes)} cheers
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle size={15} />{" "}
                  {formatCount(selectedPost.comments)} notes
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
