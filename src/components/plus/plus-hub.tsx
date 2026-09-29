"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Crown,
  Flame,
  HeartHandshake,
  LockKeyhole,
  Plus,
  RotateCcw,
  ShieldCheck,
  SkipForward,
  Sparkles,
  TicketPercent,
  Users,
  WandSparkles,
} from "lucide-react";
import {
  activatePlus,
  addCustomDare,
  addGroup,
  longestStreak,
  PACKS,
  PLUS_DARE_COUNT,
  PLUS_GROUP_LIMIT,
  PLUS_PLANS,
  redeemPlusPromo,
  type Comfort,
  type PackId,
  type PlusDare,
} from "@/lib/plus";
import { readPlus, updatePlus, usePlus } from "@/lib/plus-store";
import {
  saveFutureNote as saveFutureNoteValue,
  spendDailyToken,
  useCurrentTime,
  useDemoHistory,
  useFutureNote,
} from "@/lib/plus-tools";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useIsNativeApp } from "@/lib/native";
import { NativePlusHub } from "./native-plus-hub";

const tabs = [
  "Overview",
  "Archive",
  "Packs",
  "Private dares",
  "Progress",
  "Suggestions",
] as const;
type Tab = (typeof tabs)[number];
const features = [
  {
    icon: BookOpen,
    title: "Keep it forever",
    description:
      "Turn completed dares into a private timeline, meaningful chapters, and a year you can revisit.",
    tab: "Archive",
  },
  {
    icon: Users,
    title: "Your people. Your dares.",
    description:
      "Create custom challenges for friends and private groups of up to 50.",
    tab: "Private dares",
  },
  {
    icon: HeartHandshake,
    title: "More ways to show up",
    description:
      "Plus unlocks the full 10,000-dare library across ten categories.",
    tab: "Packs",
  },
  {
    icon: Award,
    title: "See how far you’ve come",
    description:
      "Streak milestones, badges, progress history, and meaningful stats.",
    tab: "Progress",
  },
  {
    icon: SkipForward,
    title: "A little breathing room",
    description: "Three skips and three try again tokens every week.",
    tab: "Progress",
  },
  {
    icon: WandSparkles,
    title: "A nudge that gets you",
    description:
      "Dare suggestions matched to your interests and comfort level.",
    tab: "Suggestions",
  },
] as const;

export function PlusHub() {
  const state = usePlus();
  const nativeApp = useIsNativeApp();
  const [tab, setTab] = useState<Tab>("Overview");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [promoCode, setPromoCode] = useState("");
  function act(action: () => void, success = "Saved.") {
    try {
      action();
      setError("");
      setMessage(success);
    } catch (e) {
      setMessage("");
      setError(
        e instanceof Error ? e.message : "Could not save. Please try again.",
      );
    }
  }
  function open(next: Tab) {
    if (!state.enabled) {
      setError("Start your free Plus preview to explore these features.");
      return;
    }
    setTab(next);
    setMessage("");
    setError("");
  }
  function selectPlan(plan: (typeof PLUS_PLANS)[number]) {
    if (!state.enabled) {
      setError("Start the free Plus preview before choosing a preview plan.");
      return;
    }
    updatePlus((current) => ({ ...current, plan }));
    setMessage(`Preview plan selected: ${plan}. No web purchase was made.`);
  }
  function redeemPromo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    act(
      () => updatePlus((current) => redeemPlusPromo(current, promoCode)),
      "Promo applied. Welcome to Plus.",
    );
    setPromoCode("");
  }
  if (nativeApp) return <NativePlusHub />;
  return (
    <div
      data-plan={state.enabled ? state.plan : undefined}
      onClick={(event) => {
        const card = (event.target as HTMLElement).closest(".plus-price-card");
        if (!card) return;
        const cards = Array.from(card.parentElement?.children ?? []).filter(
          (item) => item.classList.contains("plus-price-card"),
        );
        const index = cards.indexOf(card);
        const plans = ["Monthly", "Yearly", "Founding"] as const;
        if (index >= 0) selectPlan(plans[index]);
      }}
      className="plus-page mx-auto max-w-4xl px-5 pb-32 pt-5 sm:px-8"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-xs font-semibold tracking-wide">
          <Crown size={16} className="text-amber-600 dark:text-amber-300" />{" "}
          DAILY DARE <span className="plus-label">PLUS</span>
        </span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {state.enabled
            ? "Free preview active"
            : "Free web preview · no billing"}
        </span>
      </div>
      <section className="plus-hero relative overflow-hidden rounded-[2rem] p-7 text-white sm:p-10">
        <div className="relative z-10 max-w-lg">
          <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
            <Sparkles size={15} /> Your everyday, with a little extra
          </p>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-[-0.05em] sm:text-5xl">
            More moments.
            <br />
            <span className="text-amber-200">More you.</span>
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
            Plus gives you a personal archive, private dares and groups, weekly
            skips and retries, and suggestions shaped around your history.
            Unlock{" "}
            <strong className="text-2xl font-black leading-none text-amber-200 sm:text-3xl">
              {PLUS_DARE_COUNT.toLocaleString()}
            </strong>{" "}
            ways to show up across ten kinds of everyday possibility: enough
            inspiration for{" "}
            <strong className="text-lg font-black text-amber-200 sm:text-xl">
              27 years
            </strong>{" "}
            of daily dares.
          </p>
          {state.enabled ? (
            <button
              onClick={() => {
                open("Overview");
                const target = document.getElementById("plus-pricing");
                if (target) {
                  const start = window.scrollY;
                  const distance = target.getBoundingClientRect().top;
                  const startedAt = performance.now();
                  const duration = 1200;
                  const step = (now: number) => {
                    const progress = Math.min((now - startedAt) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    window.scrollTo(0, start + distance * eased);
                    if (progress < 1) requestAnimationFrame(step);
                  };
                  requestAnimationFrame(step);
                }
              }}
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-amber-200 px-6 py-3 text-sm font-bold text-neutral-950 hover:bg-amber-100"
            >
              Explore your Plus <ArrowRight size={17} />
            </button>
          ) : (
            <button
              onClick={() =>
                act(
                  () => updatePlus(activatePlus),
                  "Free Plus preview started. No purchase was made.",
                )
              }
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-amber-200 px-6 py-3 text-sm font-bold text-neutral-950 hover:bg-amber-100"
            >
              Try Plus preview <ArrowRight size={17} />
            </button>
          )}
        </div>
        <div aria-hidden="true" className="plus-orbit">
          <span>+</span>
        </div>
      </section>
      <form
        onSubmit={redeemPromo}
        className="plus-card mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label
            htmlFor="plus-promo"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <TicketPercent
              size={17}
              className="text-teal-700 dark:text-teal-300"
            />{" "}
            Have a promo code?
          </label>
          <input
            id="plus-promo"
            value={promoCode}
            onChange={(event) => setPromoCode(event.target.value)}
            placeholder="Enter promo code"
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-transparent px-3 py-2.5 text-sm uppercase outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 dark:border-neutral-700"
          />
        </div>
        <button type="submit" className="plus-button-secondary min-h-11">
          Apply code
        </button>
      </form>
      <section aria-labelledby="plus-pricing" className="mt-5">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="plus-eyebrow">Preview pricing</p>
            <h2
              id="plus-pricing"
              className="mt-1 text-xl font-bold tracking-tight"
            >
              Plus, when you’re ready.
            </h2>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Web demo · no billing
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div tabIndex={0} className="plus-card plus-price-card">
            <p className="text-sm font-semibold">Monthly</p>
            <p className="mt-3 text-2xl font-bold">
              $4.99
              <span className="text-sm font-normal text-neutral-500">
                {" "}
                / month
              </span>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              Flexible access to every Plus feature.
            </p>
          </div>
          <div
            tabIndex={0}
            className="plus-card plus-price-card border-teal-300 dark:border-teal-700"
          >
            <p className="flex items-center justify-between text-sm font-semibold">
              Yearly{" "}
              <span className="inline-flex h-6 items-center rounded-full bg-teal-50 px-2 py-1 text-[10px] uppercase tracking-wide text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                Best value
              </span>
            </p>
            <p className="mt-3 text-2xl font-bold">
              $39.99
              <span className="text-sm font-normal text-neutral-500">
                {" "}
                / year
              </span>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              A full year of keeping the little moments.
            </p>
          </div>
          <div
            tabIndex={0}
            className="plus-card plus-price-card border-amber-300 bg-amber-50/60 dark:border-amber-800 dark:bg-amber-950/20"
          >
            <p className="flex items-center justify-between gap-2 text-sm font-semibold">
              Founding plan{" "}
              <span className="inline-flex h-6 items-center rounded-full bg-amber-200 px-2 py-1 text-[10px] uppercase tracking-wide text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                One-time
              </span>
            </p>
            <p className="mt-3 text-2xl font-bold">
              $59.99
              <span className="text-sm font-normal text-neutral-500">
                {" "}
                lifetime
              </span>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              For early supporters. Pay once, keep Plus forever.
            </p>
          </div>
        </div>
      </section>
      <p className="mb-4 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-950 dark:bg-amber-950/40 dark:text-amber-100">
        Web preview pricing is illustrative. This page does not process
        purchases, renewals, or cancellations.
      </p>
      <div className="my-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-neutral-500 dark:text-neutral-400">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} /> Ad-free
        </span>
        <span className="flex items-center gap-1.5">
          <LockKeyhole size={14} /> Your pace, your choice
        </span>
        <span>Preview saved on this device</span>
      </div>
      <div role="status" aria-live="polite">
        {message && (
          <p className="mb-4 rounded-xl bg-teal-50 p-3 text-sm text-teal-800 dark:bg-teal-950 dark:text-teal-200">
            {message}
          </p>
        )}
      </div>
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
        >
          {error}
        </p>
      )}
      {state.enabled && (
        <nav
          aria-label="Plus features"
          className="mb-7 flex gap-2 overflow-x-auto border-b border-neutral-200 pb-3 dark:border-neutral-800"
        >
          {tabs.map((item) => (
            <button
              key={item}
              aria-current={tab === item ? "page" : undefined}
              onClick={() => open(item)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${tab === item ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950" : "text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"}`}
            >
              {item}
            </button>
          ))}
        </nav>
      )}
      {state.enabled && tab === "Overview" && (
        <>
          <div
            id="plus-overview"
            className="mb-5 flex items-end justify-between scroll-mt-6"
          >
            <div>
              <p className="plus-eyebrow">
                Small upgrade. Bigger possibilities.
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Make room for more.
              </h2>
            </div>
            <span className="plus-label">ALL INCLUDED</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {features.map(
              ({ icon: Icon, title, description, tab: destination }) => (
                <button
                  key={title}
                  onClick={() => open(destination)}
                  className="plus-card group text-left"
                >
                  <span className="mb-5 inline-flex rounded-xl bg-amber-50 p-2.5 text-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
                    <Icon size={21} />
                  </span>
                  <h3 className="flex items-center justify-between gap-2 font-semibold">
                    {title}
                    <ChevronRight
                      size={16}
                      className="text-neutral-400 group-hover:translate-x-1"
                    />
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {description}
                  </p>
                </button>
              ),
            )}
          </div>
          <div className="plus-card mt-4 flex items-start gap-4">
            <ShieldCheck className="shrink-0 text-teal-700 dark:text-teal-300" />
            <div>
              <h3 className="font-semibold">Less noise. More living.</h3>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Plus is ad-free. There are no ads in the current free preview
                either.
              </p>
            </div>
          </div>
          {state.enabled && (
            <button
              className="mt-6 text-xs text-neutral-500 underline dark:text-neutral-400"
              onClick={() =>
                act(
                  () => updatePlus((s) => ({ ...s, enabled: false })),
                  "Plus preview paused. Your saved dares and settings are kept.",
                )
              }
            >
              Pause Plus preview
            </button>
          )}
        </>
      )}
      {state.enabled && tab === "Archive" && <Archive act={act} />}
      {state.enabled && tab === "Packs" && <Packs act={act} />}
      {state.enabled && tab === "Private dares" && (
        <PrivateDaresSimple act={act} />
      )}
      {state.enabled && tab === "Progress" && <Progress act={act} />}
      {state.enabled && tab === "Suggestions" && <Suggestions act={act} />}
    </div>
  );
}
/*
  function redeemPromo(event: FormEvent<HTMLFormElement>) {
    <section aria-labelledby="plus-pricing" className="mt-5"><div className="mb-3 flex items-end justify-between gap-4"><div><p className="plus-eyebrow">Choose your pace</p><h2 id="plus-pricing" className="mt-1 text-xl font-bold tracking-tight">Plus, when you’re ready.</h2></div><span className="text-xs text-neutral-500 dark:text-neutral-400">Cancel anytime</span></div><div className="plus-card mb-3 flex flex-col gap-3 sm:flex-row sm:items-end"><div className="flex-1"><label htmlFor="plus-promo" className="flex items-center gap-2 text-sm font-semibold"><TicketPercent size={17} className="text-teal-700 dark:text-teal-300" /> Have a 100% off code?</label><input id="plus-promo" value={promoCode} onChange={event => setPromoCode(event.target.value)} placeholder="Enter promo code" className="mt-2 w-full rounded-xl border border-neutral-200 bg-transparent px-3 py-2.5 text-sm uppercase outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 dark:border-neutral-700" /></div><button type="button" onClick={redeemPromo} className="plus-button-secondary min-h-11">Apply code</button></div><div className="grid gap-3 sm:grid-cols-3"><div tabIndex={0} className="plus-card plus-price-card"><p className="text-sm font-semibold">Monthly</p><p className="mt-3 text-2xl font-bold">$4.99<span className="text-sm font-normal text-neutral-500"> / month</span></p><p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">Flexible access to every Plus feature.</p></div><div tabIndex={0} className="plus-card plus-price-card border-teal-300 dark:border-teal-700"><p className="flex items-center justify-between text-sm font-semibold">Yearly <span className="inline-flex h-6 items-center rounded-full bg-teal-50 px-2 py-1 text-[10px] uppercase tracking-wide text-teal-700 dark:bg-teal-950 dark:text-teal-300">Best value</span></p><p className="mt-3 text-2xl font-bold">$39.99<span className="text-sm font-normal text-neutral-500"> / year</span></p><p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">A full year of keeping the little moments.</p></div><div tabIndex={0} className="plus-card plus-price-card border-amber-300 bg-amber-50/60 dark:border-amber-800 dark:bg-amber-950/20"><p className="flex items-center justify-between gap-2 text-sm font-semibold">Founding plan <span className="inline-flex h-6 items-center rounded-full bg-amber-200 px-2 py-1 text-[10px] uppercase tracking-wide text-amber-900 dark:bg-amber-900 dark:text-amber-200">Limited time</span></p><p className="mt-3 text-2xl font-bold">$59.99<span className="text-sm font-normal text-neutral-500"> lifetime</span></p><p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">For early supporters. Pay once, keep Plus forever.</p></div></div></section>
//
  function redeemPromo(event: FormEvent<HTMLFormElement>) {
      //
    event.preventDefault();
    act(() => updatePlus(current => redeemPlusPromo(current, promoCode)), "Promo applied. Welcome to Plus.");
    setPromoCode("");
  }
  <section aria-labelledby="plus-pricing" className="mt-5"><div className="mb-3 flex items-end justify-between gap-4"><div><p className="plus-eyebrow">Choose your pace</p><h2 id="plus-pricing" className="mt-1 text-xl font-bold tracking-tight">Plus, when you’re ready.</h2></div><span className="text-xs text-neutral-500 dark:text-neutral-400">Cancel anytime</span></div><div className="plus-card mb-3 flex flex-col gap-3 sm:flex-row sm:items-end"><div className="flex-1"><label htmlFor="plus-promo" className="flex items-center gap-2 text-sm font-semibold"><TicketPercent size={17} className="text-teal-700 dark:text-teal-300" /> Have a 100% off code?</label><input id="plus-promo" value={promoCode} onChange={event => setPromoCode(event.target.value)} placeholder="Enter promo code" className="mt-2 w-full rounded-xl border border-neutral-200 bg-transparent px-3 py-2.5 text-sm uppercase outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 dark:border-neutral-700" /></div><button type="button" onClick={redeemPromo} className="plus-button-secondary min-h-11">Apply code</button></div><div className="grid gap-3 sm:grid-cols-3"><div tabIndex={0} className="plus-card plus-price-card"><p className="text-sm font-semibold">Monthly</p><p className="mt-3 text-2xl font-bold">$4.99<span className="text-sm font-normal text-neutral-500"> / month</span></p><p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">Flexible access to every Plus feature.</p></div><div tabIndex={0} className="plus-card plus-price-card border-teal-300 dark:border-teal-700"><p className="flex items-center justify-between text-sm font-semibold">Yearly <span className="inline-flex h-6 items-center rounded-full bg-teal-50 px-2 py-1 text-[10px] uppercase tracking-wide text-teal-700 dark:bg-teal-950 dark:text-teal-300">Best value</span></p><p className="mt-3 text-2xl font-bold">$39.99<span className="text-sm font-normal text-neutral-500"> / year</span></p><p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">A full year of keeping the little moments.</p></div><div tabIndex={0} className="plus-card plus-price-card border-amber-300 bg-amber-50/60 dark:border-amber-800 dark:bg-amber-950/20"><p className="flex items-center justify-between gap-2 text-sm font-semibold">Founding plan <span className="inline-flex h-6 items-center rounded-full bg-amber-200 px-2 py-1 text-[10px] uppercase tracking-wide text-amber-900 dark:bg-amber-900 dark:text-amber-200">Limited time</span></p><p className="mt-3 text-2xl font-bold">$59.99<span className="text-sm font-normal text-neutral-500"> lifetime</span></p><p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400"> [truncated]

*/
type Act = (action: () => void, success?: string) => void;
function Archive({ act }: { act: Act }) {
  const days = useDemoHistory().filter((day) => day.completedAt);
  const savedFutureNote = useFutureNote();
  const [futureNoteDraft, setFutureNoteDraft] = useState<string | null>(null);
  const futureNote = futureNoteDraft ?? savedFutureNote;
  const [savedNote, setSavedNote] = useState(false);
  const [visibility, setVisibility] = useState<Record<string, string>>({});

  const completed = [...days].sort((a, b) => b.date.localeCompare(a.date));
  const monthLabel = completed[0]
    ? new Date(`${completed[0].date}T12:00:00`).toLocaleDateString(undefined, {
        month: "long",
      })
    : "This month";
  const chapterTitle =
    completed.length >= 3
      ? `${monthLabel}: Becoming More Playful`
      : `${monthLabel}: Starting Small`;
  const latestPrompt = completed.some((day) =>
    day.challenge.title.toLowerCase().includes("creative"),
  )
    ? "You’ve been choosing creative dares lately — try something restorative."
    : "You’ve been showing up in small ways lately — try a dare that helps you slow down.";

  function saveFutureNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveFutureNoteValue(futureNote.trim());
    setFutureNoteDraft(null);
    setSavedNote(true);
    act(() => undefined, "Your note is sealed for Future You.");
  }

  function downloadScrapbook() {
    const file = new Blob(
      [
        JSON.stringify(
          {
            title: "Your Year in Daily Dare",
            chapter: chapterTitle,
            completed,
            futureMe: futureNote,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "daily-dare-yearbook.json";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <>
      <SectionTitle
        eyebrow="Keep it forever"
        title="Your personal year, in progress."
        subtitle="A quiet archive of the moments you chose to show up for. This is yours to keep, revisit, and share only when you want to."
      />
      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="plus-card">
          <p className="plus-eyebrow">Current chapter</p>
          <h3 className="mt-2 text-2xl font-bold">{chapterTitle}</h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            {completed.length
              ? `${completed.length} moment${completed.length === 1 ? "" : "s"} collected so far. The pattern is becoming yours.`
              : "Your first completed dare will start a chapter here."}
          </p>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-700">
            <div className="h-full w-2/5 rounded-full bg-amber-400" />
          </div>
        </div>
        <div className="plus-card">
          <p className="plus-eyebrow">A gentle reflection</p>
          <p className="mt-3 text-sm leading-relaxed">{latestPrompt}</p>
          <button
            className="plus-button-secondary mt-5"
            onClick={() =>
              act(
                () => undefined,
                "A new reflection will meet you after your next few dares.",
              )
            }
          >
            Save this nudge
          </button>
        </div>
      </div>
      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="font-semibold">Your timeline</h3>
          <button
            onClick={downloadScrapbook}
            className="text-xs font-semibold text-teal-700 underline dark:text-teal-300"
          >
            Download scrapbook
          </button>
        </div>
        {completed.length ? (
          <div className="space-y-3">
            {completed.map((day) => (
              <article className="plus-card flex gap-4" key={day.date}>
                <div className="min-w-14 text-center">
                  <strong className="block text-lg">
                    {new Date(`${day.date}T12:00:00`).getDate()}
                  </strong>
                  <span className="text-[10px] uppercase text-neutral-500">
                    {new Date(`${day.date}T12:00:00`).toLocaleDateString(
                      undefined,
                      { month: "short" },
                    )}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold">{day.challenge.title}</h4>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    {day.challenge.instructions}
                  </p>
                  <label className="mt-4 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    Visibility
                    <select
                      value={visibility[day.date] ?? "Private"}
                      onChange={(event) =>
                        setVisibility((current) => ({
                          ...current,
                          [day.date]: event.target.value,
                        }))
                      }
                      className="rounded-lg border border-neutral-200 bg-transparent px-2 py-1 text-xs dark:border-neutral-700"
                    >
                      <option>Private</option>
                      <option>Close friends</option>
                      <option>Public</option>
                    </select>
                  </label>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="plus-card text-sm text-neutral-500 dark:text-neutral-400">
            Complete a daily dare and your first memory will appear here.
          </div>
        )}
      </section>
      <form onSubmit={saveFutureNote} className="plus-card mt-7">
        <p className="plus-eyebrow">Dear Future Me</p>
        <h3 className="mt-2 text-xl font-bold">
          Leave yourself something warm.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          Once a month, capture a thought, photo, or tiny promise. At the end of
          the year, this collection comes back to you.
        </p>
        <textarea
          value={futureNote}
          onChange={(event) => {
            setFutureNoteDraft(event.target.value);
            setSavedNote(false);
          }}
          maxLength={500}
          rows={4}
          placeholder="Dear future me..."
          className="plus-field mt-5 w-full resize-none"
        />
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xs text-neutral-500">Private by default</span>
          <button type="submit" className="plus-button">
            <Check size={16} /> {savedNote ? "Sealed" : "Seal note"}
          </button>
        </div>
      </form>
    </>
  );
}
function Packs({ act }: { act: Act }) {
  const state = usePlus();
  const [selected, setSelected] = useState<PackId>("fitness");
  const [pagination, setPagination] = useState<{ pack: PackId; count: number }>(
    { pack: "fitness", count: 24 },
  );
  const pack = PACKS.find((p) => p.id === selected)!;
  const visibleCount = pagination.pack === selected ? pagination.count : 24;
  const visibleDares = pack.dares.slice(0, visibleCount);
  return (
    <>
      <SectionTitle
        eyebrow="Exclusive collections"
        title="Pick your kind of adventure."
        subtitle="10,000 dares across ten categories. Practice at your own pace and check in when something feels worth keeping."
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {PACKS.map((p) => (
          <button
            key={p.id}
            aria-pressed={selected === p.id}
            onClick={() => setSelected(p.id)}
            className={`pack-tile pack-${p.tint} ${selected === p.id ? "ring-2 ring-neutral-600 ring-offset-2 dark:ring-neutral-300 dark:ring-offset-neutral-900" : ""}`}
          >
            <span className="text-3xl">{p.emoji}</span>
            <span className="mt-7 block text-sm font-bold">{p.title}</span>
            <span className="mt-2 block text-xs opacity-70">
              1,000 dares · {p.id}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold">{pack.title}</h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {pack.description}
          </p>
        </div>
        <button
          className="plus-button-secondary"
          onClick={() =>
            act(
              () =>
                updatePlus((s) => ({
                  ...s,
                  savedPacks: s.savedPacks.includes(pack.id)
                    ? s.savedPacks.filter((id) => id !== pack.id)
                    : [...s.savedPacks, pack.id],
                })),
              state.savedPacks.includes(pack.id)
                ? "Pack removed from your collection."
                : "Pack saved to your collection.",
            )
          }
        >
          {state.savedPacks.includes(pack.id) ? (
            <Check size={15} />
          ) : (
            <Plus size={15} />
          )}
          {state.savedPacks.includes(pack.id) ? "Saved" : "Save pack"}
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {visibleDares.map((d, i) => (
          <div key={d.id} className="plus-card flex items-start gap-4">
            <span className="pt-1 text-sm text-neutral-400">
              {String(i + 1).padStart(3, "0")}
            </span>
            <div className="flex-1">
              <span className="plus-eyebrow">{d.comfort}</span>
              <h4 className="mt-1 font-semibold">{d.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                {d.instructions}
              </p>
              <button
                className="mt-4 flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-300"
                onClick={() =>
                  act(
                    () =>
                      updatePlus((s) => {
                        const completed = { ...s.completed };
                        if (completed[d.id]) delete completed[d.id];
                        else completed[d.id] = new Date().toISOString();
                        return { ...s, completed };
                      }),
                    state.completed[d.id]
                      ? "Check-in removed."
                      : "Practice check-in saved.",
                  )
                }
              >
                {state.completed[d.id] ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <Plus size={16} />
                )}
                {state.completed[d.id]
                  ? "Checked in · undo"
                  : "I tried this · check in"}
              </button>
            </div>
          </div>
        ))}
        {visibleCount < pack.dares.length && (
          <button
            type="button"
            className="plus-button-secondary mx-auto mt-5"
            onClick={() =>
              setPagination((current) => ({
                pack: selected,
                count: Math.min(
                  (current.pack === selected ? current.count : 24) + 24,
                  pack.dares.length,
                ),
              }))
            }
          >
            Show more dares ({pack.dares.length - visibleCount} left)
          </button>
        )}
      </div>
    </>
  );
}
function PrivateDaresSimple({ act }: { act: Act }) {
  const state = usePlus();
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState("");
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [audience, setAudience] = useState("My friends");
  function createGroup(event: FormEvent) {
    event.preventDefault();
    act(() => {
      updatePlus((current) => addGroup(current, groupName, members.split(",")));
      setGroupName("");
      setMembers("");
    }, "Circle saved. No invitations have been sent.");
  }
  function createDare(event: FormEvent) {
    event.preventDefault();
    act(() => {
      updatePlus((current) =>
        addCustomDare(current, {
          title,
          instructions,
          audience,
          comfort: "gentle",
          category: "creativity",
        }),
      );
      setTitle("");
      setInstructions("");
    }, "Private dare saved.");
  }
  return (
    <>
      <SectionTitle
        eyebrow="Private space"
        title="Make a dare your own."
        subtitle="Create a personal challenge or a circle for shared ideas. Drafts stay on this device and never enter the public feed."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <form onSubmit={createDare} className="plus-card flex flex-col">
          <div>
            <span className="plus-eyebrow">Create a dare</span>
            <h3 className="mt-2 text-lg font-semibold">
              What would you like to try?
            </h3>
          </div>
          <label className="plus-field mt-6">
            Title
            <input
              required
              maxLength={80}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Find the best sunset on your block"
            />
          </label>
          <label className="plus-field">
            Instructions
            <textarea
              required
              maxLength={60}
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              placeholder="Describe how to try it..."
            />
            <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">
              {instructions.length}/60 characters
            </span>
          </label>
          <label className="plus-field">
            Who is it for?
            <select
              value={audience}
              onChange={(event) => setAudience(event.target.value)}
            >
              <option>My friends</option>
              <option>Just me</option>
              {state.groups.map((group) => (
                <option key={group.id} value={group.name}>
                  {group.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="plus-button mt-6 self-start">
            <Plus size={16} /> Save dare
          </button>
        </form>
        <form onSubmit={createGroup} className="plus-card flex flex-col">
          <div>
            <span className="plus-eyebrow">Create a circle</span>
            <h3 className="mt-2 text-lg font-semibold">Who should join?</h3>
          </div>
          <label className="plus-field mt-6">
            Circle name
            <input
              required
              maxLength={50}
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
              placeholder="The weekend crew"
            />
          </label>
          <label className="plus-field">
            People
            <textarea
              value={members}
              onChange={(event) => setMembers(event.target.value)}
              maxLength={3000}
              placeholder="Alex, Sam, Jamie"
            />
          </label>
          <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            Add names separated by commas. Up to {PLUS_GROUP_LIMIT - 1} friends.
          </p>
          <button className="plus-button mt-6 self-start" type="submit">
            <Plus size={16} /> Save circle
          </button>
        </form>
      </div>
      <section className="mt-9">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Saved privately</h3>
          <span className="text-xs text-neutral-500">
            {state.dares.length + state.groups.length} saved
          </span>
        </div>
        {!state.dares.length && !state.groups.length ? (
          <div className="plus-card border-dashed text-sm text-neutral-500 dark:text-neutral-400">
            Your saved dares and circles will appear here.
          </div>
        ) : (
          <div className="space-y-3">
            {state.groups.map((group) => (
              <article key={group.id} className="plus-card">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold">{group.name}</h4>
                  <span className="text-xs text-neutral-500">
                    Circle · {group.members.length + 1} people
                  </span>
                </div>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                  {group.members.length
                    ? `You, ${group.members.join(", ")}`
                    : "Just you for now"}
                </p>
              </article>
            ))}
            {state.dares.map((dare) => (
              <article className="plus-card" key={dare.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="plus-eyebrow">{dare.audience}</span>
                    <h4 className="mt-2 font-semibold">{dare.title}</h4>
                  </div>
                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                    Private
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {dare.instructions}
                </p>
                <div className="mt-4 flex justify-between gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-700">
                  <button
                    className="text-xs font-semibold text-teal-700 dark:text-teal-300"
                    onClick={() =>
                      act(
                        () =>
                          updatePlus((current) => ({
                            ...current,
                            dares: current.dares.map((item) =>
                              item.id === dare.id
                                ? {
                                    ...item,
                                    completedAt: item.completedAt
                                      ? undefined
                                      : new Date().toISOString(),
                                  }
                                : item,
                            ),
                          })),
                        dare.completedAt
                          ? "Check-in removed."
                          : "Practice check-in saved.",
                      )
                    }
                  >
                    {dare.completedAt
                      ? "✓ Tried it · undo"
                      : "I tried this · check in"}
                  </button>
                  <button
                    className="text-xs text-neutral-500 underline"
                    onClick={() =>
                      act(
                        () =>
                          updatePlus((current) => ({
                            ...current,
                            dares: current.dares.filter(
                              (item) => item.id !== dare.id,
                            ),
                          })),
                        "Draft removed.",
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

/* Legacy private dares layout retained below for reference.
function PrivateDaresClean({ act }: { act: Act }) {
      <form onSubmit={createDare} className="plus-card flex flex-col">
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState("");
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [audience, setAudience] = useState("My friends");
  function createGroup(event: FormEvent) { event.preventDefault(); act(() => { updatePlus(current => addGroup(current, groupName, members.split(","))); setGroupName(""); setMembers(""); }, "Private group draft saved. No invitations have been sent."); }
  function createDare(event: FormEvent) { event.preventDefault(); act(() => { updatePlus(current => addCustomDare(current, { title, instructions, audience, comfort: "gentle", category: "creativity" })); setTitle(""); setInstructions(""); }, "Custom dare saved to your private drafts."); }
  return <><SectionTitle eyebrow="Make it yours" title="Private dares, made simple." subtitle="Create a challenge for yourself or your circle. Everything stays in your Plus preview on this device." /><div className="grid gap-4 md:grid-cols-2"><form onSubmit={createDare} className="plus-card flex flex-col"><div className="flex items-start justify-between gap-4"><div><span className="plus-eyebrow">01 · Create</span><h3 className="mt-2 text-lg font-semibold">A dare for your people</h3></div><Sparkles size={20} className="text-amber-600 dark:text-amber-300" /></div><label className="plus-field mt-6">Dare title<input required maxLength={80} value={title} onChange={event => setTitle(event.target.value)} placeholder="Find the best sunset on your block" /></label><label className="plus-field">Instructions<textarea required maxLength={60} value={instructions} onChange={event => setInstructions(event.target.value)} placeholder="Describe how to try it..." /><span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">{instructions.length}/60 characters</span></label><label className="plus-field">Visibility<select value={audience} onChange={event => setAudience(event.target.value)}><option>My friends</option><option>Just me</option>{state.groups.map(group => <option key={group.id} value={group.name}>{group.name}</option>)}</select></label><button type="submit" className="plus-button mt-6 self-start"><Plus size={16} /> Save private dare</button></form><form onSubmit={createGroup} className="plus-card flex flex-col"><div className="flex items-start justify-between gap-4"><div><span className="plus-eyebrow">02 · Gather</span><h3 className="mt-2 text-lg font-semibold">Start a small circle</h3></div><Users size={20} className="text-teal-700 dark:text-teal-300" /></div><label className="plus-field mt-6">Group name<input required maxLength={50} value={groupName} onChange={event => setGroupName(event.target.value)} placeholder="The weekend crew" /></label><label className="plus-field">People to invite<textarea value={members} onChange={event => setMembers(event.target.value)} maxLength={3000} placeholder="Alex, Sam, Jamie" /></label><p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">Add names separated by commas. You can include up to {PLUS_GROUP_LIMIT - 1} friends.</p><button className="plus-button mt-6 self-start" type="submit"><Plus size={16} /> Save group draft</button></form></div>{state.groups.length > 0 && <section className="mt-9"><div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Your circles</h3><span className="text-xs text-neutral-500">{state.groups.length} saved</span></div><div className="grid gap-3 sm:grid-cols-2">{state.groups.map(group => <article key={group.id} className="plus-card"><div className="flex items-center justify-between gap-3"><h4 className="font-semibold">{group.name}</h4><span className="text-xs text-neutral-500">{group.members.length + 1} people</span></div><p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">{group.members.length ? `You, ${group.members.join(", ")}` : "Just you for now"}</p><span className="mt-4 inline-flex text-[11px] font-semibold uppercase tracking-wide text-neutral-400">Draft group</span></article>)}</div></section>}<section className="mt-9"><div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Saved private dares</h3>{state.dares.length > 0 && <span className="text-xs text-neutral-500">{state.dares.length} saved</span>}</div>{!state.dares.length ? <div className="plus-card border-dashed text-sm text-neutral-500 dark:text-neutral-400">Your private dare drafts will appear here. They never enter the public feed.</div> : <div className="space-y-3">{state.dares.map(dare => <article className="plus-card" key={dare.id}><div className="flex items-start justify-between gap-4"><div><span className="plus-eyebrow">{dare.audience}</span><h4 className="mt-2 font-semibold">{dare.title}</h4></div><span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300">Private</span></div><p className="mt-3 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{dare.instructions}</p><div className="mt-5 flex items-center justify-between gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-700"><button className="text-xs font-semibold text-teal-700 dark:text-teal-300" onClick={() => act(() => updatePlus(current => ({ ...current, dares: current.dares.map(item => item.id === dare.id ? { ...item, completedAt: item.completedAt ? undefined : new Date().toISOString() } : item) })), dare.completedAt ? "Check-in removed." : "Your private practice check-in is saved.")}>{dare.completedAt ? "✓ Tried it · undo" : "I tried this · check in"}</button><button className="text-xs text-neutral-500 underline" onClick={() => act(() => updatePlus(current => ({ ...current, dares: current.dares.filter(item => item.id !== dare.id) })), "Draft removed.")}>Remove draft</button></div></article>)}</div>}</section></>;
}

}
*/
function Progress({ act }: { act: Act }) {
  const state = usePlus();
  const days = useDemoHistory();
  const now = useCurrentTime();
  const [busy, setBusy] = useState(false);
  const [tokenMessage, setTokenMessage] = useState("");
  const completed = days.filter((d) => d.completedAt);
  const protectedDays = days.filter((d) => d.completedAt || d.skippedAt);
  const practice =
    Object.keys(state.completed).length +
    state.dares.filter((d) => d.completedAt).length;
  const best = longestStreak(protectedDays.map((d) => d.date));
  const badges = [
    {
      title: "First step",
      detail: "Complete your first daily dare",
      earned: completed.length >= 1,
      icon: "🌱",
    },
    {
      title: "On a roll",
      detail: "Build a 7-day streak",
      earned: best >= 7,
      icon: "🔥",
    },
    {
      title: "Curious soul",
      detail: "Try 3 pack dares",
      earned: Object.keys(state.completed).length >= 3,
      icon: "✨",
    },
    {
      title: "Circle starter",
      detail: "Create a private group draft",
      earned: state.groups.length > 0,
      icon: "🫶",
    },
  ];
  async function token(kind: "skips" | "retries") {
    setBusy(true);
    try {
      await spendDailyToken(kind);
      setTokenMessage(
        kind === "skips"
          ? "Today is protected. Your streak stays intact."
          : "A fresh dare is ready on Today.",
      );
    } catch (e) {
      setTokenMessage(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <SectionTitle
        eyebrow="Every small step counts"
        title="Look at you showing up."
        subtitle="Real activity from this device. Practice check-ins and protected days stay separate from completed daily proofs."
      />
      <div className="grid grid-cols-3 gap-3">
        {[
          [completed.length, "Daily proofs"],
          [best, "Best streak"],
          [practice, "Practice check-ins"],
        ].map(([n, label]) => (
          <div className="plus-card text-center" key={label}>
            <strong className="text-3xl tracking-tight">{n}</strong>
            <p className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400">
              {label}
            </p>
          </div>
        ))}
      </div>
      {isSupabaseConfigured && (
        <p className="mt-3 text-xs text-neutral-500">
          Plus preview history is local. Your live account history is not
          included here.
        </p>
      )}
      <h3 className="mb-3 mt-7 font-semibold">Little wins, collected.</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {badges.map((b) => (
          <div
            className={`plus-card text-center ${b.earned ? "" : "opacity-50"}`}
            key={b.title}
          >
            <span className="text-3xl" aria-hidden="true">
              {b.icon}
            </span>
            <p className="mt-3 text-sm font-semibold">{b.title}</p>
            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
              {b.earned ? "Unlocked" : b.detail}
            </p>
          </div>
        ))}
      </div>
      <div className="plus-card mt-7">
        <h3 className="flex items-center gap-2 font-semibold">
          <Flame size={18} className="text-red-500" /> Life happens. Keep your
          momentum.
        </h3>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Skip protects today’s streak without counting as a completed proof.
          Try again swaps today’s open dare. Neither extends the midnight
          deadline.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            disabled={busy || state.skips === 0 || isSupabaseConfigured}
            className="plus-button-secondary"
            onClick={() => void token("skips")}
          >
            <SkipForward size={17} /> Use skip · {state.skips} left
          </button>
          <button
            disabled={busy || state.retries === 0 || isSupabaseConfigured}
            className="plus-button-secondary"
            onClick={() => void token("retries")}
          >
            <RotateCcw size={17} /> Try again · {state.retries} left
          </button>
        </div>
        <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
          You get 3 skips and 3 try again tokens every week. Tokens apply only
          to an open, unfinished local daily dare.
          {isSupabaseConfigured
            ? " Live-account token support is not enabled."
            : ""}
        </p>
        {tokenMessage && (
          <p
            role="status"
            className="mt-3 text-sm text-teal-700 dark:text-teal-300"
          >
            {tokenMessage}
          </p>
        )}
      </div>
      <h3 className="mb-3 mt-7 font-semibold">Your daily history</h3>
      {days.length ? (
        <div className="plus-card space-y-4">
          {[...days]
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 30)
            .map((d) => (
              <div
                key={d.date}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <div>
                  <p className="font-medium">{d.challenge.title}</p>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    {d.date}
                  </p>
                </div>
                <span className="text-xs text-teal-700 dark:text-teal-300">
                  {d.completedAt
                    ? "Completed"
                    : d.skippedAt
                      ? "Protected"
                      : Date.parse(d.deadline) < now
                        ? "Missed"
                        : "Upcoming / open"}
                </span>
              </div>
            ))}
        </div>
      ) : (
        <div className="plus-card text-sm text-neutral-500">
          Your daily history will appear after you visit Today.
        </div>
      )}
      <button
        className="mt-4 text-xs text-teal-700 underline dark:text-teal-300"
        onClick={() =>
          act(() => {
            const file = new Blob(
              [
                JSON.stringify(
                  { daily: days, packCheckIns: readPlus().completed },
                  null,
                  2,
                ),
              ],
              { type: "application/json" },
            );
            const url = URL.createObjectURL(file);
            const a = document.createElement("a");
            a.href = url;
            a.download = "daily-dare-progress.json";
            a.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
          }, "Progress exported.")
        }
      >
        Download your progress
      </button>
    </>
  );
}
function Suggestions({ act }: { act: Act }) {
  const [interests, setInterests] = useState<PackId[]>(["creativity"]);
  const [comfort, setComfort] = useState<Comfort>("gentle");
  const [suggestions, setSuggestions] = useState<PlusDare[]>([]);
  const [source, setSource] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [round, setRound] = useState(0);
  async function suggest(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/plus/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests, comfort, offset: round }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Suggestions are unavailable.");
      setSuggestions(data.suggestions);
      setSource(data.source);
      setRound((n) => n + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <SectionTitle
        eyebrow="A little inspiration"
        title="What feels like you today?"
        subtitle="Choose your interests and comfort level. Keep it gentle, or try something a little different."
      />
      <form onSubmit={suggest} className="plus-card">
        <fieldset>
          <legend className="text-sm font-semibold">Your interests</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {PACKS.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={interests.includes(p.id)}
                onClick={() =>
                  setInterests((items) =>
                    items.includes(p.id)
                      ? items.filter((id) => id !== p.id)
                      : [...items, p.id],
                  )
                }
                className={`plus-button-secondary capitalize ${interests.includes(p.id) ? "ring-2 ring-teal-600" : ""}`}
              >
                {p.emoji} {p.id}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="plus-field mt-6">
          Comfort level
          <select
            value={comfort}
            onChange={(e) => setComfort(e.target.value as Comfort)}
          >
            <option value="gentle">Gentle · familiar and low pressure</option>
            <option value="steady">
              Steady · a small step outside my usual
            </option>
            <option value="bold">
              Bold · a creative stretch, still my choice
            </option>
          </select>
        </label>
        <button
          disabled={busy || !interests.length}
          className="plus-button mt-5"
          type="submit"
        >
          <WandSparkles size={17} />
          {busy ? "Finding your next dare…" : "Find my next dare"}
        </button>
        <p className="mt-3 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
          This preview uses curated suggestions unless AI is connected. If
          enabled, only your selected interests and comfort level are sent to
          the AI service.
        </p>
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}
      </form>
      {suggestions.length > 0 && (
        <div className="mt-6">
          <p className="plus-eyebrow mb-3">
            {source === "ai"
              ? "AI-assisted suggestions · review before trying"
              : "Curated suggestions · not AI-generated"}
          </p>
          <div className="space-y-3">
            {suggestions.map((d, i) => (
              <div className="plus-card" key={`${round}-${i}`}>
                <p className="plus-eyebrow">
                  {d.category} · {d.comfort}
                </p>
                <h3 className="mt-2 font-semibold">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {d.instructions}
                </p>
                <button
                  className="plus-button-secondary mt-4"
                  onClick={() =>
                    act(
                      () =>
                        updatePlus((s) =>
                          addCustomDare(s, { ...d, audience: "Just me" }),
                        ),
                      "Suggestion saved to your private dares.",
                    )
                  }
                >
                  <Plus size={15} /> Save to private dares
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6">
      <p className="plus-eyebrow">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
        {subtitle}
      </p>
    </div>
  );
}
