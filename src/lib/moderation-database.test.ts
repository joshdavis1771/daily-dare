// @vitest-environment node
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
let db: PGlite;
const a = "11111111-1111-4111-8111-111111111111";
const b = "22222222-2222-4222-8222-222222222222";
const post = "33333333-3333-4333-8333-333333333333";
async function login(id: string) {
  await db.exec("reset role");
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id]);
  await db.exec("set role authenticated");
}
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create schema auth;
    create table auth.users(id uuid primary key, raw_user_meta_data jsonb default '{}');
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;`);
  await db.exec(readFileSync("supabase/migrations/001_daily_dare.sql", "utf8").replace('create extension if not exists "pgcrypto";', ""));
  await db.exec(readFileSync("supabase/migrations/005_reporting_and_blocking.sql", "utf8"));
  await db.exec(`grant usage on schema public,auth to authenticated,anon;
    grant select,insert,update,delete on all tables in schema public to authenticated;
    insert into auth.users(id) values ('${a}'),('${b}');
    insert into challenges(id,title,instructions,category,challenge_date) values ('${post}','Dare','Try','Joy',current_date);
    insert into posts(id,user_id,challenge_id,video_path) values ('${post}','${b}','${post}','test.mp4');
    insert into follows(follower_id,following_id) values ('${a}','${b}'),('${b}','${a}');`);
}, 30000);
afterAll(async () => { await db?.close(); });
describe("moderation database permissions", () => {
  it("keeps reports private and prevents forging moderation status", async () => {
    await login(a);
    await db.query("insert into reports(reporter_id,post_id,reported_user_id,reason) values ($1,$2,$3,'Spam')", [a, post, b]);
    await expect(db.query("insert into reports(reporter_id,reported_user_id,reason,status) values ($1,$2,'Spam','resolved')", [a,b])).rejects.toThrow("row-level security");
    await expect(db.query("insert into reports(reporter_id,reported_user_id,reason) values ($1,$1,'Self')", [a])).rejects.toThrow();
    await login(b);
    expect((await db.query("select * from reports")).rows).toHaveLength(0);
  });
  it("hides content in both directions, removes follows, and rejects interactions", async () => {
    await login(a);
    await db.query("insert into blocks(blocker_id,blocked_id) values ($1,$2)", [a,b]);
    expect((await db.query("select * from posts")).rows).toHaveLength(0);
    expect((await db.query("select * from profiles where id = $1", [b])).rows).toHaveLength(0);
    await expect(db.query("insert into comments(user_id,post_id,body) values ($1,$2,'hello')", [a,post])).rejects.toThrow("row-level security");
    await expect(db.query("insert into likes(user_id,post_id) values ($1,$2)", [a,post])).rejects.toThrow("row-level security");
    await expect(db.query("insert into follows(follower_id,following_id) values ($1,$2)", [a,b])).rejects.toThrow("row-level security");
    await login(b);
    expect((await db.query("select * from profiles where id = $1", [a])).rows).toHaveLength(0);
    expect((await db.query("select * from blocks")).rows).toHaveLength(0);
    await db.exec("reset role");
    expect((await db.query("select * from follows")).rows).toHaveLength(0);
    await login(a);
    await db.query("delete from blocks where blocker_id = $1 and blocked_id = $2", [a,b]);
    expect((await db.query("select * from posts")).rows).toHaveLength(1);
  });
});
