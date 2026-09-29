import { adminClient, validPushEndpoint, validPushKey } from "@/lib/server/push";

async function manage(request: Request) {
  try {
    const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
    if (!token) return Response.json({ error: "Sign in required" }, { status: 401 });
    const db = adminClient();
    const { data: { user }, error } = await db.auth.getUser(token);
    if (error || !user) return Response.json({ error: "Sign in required" }, { status: 401 });
    const raw = await request.text();
    if (raw.length > 4096) return Response.json({ error: "Subscription too large" }, { status: 413 });
    let body;
    try { body = JSON.parse(raw); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
    if (!body || !validPushEndpoint(body.endpoint)) return Response.json({ error: "Invalid push endpoint" }, { status: 400 });
    if (request.method === "DELETE") {
      const { error } = await db.from("push_subscriptions").delete().eq("endpoint", body.endpoint).eq("user_id", user.id);
      if (error) throw error;
    } else {
      if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY || !process.env.VAPID_SUBJECT) return Response.json({ error: "Notifications are not configured" }, { status: 503 });
      if (!validPushKey(body.keys?.p256dh, 65) || !validPushKey(body.keys?.auth, 16)) return Response.json({ error: "Invalid push keys" }, { status: 400 });
      const { data: existing, error: readError } = await db.from("push_subscriptions").select("user_id").eq("endpoint", body.endpoint).maybeSingle();
      if (readError) throw readError;
      if (existing && existing.user_id !== user.id) return Response.json({ error: "Unsubscribe this device from its previous account first" }, { status: 409 });
      const { count, error: countError } = await db.from("push_subscriptions").select("endpoint", { count: "exact", head: true }).eq("user_id", user.id);
      if (countError) throw countError;
      if (!existing && (count ?? 0) >= 5) return Response.json({ error: "Device limit reached" }, { status: 409 });
      // Updating is scoped to the owner; insert conflicts never reassign an endpoint.
      const value = { endpoint: body.endpoint, user_id: user.id, p256dh: body.keys.p256dh, auth: body.keys.auth };
      const { error: writeError } = existing
        ? await db.from("push_subscriptions").update(value).eq("endpoint", body.endpoint).eq("user_id", user.id)
        : await db.from("push_subscriptions").insert(value);
      if (writeError) throw writeError;
    }
    return Response.json({ ok: true });
  } catch { return Response.json({ error: "Notifications unavailable" }, { status: 503 }); }
}
export const POST = manage;
export const DELETE = manage;
