"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  ChevronLeft,
  ImagePlus,
  RefreshCcw,
  Video,
} from "lucide-react";
import Link from "next/link";
import {
  MAX_CAPTION_LENGTH,
  PHOTO_ACCEPT,
  VIDEO_ACCEPT,
  validateMediaFile,
  validateUserText,
} from "@/lib/utils";
import { dailyPhase, type DailyState } from "@/lib/daily";
import { getDailyState, submitDailyProof } from "@/lib/daily-client";
import { isSupabaseConfigured } from "@/lib/supabase";
import { captureNativePhoto, isNativeApp } from "@/lib/native";

export function CreateDare() {
  const [day, setDay] = useState<DailyState | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
  const [publishing, setPublishing] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [caption, setCaption] = useState("");
  const [fileError, setFileError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewReady, setPreviewReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const captureRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    const refresh = () => {
      void getDailyState()
        .then((value) => {
          if (active) setDay(value);
        })
        .catch((error) => {
          if (active) setStatusError(error.message);
        });
    };
    refresh();
    const timer = setInterval(refresh, 15000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);
  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  function resetMedia(type = mediaType) {
    setMediaType(type);
    setSelectedFile(null);
    setPreviewUrl("");
    setPreviewReady(false);
    setFileError("");
    if (captureRef.current) captureRef.current.value = "";
  }
  function selectFile(file: File | undefined) {
    if (!file) return;
    const error = validateMediaFile(file);
    setFileError(error ?? "");
    if (error) return;
    setMediaType(file.type.startsWith("image/") ? "photo" : "video");
    setSelectedFile(file);
    setPreviewReady(false);
    setPreviewUrl(URL.createObjectURL(file));
  }
  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    selectFile(file);
  }
  async function takePhoto() {
    if (mediaType !== "photo" || !isNativeApp()) {
      captureRef.current?.click();
      return;
    }
    setCapturing(true);
    setFileError("");
    try {
      selectFile((await captureNativePhoto()) ?? undefined);
    } catch (error) {
      setFileError(
        error instanceof Error ? error.message : "Could not open the camera.",
      );
    } finally {
      setCapturing(false);
    }
  }
  function previewFailed() {
    setPreviewReady(false);
    setFileError(
      "This file could not be previewed. Try a different photo or video format.",
    );
  }
  async function publish() {
    if (!day || !selectedFile || !previewReady || publishing) return;
    setPublishing(true);
    setFileError("");
    const captionError = validateUserText(caption);
    if (captionError) {
      setFileError(captionError);
      setPublishing(false);
      return;
    }
    try {
      setDay(await submitDailyProof(day, selectedFile, caption));
    } catch (error) {
      setFileError(
        error instanceof Error ? error.message : "Could not submit your dare.",
      );
    } finally {
      setPublishing(false);
    }
  }

  if (!day || dailyPhase(day) !== "open")
    return (
      <div className="mx-auto max-w-xl px-5 py-16 text-center">
        <h1 className="text-2xl font-bold">
          {!day
            ? "Getting your dare…"
            : dailyPhase(day) === "completed"
              ? "Streak secured."
              : dailyPhase(day) === "skipped"
                ? "Today is protected."
                : "Your dare isn’t open yet."}
        </h1>
        <p
          role="status"
          className="mt-4 text-sm text-neutral-500 dark:text-neutral-300"
        >
          {statusError ||
            (day?.completedAt
              ? "You’ve completed today’s dare. See you tomorrow."
              : day?.skippedAt
                ? "You used a skip. Your streak is protected, and a new dare arrives tomorrow."
                : "Your daily dare drops between 9am and 8pm. You then have until midnight to post a photo or video.")}
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-teal-700 underline dark:text-teal-300"
        >
          Back to today
        </Link>
      </div>
    );
  const buttonClass =
    "flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-50";
  return (
    <div className="mx-auto max-w-3xl px-5 pb-32 pt-8 lg:px-10">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-300"
      >
        <ChevronLeft size={17} /> Back to today
      </Link>
      <p className="text-xs font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-300">
        Your proof, your way
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Do the dare.</h1>
      <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-300">
        A photo or a short video. Show us your version of today’s dare.
      </p>
      <div className="mt-6 rounded-3xl border border-teal-200 bg-teal-50 p-5 dark:border-teal-900 dark:bg-teal-950/60">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">
          Today’s dare
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-teal-950 dark:text-teal-50">
          {day.challenge.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-teal-900/75 dark:text-teal-100/80">
          {day.challenge.instructions}
        </p>
      </div>
      <fieldset
        disabled={publishing}
        className="mt-7 min-w-0 disabled:opacity-70"
      >
        <legend className="sr-only">Create your photo or video proof</legend>
        <div
          role="group"
          aria-label="Proof format"
          className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-neutral-100 p-1.5 dark:bg-neutral-800"
        >
          {(["photo", "video"] as const).map((type) => (
            <button
              key={type}
              type="button"
              aria-pressed={mediaType === type}
              onClick={() => {
                if (type !== mediaType) resetMedia(type);
              }}
              className={`${buttonClass} ${mediaType === type ? "bg-white text-teal-700 shadow-sm dark:bg-neutral-700 dark:text-teal-300" : "text-neutral-500 dark:text-neutral-400"}`}
            >
              {type === "photo" ? <ImagePlus size={18} /> : <Video size={18} />}
              {type === "photo" ? "Photo" : "Video"}
            </button>
          ))}
        </div>
        <div className="grid gap-7 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-neutral-100 dark:bg-neutral-800">
            {previewUrl ? (
              mediaType === "photo" ? (
                <img
                  src={previewUrl}
                  alt="Your photo proof preview"
                  onLoad={() => setPreviewReady(true)}
                  onError={previewFailed}
                  className="h-full w-full object-contain"
                />
              ) : (
                <video
                  src={previewUrl}
                  controls
                  muted
                  playsInline
                  onLoadedData={() => setPreviewReady(true)}
                  onError={previewFailed}
                  className="h-full w-full object-contain"
                />
              )
            ) : (
              <div className="flex h-full flex-col items-center justify-center p-7 text-center">
                <span className="mb-5 rounded-full bg-teal-50 p-5 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                  {mediaType === "photo" ? (
                    <Camera size={32} />
                  ) : (
                    <Video size={32} />
                  )}
                </span>
                <p className="text-xl font-semibold">
                  {mediaType === "photo"
                    ? "One photo. Your moment."
                    : "A little clip. A real moment."}
                </p>
                <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
                  {mediaType === "photo"
                    ? "JPG, PNG, or WebP · up to 20 MB"
                    : "MP4, WebM, or MOV · up to 80 MB"}
                </p>
              </div>
            )}
          </div>
          <div>
            <div className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-700">
              <p className="font-semibold">{day.challenge.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-300">
                {day.challenge.instructions}
              </p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => void takePhoto()}
                disabled={capturing}
                className={`${buttonClass} col-span-2 bg-teal-700 text-white hover:bg-teal-800`}
              >
                <Camera size={18} />
                {capturing
                  ? "Opening camera..."
                  : mediaType === "photo"
                    ? "Take photo"
                    : "Record video"}
              </button>
              <input
                ref={captureRef}
                type="file"
                accept={mediaType === "photo" ? PHOTO_ACCEPT : VIDEO_ACCEPT}
                capture="environment"
                onChange={handleUpload}
                className="hidden"
                aria-label={`Capture ${mediaType}`}
              />
            </div>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              Take photo or Record video opens your camera on supported phones.
            </p>
            {previewUrl && (
              <button
                type="button"
                onClick={() => resetMedia()}
                className={`${buttonClass} mt-3 w-full border border-neutral-200 dark:border-neutral-700`}
              >
                <RefreshCcw size={16} /> Choose another {mediaType}
              </button>
            )}
            <label className="mt-6 block">
              <span className="flex justify-between text-sm font-semibold">
                <span>Caption</span>
                <span className="font-normal text-neutral-500 dark:text-neutral-400">
                  {MAX_CAPTION_LENGTH - caption.length} left
                </span>
              </span>
              <textarea
                value={caption}
                maxLength={MAX_CAPTION_LENGTH}
                onChange={(event) => setCaption(event.target.value)}
                placeholder="Add a little context… #dailydare"
                className="mt-2 min-h-28 w-full resize-none rounded-2xl border border-neutral-200 bg-white p-4 text-sm dark:border-neutral-700 dark:bg-neutral-900"
              />
            </label>
            <button
              type="button"
              onClick={publish}
              disabled={!previewReady || publishing}
              className={`${buttonClass} mt-5 w-full bg-teal-700 text-white hover:bg-teal-800 disabled:cursor-not-allowed`}
            >
              <Check size={18} />
              {publishing
                ? "Submitting…"
                : isSupabaseConfigured
                  ? `Post ${mediaType} before midnight`
                  : "Complete demo dare"}
            </button>
            {fileError && (
              <p
                role="alert"
                className="mt-3 text-sm text-red-600 dark:text-red-400"
              >
                {fileError}
              </p>
            )}
            <p className="mt-4 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              {isSupabaseConfigured
                ? "Your upload must finish before midnight to count."
                : "Demo: saves your streak on this device. Your photo or video is not published."}
            </p>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
