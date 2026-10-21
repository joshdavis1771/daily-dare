"use client";

import { Check, ArrowRight, Sparkles } from "lucide-react";
import { PACKS, type PackId } from "@/lib/plus";

export function PackPicker({ selected, onChange, onConfirm }: { selected: PackId[]; onChange: (ids: PackId[]) => void; onConfirm: () => void }) {
  return <section aria-labelledby="pack-heading">
    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-teal-300"><span>Make it yours</span><span>Step 1 of 2</span></div>
    <div className="mt-7 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-300/10 text-teal-200"><Sparkles /></div>
    <h1 id="pack-heading" className="mt-5 text-4xl font-black tracking-tight">What’s your kind<br />of adventure?</h1>
    <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65">Pick the 3 packs you like the look of. Your daily dares will only come from these packs.</p>
    <div className="mt-6 flex items-center justify-between"><p className="text-xs font-semibold text-white/60">A little more of what you love.</p><span aria-live="polite" className="rounded-full bg-teal-300/10 px-3 py-1.5 text-xs font-bold text-teal-200">{selected.length} / 3 selected</span></div>
    <div className="mt-4 grid grid-cols-2 gap-3">{PACKS.map(pack => {
      const active = selected.includes(pack.id);
      return <button key={pack.id} type="button" aria-pressed={active} disabled={!active && selected.length === 3} onClick={() => onChange(active ? selected.filter(id => id !== pack.id) : [...selected, pack.id])} className={`relative rounded-2xl border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300 disabled:opacity-40 ${active ? "border-teal-300 bg-teal-300/10" : "border-white/10 bg-white/5 hover:border-white/40"}`}>
        <span className="text-2xl" aria-hidden="true">{pack.emoji}</span><span className={`absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full border ${active ? "border-teal-300 bg-teal-300 text-neutral-900" : "border-white/25"}`}>{active && <Check size={13} />}</span>
        <span className="mt-3 block text-sm font-bold">{pack.title}</span><span className="mt-1 block text-xs leading-relaxed text-white/55">{pack.description}</span><span className="mt-3 block text-[11px] leading-relaxed text-teal-200/85">Try: {pack.dares[0].title}</span>
      </button>;
    })}</div>
    <div className="sticky bottom-0 mt-6 bg-[#171717]/95 py-4 backdrop-blur"><button type="button" disabled={selected.length !== 3} onClick={onConfirm} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-300 px-5 py-4 text-sm font-bold text-neutral-950 disabled:opacity-40">Confirm my 3 packs <ArrowRight size={17} /></button><p className="mt-3 text-center text-xs text-white/45">Three favourites. One little dare, every day.</p></div>
  </section>;
}
