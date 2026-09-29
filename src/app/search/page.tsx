"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { demoProfiles } from "@/lib/demo-data";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.replace(/^@/, "").toLowerCase();
  const results = demoProfiles.filter((profile) =>
    `${profile.username} ${profile.displayName}`
      .toLowerCase()
      .includes(normalizedQuery),
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-5 pb-32 pt-10 lg:px-10">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">
          find your people
        </p>
        <h1 className="font-display mt-2 text-3xl font-black tracking-[-0.07em]">
          Discover.
        </h1>
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[#171717]/12 bg-white px-4 py-4 dark:border-neutral-700 dark:bg-neutral-900">
          <Search
            size={20}
            className="text-[#171717]/45 dark:text-neutral-400"
          />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search people or #hashtags"
            className="w-full bg-transparent text-base outline-none placeholder:text-[#171717]/35 dark:placeholder:text-neutral-500"
          />
        </div>
        <div className="mt-8 space-y-3">
          {results.map((profile) => (
            <Link
              href={
                profile.id === demoProfiles[0].id
                  ? "/profile"
                  : `/profile/${profile.username}`
              }
              key={profile.id}
              className="flex items-center gap-4 rounded-2xl border border-[#171717]/10 bg-white/50 p-4 transition hover:border-teal-200 hover:bg-teal-50/50 dark:border-neutral-700 dark:bg-neutral-800/50 dark:hover:border-teal-800 dark:hover:bg-teal-950/50"
            >
              <Image
                src={profile.avatarUrl}
                alt=""
                width={48}
                height={48}
                unoptimized
                className="h-12 w-12 rounded-full object-cover"
              />
              <span>
                <strong className="block">{profile.displayName}</strong>
                <span className="text-sm text-[#171717]/50 dark:text-neutral-400">
                  @{profile.username} · {profile.followers.toLocaleString()}{" "}
                  followers
                </span>
              </span>
            </Link>
          ))}
          {results.length === 0 && (
            <p className="py-10 text-center text-sm text-[#171717]/50 dark:text-neutral-400">
              No dares found yet. Try another spark.
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
