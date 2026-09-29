import webpush from "web-push";
import { timingSafeEqual } from "node:crypto";
import { adminClient, validPushEndpoint } from "@/lib/server/push";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  if (!secret || header.length !== expected.length || !timingSafeEqual(Buffer.from(header), Buffer.from(expected))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { NEXT_PUBLIC_VAPID_PUBLIC_KEY: publicKey, VAPID_PRIVATE_KEY: privateKey, VAPID_SUBJECT: subject } = process.env;
    if (!publicKey || !privateKey || !subject) throw new Error("Missing push configuration");
    webpush.setVapidDetails(subject, publicKey, privateKey);
    const db = adminClient();
    const { data: days, error } = await db.rpc("claim_daily_notifications");
    if (error) throw error;
    let sent = 0;
    let failed = 0;
    // Bounded concurrency keeps a batch within the cron lease and request time limit.
    for (let start = 0; start < (days ?? []).length; start += 10) {
      await Promise.all(days.slice(start, start + 10).map(async (day: { user_id: string; day: string; deadline: string; lease_token: string }) => {
        const { data: current, error: currentError } = await db.from("dare_days").select("completed_at").eq("user_id", day.user_id).eq("day", day.day).single();
        if (currentError) { failed++; return; }
        if (current.completed_at || Date.parse(day.deadline) <= Date.now()) return;
        const { data: subscriptions, error: readError } = await db.from("push_subscriptions").select("endpoint,p256dh,auth").eq("user_id", day.user_id);
        if (readError) { failed++; return; }
        let delivered = false;
        let retry = false;
        await Promise.all((subscriptions ?? []).map(async (sub) => {
          if (!validPushEndpoint(sub.endpoint)) { retry = true; return; }
          try {
            const ttl = Math.floor((Date.parse(day.deadline) - Date.now()) / 1000);
            if (ttl <= 0) return;
            await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, JSON.stringify({
              title: "It’s time for your Daily Dare.",
              body: "Your dare is ready. Post before midnight to keep your streak.",
              tag: `daily-dare-${day.day}`, url: "/", deadline: day.deadline,
            }), { TTL: ttl, urgency: "high", timeout: 4000 });
            delivered = true;
          } catch (error) {
            const status = (error as { statusCode?: number }).statusCode;
            if (status === 404 || status === 410) {
              const { error: deleteError } = await db.from("push_subscriptions").delete().eq("endpoint", sub.endpoint).eq("user_id", day.user_id);
              if (deleteError) retry = true;
            } else retry = true;
          }
        }));
        if (retry) failed++;
        // Transient errors retry after the lease; a stable notification tag replaces duplicates.
        if (delivered && !retry) {
          const { error: updateError } = await db.from("dare_days").update({ notified_at: new Date().toISOString(), lease_token: null }).eq("user_id", day.user_id).eq("day", day.day).eq("lease_token", day.lease_token);
          if (updateError) failed++; else sent++;
        }
      }));
    }
    return Response.json({ sent, failed }, { status: failed ? 207 : 200 });
  } catch { return Response.json({ error: "Daily notification job failed" }, { status: 503 }); }
}
