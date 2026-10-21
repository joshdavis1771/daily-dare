"use client";

import { MoreHorizontal, Flag, UserRoundMinus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { isBlocked, reportReasons, reportTarget, setBlocked, useModeration, type ReportReason, type SafetyTarget } from "@/lib/moderation";

export function SafetyControls({ target, iconOnly = false }: { target: SafetyTarget; iconOnly?: boolean }) {
  const { blocks } = useModeration();
  const blocked = isBlocked(blocks, target.userId);
  const [action, setAction] = useState<"options" | "report" | "block" | null>(null);
  const [reason, setReason] = useState<ReportReason>(reportReasons[0]);
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (action) dialog.current?.showModal();
    else dialog.current?.close();
  }, [action]);
  if (target.userId === "p1") return null;
  function open(next: "options" | "report" | "block") { setError(""); setMessage(""); setAction(next); }
  async function submit() {
    setBusy(true); setError("");
    try {
      if (action === "report") setMessage(await reportTarget(target, reason, details));
      else { await setBlocked(target, !blocked); setMessage(blocked ? `Unblocked @${target.username}.` : `Blocked @${target.username}.`); }
      setDetails(""); setAction(null);
    } catch (error) { setError(error instanceof Error ? error.message : "Could not save. Please try again."); }
    finally { setBusy(false); }
  }
  return <div className={iconOnly ? "shrink-0 text-xs" : "my-2 text-xs"}>
    <button type="button" onClick={() => open("options")} aria-label={`Report or block @${target.username}`} aria-haspopup="dialog" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 font-semibold text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-teal-600 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"><MoreHorizontal size={20} aria-hidden="true" />{!iconOnly && <span>Options</span>}</button>
    {message && <p role="status" className="mt-2 text-teal-700 dark:text-teal-300">{message}</p>}
    <dialog ref={dialog} onCancel={event => { if (busy) event.preventDefault(); else setAction(null); }} onClose={() => setAction(null)} aria-label={action === "options" ? `Options for @${target.username}` : action === "report" ? "Report content" : "Block user"} className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-white p-6 text-neutral-900 shadow-xl backdrop:bg-black/50 dark:bg-neutral-900 dark:text-white">
      {action === "options" ? <div>
        <h2 className="text-lg font-bold">@{target.username}</h2>
        <div className="mt-4 space-y-2">
          <button type="button" onClick={() => open("report")} className="flex min-h-12 w-full items-center gap-3 rounded-xl px-4 text-left text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800"><Flag size={18} />Report {target.postId ? "post" : "user"}</button>
          <button type="button" onClick={() => open("block")} className="flex min-h-12 w-full items-center gap-3 rounded-xl px-4 text-left text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"><UserRoundMinus size={18} />{blocked ? "Unblock" : "Block"} @{target.username}</button>
        </div>
        <button type="button" onClick={() => setAction(null)} className="mt-4 min-h-11 w-full rounded-lg border text-sm font-semibold">Cancel</button>
      </div> : <form onSubmit={event => { event.preventDefault(); void submit(); }}>
        <h2 className="text-lg font-bold">{action === "report" ? `Report ${target.postId ? "post" : `@${target.username}`}` : `${blocked ? "Unblock" : "Block"} @${target.username}?`}</h2>
        {action === "report" ? <><p className="mt-2 text-sm">Choose why you’re reporting this. Your report is private.</p><label className="mt-4 block text-sm font-semibold">Reason<select value={reason} onChange={event => setReason(event.target.value as ReportReason)} className="mt-2 w-full rounded-lg border p-3 dark:bg-neutral-800">{reportReasons.map(item => <option key={item}>{item}</option>)}</select></label><label className="mt-4 block text-sm font-semibold">Details (optional)<textarea maxLength={1000} value={details} onChange={event => setDetails(event.target.value)} className="mt-2 w-full rounded-lg border p-3 dark:bg-neutral-800" rows={3} /></label></> : <p className="mt-3 text-sm">{blocked ? "Their posts and conversations will be visible again." : "Their posts, comments, and conversations will be hidden. You can unblock them in Settings."}</p>}
        {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="mt-5 flex justify-end gap-3"><button type="button" disabled={busy} onClick={() => setAction(null)} className="min-h-11 rounded-lg border px-4">Cancel</button><button disabled={busy} className="min-h-11 rounded-lg bg-teal-700 px-4 font-semibold text-white disabled:opacity-50">{busy ? "Saving…" : action === "report" ? "Submit report" : blocked ? "Unblock" : "Block user"}</button></div>
      </form>}
    </dialog>
  </div>;
}

export function BlockedAccounts() {
  const { blocks } = useModeration();
  return <section className="mt-8"><h2 className="text-sm font-bold">Blocked accounts</h2>{blocks.length ? blocks.map(block => <SafetyControls key={block.userId} target={block} />) : <p className="mt-2 text-sm text-neutral-500">You haven’t blocked anyone.</p>}</section>;
}
