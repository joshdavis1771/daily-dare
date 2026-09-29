-- Apply after 001. All timestamps and completion checks are server-authoritative.
create table public.daily_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  timezone text not null,
  created_at timestamptz not null default now()
);
create table public.dare_days (
  user_id uuid not null references public.profiles(id) on delete cascade,
  day date not null,
  challenge_id uuid not null references public.challenges(id),
  opens_at timestamptz not null,
  deadline timestamptz not null,
  completed_at timestamptz,
  notified_at timestamptz,
  retry_at timestamptz,
  lease_token uuid,
  primary key(user_id, day),
  check (opens_at < deadline),
  check (completed_at is null or (completed_at >= opens_at and completed_at < deadline))
);
create index dare_days_pending on public.dare_days(opens_at) where notified_at is null and completed_at is null;
create table public.push_subscriptions (
  endpoint text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);
create index push_subscriptions_user on public.push_subscriptions(user_id);
alter table public.daily_preferences enable row level security;
alter table public.dare_days enable row level security;
alter table public.push_subscriptions enable row level security;
create policy "read own preferences" on public.daily_preferences for select to authenticated using (user_id = auth.uid());
create policy "read own dare days" on public.dare_days for select to authenticated using (user_id = auth.uid());
-- Subscriptions are managed only by the authenticated API, never directly by clients.

create function public.plan_dare_day(p_user uuid) returns void
language plpgsql security definer set search_path = public as $$
declare
  zone text;
  today date;
  chosen uuid;
begin
  select timezone into zone from public.daily_preferences where user_id = p_user;
  if zone is null then return; end if;
  today := (clock_timestamp() at time zone zone)::date;
  if exists(select 1 from public.dare_days where user_id = p_user and day = today) then return; end if;
  -- Reuse the challenge library across dates; a day has exactly one stable assignment.
  select id into chosen from public.challenges order by random() limit 1;
  if chosen is null then raise exception 'No challenges available'; end if;
  insert into public.dare_days(user_id, day, challenge_id, opens_at, deadline)
  values (p_user, today, chosen,
    (today + time '09:00' + (floor(random() * 660)::int * interval '1 minute')) at time zone zone,
    (today + 1)::timestamp at time zone zone)
  on conflict (user_id, day) do nothing;
end;
$$;
revoke all on function public.plan_dare_day(uuid) from public, anon, authenticated;
grant execute on function public.plan_dare_day(uuid) to service_role;

create function public.daily_status(p_timezone text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  who uuid := auth.uid();
  zone text;
  today date;
  cursor_day date;
  count_days int := 0;
  result jsonb;
begin
  if who is null then raise exception 'Sign in required'; end if;
  if not exists(select 1 from pg_timezone_names where name = p_timezone) then raise exception 'Invalid timezone'; end if;
  -- Fix the account timezone on enrollment so travel/clock edits cannot extend a deadline.
  insert into public.daily_preferences(user_id, timezone) values (who, p_timezone) on conflict do nothing;
  select timezone into zone from public.daily_preferences where user_id = who;
  perform public.plan_dare_day(who);
  today := (clock_timestamp() at time zone zone)::date;
  cursor_day := today;
  if not exists(select 1 from public.dare_days where user_id = who and day = today and completed_at is not null) then cursor_day := today - 1; end if;
  while exists(select 1 from public.dare_days where user_id = who and day = cursor_day and completed_at is not null) loop
    count_days := count_days + 1;
    cursor_day := cursor_day - 1;
  end loop;
  select jsonb_build_object('date', d.day, 'opensAt', d.opens_at, 'deadline', d.deadline,
    'completedAt', d.completed_at, 'streak', count_days, 'timezone', zone,
    'challenge', jsonb_build_object('id', c.id, 'title', c.title, 'instructions', c.instructions)) into result
  from public.dare_days d join public.challenges c on c.id = d.challenge_id where d.user_id = who and d.day = today;
  return result;
end;
$$;
revoke all on function public.daily_status(text) from public, anon;
grant execute on function public.daily_status(text) to authenticated;

-- A dedicated bucket avoids modifying an existing app's storage policies.
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('daily-proofs', 'daily-proofs', false, 83886080, array['video/mp4', 'video/webm', 'video/quicktime']) on conflict do nothing;
create policy "upload own daily proof" on storage.objects for insert to authenticated with check (
  bucket_id = 'daily-proofs' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy "read own daily proof" on storage.objects for select to authenticated using (
  bucket_id = 'daily-proofs' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy "remove own unused daily proof" on storage.objects for delete to authenticated using (
  bucket_id = 'daily-proofs' and (storage.foldername(name))[1] = auth.uid()::text
  and not exists(select 1 from public.posts p where p.video_path = name and p.user_id = auth.uid())
);
-- The same challenge can recur on different days. dare_days is the per-day uniqueness guard.
alter table public.posts drop constraint posts_user_id_challenge_id_key;

create function public.complete_daily_dare(p_date date, p_video_path text, p_caption text) returns void
language plpgsql security definer set search_path = public as $$
declare
  who uuid := auth.uid();
  assignment public.dare_days;
  submitted_at timestamptz;
begin
  if who is null then raise exception 'Sign in required'; end if;
  select * into assignment from public.dare_days where user_id = who and day = p_date for update;
  if not found then raise exception 'No daily assignment'; end if;
  if assignment.completed_at is not null then return; end if; -- Idempotent retry.
  submitted_at := clock_timestamp();
  if submitted_at < assignment.opens_at or submitted_at >= assignment.deadline then raise exception 'Submission window closed'; end if;
  if length(p_caption) > 180 or p_caption is null then raise exception 'Invalid caption'; end if;
  if p_video_path not like who::text || '/' || p_date::text || '/%' or not exists (
    select 1 from storage.objects where bucket_id = 'daily-proofs' and name = p_video_path
      and (metadata->>'size')::bigint > 0
  ) then raise exception 'Upload your video first'; end if;
  insert into public.posts(user_id, challenge_id, video_path, caption, created_at)
    values (who, assignment.challenge_id, p_video_path, p_caption, submitted_at);
  update public.dare_days set completed_at = submitted_at where user_id = who and day = p_date;
end;
$$;
revoke all on function public.complete_daily_dare(date, text, text) from public, anon;
grant execute on function public.complete_daily_dare(date, text, text) to authenticated;

create function public.claim_daily_notifications() returns setof public.dare_days
language plpgsql security definer set search_path = public as $$
declare person record;
begin
  for person in select user_id from public.daily_preferences loop
    perform public.plan_dare_day(person.user_id);
  end loop;
  return query
    with due as (
      select d.user_id, d.day from public.dare_days d
      where d.opens_at <= clock_timestamp() and d.deadline > clock_timestamp()
        and d.completed_at is null and d.notified_at is null
        and (d.retry_at is null or d.retry_at <= clock_timestamp())
        and exists(select 1 from public.push_subscriptions s where s.user_id = d.user_id)
      order by d.opens_at limit 50 for update skip locked
    )
    update public.dare_days d set retry_at = clock_timestamp() + interval '5 minutes', lease_token = gen_random_uuid()
    from due where d.user_id = due.user_id and d.day = due.day returning d.*;
end;
$$;
revoke all on function public.claim_daily_notifications() from public, anon, authenticated;
grant execute on function public.claim_daily_notifications() to service_role;
