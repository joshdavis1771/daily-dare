"use client";

import { FormEvent, startTransition, useEffect, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AppShell } from "@/components/app-shell";
import { demoMessages } from "@/lib/demo-data";
import type { DirectMessage } from "@/lib/types";

import { isBlocked, useModeration } from "@/lib/moderation";
import { SafetyControls } from "@/components/safety-controls";
import { demoProfiles } from "@/lib/demo-data";

const sharedMessagesKey = "daily-dare-shared-messages-v1";
const reactionOptions = ["❤️", "😂", "👏", "✨"] as const;

function loadThreads() {
  if (typeof window === "undefined") return demoMessages;
  try {
    const sharedMessages = JSON.parse(
      window.localStorage.getItem(sharedMessagesKey) ?? "[]",
    ) as Array<DirectMessage & { username: string }>;
    return demoMessages.map((thread) => ({
      ...thread,
      messages: [
        ...thread.messages,
        ...sharedMessages.filter(
          (message) => message.username === thread.username,
        ),
      ],
    }));
  } catch {
    return demoMessages;
  }
}

export default function MessagesPage() {
  const { blocks } = useModeration();
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState("");
  const [threads, setThreads] = useState(demoMessages);
  const [reactions, setReactions] = useState<Record<string, string[]>>({});
  const visibleThreads = threads.filter(thread => !isBlocked(blocks, thread.username));
  const selectedThread = visibleThreads.find((thread) => thread.id === selectedId);

  useEffect(() => {
    startTransition(() => setThreads(loadThreads()));
    const refresh = () => startTransition(() => setThreads(loadThreads()));
    window.addEventListener("daily-dare-messages-updated", refresh);
    return () =>
      window.removeEventListener("daily-dare-messages-updated", refresh);
  }, []);

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !selectedThread) return;
    setThreads((current) =>
      current.map((thread) =>
        thread.id === selectedId
          ? {
              ...thread,
              messages: [
                ...thread.messages,
                { body, fromMe: true, createdAt: "now" },
              ],
            }
          : thread,
      ),
    );
    setDraft("");
  }

  function toggleReaction(messageKey: string, reaction: string) {
    setReactions((current) => {
      const selected = current[messageKey] ?? [];
      const next = selected.includes(reaction)
        ? selected.filter((item) => item !== reaction)
        : [...selected, reaction];
      return { ...current, [messageKey]: next };
    });
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-5 pb-32 pt-10 lg:px-10">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">
          little sparks, shared
        </p>
        <h1 className="font-display mt-2 text-3xl font-black tracking-[-0.07em]">
          Messages
        </h1>
        <div className="mt-8 grid overflow-hidden rounded-[1.5rem] border border-[#171717]/10 bg-white dark:border-neutral-700 dark:bg-neutral-800 md:grid-cols-[minmax(15rem,0.8fr)_1.2fr] md:min-h-[34rem]">
          <aside
            className={`border-b border-[#171717]/10 dark:border-neutral-700 md:border-b-0 md:border-r ${selectedThread ? "hidden md:block" : "block"}`}
          >
            <div className="border-b border-[#171717]/10 px-5 py-4 dark:border-neutral-700">
              <h2 className="font-bold">Your people</h2>
              <p className="mt-1 text-xs text-[#171717]/50 dark:text-neutral-400">
                Send a little sunshine.
              </p>
            </div>
            <div className="p-2">
              {visibleThreads.map((thread) => (
                <button
                  type="button"
                  key={thread.id}
                  onClick={() => setSelectedId(thread.id)}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${thread.id === selectedId ? "bg-teal-50 dark:bg-teal-950" : "hover:bg-neutral-50 dark:hover:bg-neutral-700"}`}
                >
                  <Image
                    src={thread.avatarUrl}
                    alt=""
                    width={44}
                    height={44}
                    unoptimized
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <strong className="block truncate text-sm">
                      {thread.name}
                    </strong>
                    <span className="block truncate text-xs text-[#171717]/50 dark:text-neutral-400">
                      {thread.messages.at(-1)?.body}
                    </span>
                  </span>
                  <span className="text-[10px] text-[#171717]/40 dark:text-neutral-500">
                    {thread.messages.at(-1)?.createdAt}
                  </span>
                </button>
              ))}
            </div>
          </aside>
          {selectedThread ? (
            <section className="block">
              <div className="flex items-center gap-3 border-b border-[#171717]/10 px-5 py-4 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={() => setSelectedId("")}
                  className="grid h-9 w-9 place-items-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 md:hidden"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft size={18} />
                </button>
                <Image
                  src={selectedThread.avatarUrl}
                  alt=""
                  width={40}
                  height={40}
                  unoptimized
                  className="h-10 w-10 rounded-full object-cover"
                />
                <span>
                  <strong className="block text-sm">
                    {selectedThread.name}
                  </strong>
                  <span className="text-xs text-[#171717]/50 dark:text-neutral-400">
                    @{selectedThread.username}
                  </span>
                </span>
              </div>
              <div className="px-5"><SafetyControls target={{ userId: demoProfiles.find(profile => profile.username === selectedThread.username)?.id ?? selectedThread.id, username: selectedThread.username }} /></div>
              <div className="flex min-h-[24rem] flex-col justify-end gap-3 p-5">
                {selectedThread.messages.map((message, index) => (
                  <div
                    key={`${message.createdAt}-${index}`}
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.fromMe ? "self-end rounded-br-sm bg-teal-700 text-white" : "rounded-bl-sm bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100"}`}
                  >
                    <p>{message.body}</p>
                    {message.sharedPost && !isBlocked(blocks, message.sharedPost.creatorUsername) && (
                      <Link
                        href={message.sharedPost.profileUrl}
                        className="mt-3 block overflow-hidden rounded-2xl bg-white/15 text-left outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-teal-300"
                      >
                        <Image
                          src={message.sharedPost.posterUrl}
                          alt={`${message.sharedPost.challengeTitle} preview`}
                          width={640}
                          height={360}
                          loading="eager"
                          unoptimized
                          className="aspect-[16/9] w-full object-cover"
                        />
                        <div className="p-3">
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] opacity-70">
                            Shared dare
                          </p>
                          <p className="mt-1 font-semibold">
                            {message.sharedPost.challengeTitle}
                          </p>
                          <p className="mt-1 text-xs opacity-80">
                            @{message.sharedPost.creatorUsername} · {message.sharedPost.caption}
                          </p>
                        </div>
                      </Link>
                    )}
                    <span
                      className={`mt-1 block text-[10px] ${message.fromMe ? "text-teal-100" : "text-neutral-400"}`}
                    >
                      {message.createdAt}
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {reactionOptions.map((reaction) => {
                        const messageKey = `${selectedThread.id}:${index}`;
                        const selected = reactions[messageKey]?.includes(reaction);
                        return (
                          <button
                            key={reaction}
                            type="button"
                            onClick={() => toggleReaction(messageKey, reaction)}
                            aria-label={`${selected ? "Remove" : "Add"} ${reaction} reaction`}
                            aria-pressed={selected}
                            className={`rounded-full px-2 py-1 text-xs transition ${selected ? "bg-white text-neutral-900" : "bg-white/15 hover:bg-white/30"}`}
                          >
                            {reaction}{selected ? " 1" : ""}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <form
                onSubmit={sendMessage}
                className="flex items-center gap-2 border-t border-[#171717]/10 p-4 dark:border-neutral-700"
              >
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={`Message ${selectedThread.name.split(" ")[0]}`}
                  aria-label="Message"
                  className="min-w-0 flex-1 rounded-xl bg-neutral-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:bg-neutral-700"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-700 text-white transition hover:bg-teal-800 disabled:opacity-40"
                  disabled={!draft.trim()}
                >
                  <Send size={18} />
                </button>
              </form>
            </section>
          ) : (
            <div className="hidden min-h-[34rem] place-items-center p-8 text-center text-sm text-[#171717]/50 dark:text-neutral-400 md:grid">
              <p>Select a conversation to start a little spark.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
