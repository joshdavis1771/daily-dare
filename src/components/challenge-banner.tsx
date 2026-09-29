import Link from "next/link";
import { Camera } from "lucide-react";
import type { Challenge } from "@/lib/types";

export function ChallengeBanner({ challenge }: { challenge: Challenge }) {
  return <section className="border-b border-neutral-200 dark:border-neutral-700 pb-7 text-center">
    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-300">One day. One dare.</p>
    <h1 className="mx-auto mt-3 max-w-sm text-[28px] font-bold leading-tight tracking-[-0.045em]">{challenge.title}</h1>
    <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-neutral-500 dark:text-neutral-300">{challenge.instructions}</p>
    <Link href="/create" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"><Camera size={17} /> Post your dare</Link>
  </section>;
}
