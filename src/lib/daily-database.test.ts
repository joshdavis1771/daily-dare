// @vitest-environment node
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { DailyState } from "./daily";

let db: PGlite;
const user = "11111111-1111-4111-8111-111111111111";
const otherUser = "22222222-2222-4222-8222-222222222222";
let today: string;

async function status(zone = "UTC") {
  const result = await db.query<{ state: DailyState }>("select public.daily_status($1) as state", [zone]);
  return result.rows[0].state;
}
async function openToday() {
  await db.query("update dare_days set opens_at = clock_timestamp() - interval '1 minute', deadline = clock_timestamp() + interval '1 hour' where user_id = $1 and day = $2", [user, today]);
}
async function upload(extension = "mp4", mime = "video/mp4", size = 100) {
  const path = `${user}/${today}/proof.${extension}`;
  await db.query("insert into storage.objects(bucket_id,name,metadata) values ('daily-proofs',$1,$2::jsonb) on conflict do nothing", [path, JSON.stringify({ size, mimetype: mime })]);
  return path;
}
async function complete(path: string) {
  return db.query("select complete_daily_dare($1,$2,'A real attempt')", [today, path]);
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create role anon;
    create role authenticated;
    create role service_role bypassrls;
    create schema auth;
    create table auth.users(id uuid primary key, raw_user_meta_data jsonb default '{}');
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    create schema storage;
    create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    create table storage.objects(bucket_id text, name text primary key, metadata jsonb);
    create function storage.foldername(text) returns text[] language sql as $$ select string_to_array($1,'/') $$;
    alter table storage.objects enable row level security;
  `);
  const first = readFileSync("supabase/migrations/001_daily_dare.sql", "utf8").replace('create extension if not exists "pgcrypto";', '');
  await db.exec(first);
  await db.exec(readFileSync("supabase/migrations/002_daily_notifications.sql", "utf8"));
  await db.exec(readFileSync("supabase/migrations/003_photo_proofs.sql", "utf8"));
  await db.exec(readFileSync("supabase/migrations/004_protect_post_writes.sql", "utf8"));
  await db.exec(readFileSync("supabase/migrations/006_pack_preferences.sql", "utf8"));
  await db.exec(`
    grant usage on schema public, auth, storage to authenticated, anon;
    grant select,insert,update,delete on all tables in schema public to authenticated;
    grant select,insert,delete on storage.objects to authenticated;
    insert into auth.users(id) values ('${user}'), ('${otherUser}');
    insert into challenges(id,title,instructions,category,challenge_date) values ('33333333-3333-4333-8333-333333333333','Test dare','Do a thing','Joy',current_date);
  `);
}, 30000);

afterAll(async () => { await db?.close(); });
beforeEach(async () => {
  await db.exec("reset role; update auth.users set raw_user_meta_data = '{}'; truncate dare_days, daily_preferences, push_subscriptions, posts cascade; truncate storage.objects;");
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [user]);
  today = (await status()).date;
});

describe("daily database lifecycle", () => {
  it("only assigns challenges from confirmed signup packs", async () => {
    await db.query("update auth.users set raw_user_meta_data = $1::jsonb where id = $2", [JSON.stringify({ selected_packs: ["food", "home", "learning"] }), user]);
    await db.query("delete from dare_days where user_id = $1", [user]);
    const day = await status();
    const result = await db.query<{ category: string }>("select category from challenges where id = $1", [day.challenge.id]);
    expect(["food", "home", "learning"]).toContain(result.rows[0].category);
    expect((await status()).challenge.id).toBe(day.challenge.id);
  });
  it("rejects invalid signup pack selections instead of assigning another category", async () => {
    await db.query("update auth.users set raw_user_meta_data = $1::jsonb where id = $2", [JSON.stringify({ selected_packs: ["food", "food", "home"] }), user]);
    await db.query("delete from dare_days where user_id = $1", [user]);
    await expect(status()).rejects.toThrow("three valid packs");
  });
  it("rejects direct post creation even when the client has table grants", async () => {
    await db.exec("set role authenticated");
    await expect(db.query(`insert into posts(user_id, challenge_id, video_path)
      values ($1, '33333333-3333-4333-8333-333333333333', 'nonexistent.mp4')`, [user]))
      .rejects.toThrow("row-level security");
    expect((await db.query("select * from posts")).rows).toHaveLength(0);
  });
  it("allows authenticated RPC completion but prevents proof replacement and duplication", async () => {
    await openToday();
    const path = await upload("jpg", "image/jpeg");
    await db.exec("set role authenticated");
    await complete(path);
    await complete(path);
    expect((await status()).streak).toBe(1);
    const changed = await db.query("update posts set video_path = 'nonexistent.mp4' returning *");
    expect(changed.rows).toHaveLength(0);
    expect((await db.query("select video_path from posts")).rows).toEqual([{ video_path: path }]);
  });
  it("allows only the owner to delete proof without resetting completion", async () => {
    await openToday();
    const path = await upload();
    await db.exec("set role authenticated");
    await complete(path);
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [otherUser]);
    expect((await db.query("delete from posts returning id")).rows).toHaveLength(0);
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [user]);
    expect((await db.query("delete from posts returning id")).rows).toHaveLength(1);
    await complete(path);
    expect((await db.query("select * from posts")).rows).toHaveLength(0);
    expect((await status()).streak).toBe(1);
  });
  it("persists one schedule and timezone across reloads and devices", async () => {
    const first = await status();
    const second = await status("Pacific/Auckland");
    expect(first.opensAt).toBe(second.opensAt);
    expect(second.timezone).toBe("UTC");
    const hour = new Date(first.opensAt).getUTCHours();
    expect(hour).toBeGreaterThanOrEqual(9);
    expect(hour).toBeLessThan(20);
    expect(new Date(first.deadline).getUTCHours()).toBe(0);
    expect(first.streak).toBe(0);
  });
  it("uses actual local midnight across DST transitions", async () => {
    const result = await db.query<{ hours: number }>(`select extract(epoch from (
      timestamp '2026-09-28 00:00' at time zone 'Pacific/Auckland' -
      timestamp '2026-09-27 00:00' at time zone 'Pacific/Auckland'
    ))::float / 3600 as hours`);
    expect(result.rows[0].hours).toBe(23);
  });
  it("does not count a click without an uploaded video", async () => {
    await openToday();
    await expect(complete(`${user}/${today}/missing.mp4`)).rejects.toThrow("Upload your photo or video first");
    expect((await status()).streak).toBe(0);
  });
  it("accepts one completed upload and makes retries idempotent", async () => {
    await openToday();
    const path = await upload();
    await complete(path);
    await complete(path);
    expect((await status()).streak).toBe(1);
    const result = await db.query<{ count: number }>("select count(*)::int as count from posts");
    expect(result.rows[0].count).toBe(1);
  });
  it("accepts photo proof and records its media type", async () => {
    await openToday();
    const path = await upload("jpg", "image/jpeg");
    await complete(path);
    expect((await status()).streak).toBe(1);
    const posts = await db.query<{ media_type: string; video_path: string }>("select media_type, video_path from posts");
    expect(posts.rows[0]).toEqual({ media_type: "photo", video_path: path });
  });
  it("rejects unsupported media and oversized photos without awarding a streak", async () => {
    await openToday();
    await expect(complete(await upload("svg", "image/svg+xml"))).rejects.toThrow("Unsupported proof format");
    await expect(complete(await upload("jpg", "image/jpeg", 20971521))).rejects.toThrow("Proof exceeds size limit");
    expect((await status()).streak).toBe(0);
  });
  it("rejects before opening and at/after the deadline", async () => {
    const path = await upload();
    await db.query("update dare_days set opens_at = clock_timestamp() + interval '1 hour', deadline = clock_timestamp() + interval '2 hours'");
    await expect(complete(path)).rejects.toThrow("Submission window closed");
    await db.query("update dare_days set opens_at = clock_timestamp() - interval '1 hour', deadline = clock_timestamp()");
    await expect(complete(path)).rejects.toThrow("Submission window closed");
    expect((await status()).streak).toBe(0);
  });
  it("preserves yesterday’s streak, resets across gaps, and restarts at one", async () => {
    await db.query(`insert into dare_days(user_id,day,challenge_id,opens_at,deadline,completed_at)
      select $1, $2::date - offset_days, '33333333-3333-4333-8333-333333333333',
      ($2::date - offset_days)::timestamp at time zone 'UTC',
      ($2::date - offset_days + 1)::timestamp at time zone 'UTC',
      ($2::date - offset_days + time '12:00') at time zone 'UTC'
      from generate_series(1,3) as offset_days`, [user, today]);
    expect((await status()).streak).toBe(3);
    await db.query("update dare_days set completed_at = null where day = $1::date - 1", [today]);
    expect((await status()).streak).toBe(0);
    await openToday();
    await complete(await upload());
    expect((await status()).streak).toBe(1);
  });
  it("does not let another user claim an uploaded video", async () => {
    await openToday();
    const path = `${otherUser}/${today}/proof.mp4`;
    await db.query("insert into storage.objects(bucket_id,name,metadata) values ('daily-proofs',$1,'{\"size\":100}')", [path]);
    await expect(complete(path)).rejects.toThrow("Upload your photo or video first");
  });
  it("blocks direct streak edits and service-only scheduling for authenticated clients", async () => {
    await db.exec("set role authenticated");
    const updated = await db.query("update dare_days set completed_at = now() returning *");
    expect(updated.rows).toHaveLength(0);
    await expect(db.query("select claim_daily_notifications()")).rejects.toThrow("permission denied");
    await expect(db.query("select plan_dare_day($1)", [otherUser])).rejects.toThrow("permission denied");
    expect((await status()).streak).toBe(0);
  });
  it("rejects unauthenticated completion", async () => {
    await db.query("select set_config('request.jwt.claim.sub','',false)");
    await expect(complete("anything")).rejects.toThrow("Sign in required");
  });
});

describe("notification scheduling", () => {
  it("leases only due jobs, retries stale leases, and skips completed/notified days", async () => {
    await db.query("insert into push_subscriptions(endpoint,user_id,p256dh,auth) values ('https://fcm.googleapis.com/test',$1,'key','auth')", [user]);
    await db.query("update dare_days set opens_at = clock_timestamp() + interval '1 hour', deadline = clock_timestamp() + interval '2 hours'");
    expect((await db.query("select * from claim_daily_notifications()")).rows).toHaveLength(0);
    await openToday();
    const first = await db.query<{ lease_token: string }>("select * from claim_daily_notifications()");
    expect(first.rows).toHaveLength(1);
    expect((await db.query("select * from claim_daily_notifications()")).rows).toHaveLength(0);
    await db.query("update dare_days set retry_at = clock_timestamp() - interval '1 second'");
    const retry = await db.query<{ lease_token: string }>("select * from claim_daily_notifications()");
    expect(retry.rows).toHaveLength(1);
    expect(retry.rows[0].lease_token).not.toBe(first.rows[0].lease_token);
    await db.query("update dare_days set notified_at = clock_timestamp(), retry_at = null");
    expect((await db.query("select * from claim_daily_notifications()")).rows).toHaveLength(0);
    await db.query("update dare_days set notified_at = null");
    await complete(await upload());
    expect((await db.query("select * from claim_daily_notifications()")).rows).toHaveLength(0);
  });
});
