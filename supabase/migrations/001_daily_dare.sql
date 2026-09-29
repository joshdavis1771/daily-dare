create extension if not exists "pgcrypto";

create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, username text unique not null, display_name text not null, bio text not null default '', avatar_path text, created_at timestamptz not null default now());
create table public.challenges (id uuid primary key default gen_random_uuid(), title text not null, instructions text not null, category text not null, difficulty text, challenge_date date not null);
create table public.daily_challenge_assignments (user_id uuid not null references public.profiles(id) on delete cascade, challenge_date date not null, challenge_id uuid not null references public.challenges(id) on delete cascade, assigned_at timestamptz not null default now(), primary key(user_id, challenge_date));
create table public.music_tracks (id uuid primary key default gen_random_uuid(), title text not null, artist text not null, mood text, duration_seconds integer not null default 15, is_demo boolean not null default true);
create table public.posts (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, challenge_id uuid not null references public.challenges(id), video_path text not null, poster_path text, caption varchar(180) not null default '', music_track_id uuid references public.music_tracks(id), created_at timestamptz not null default now(), unique(user_id, challenge_id));
create table public.likes (user_id uuid references public.profiles(id) on delete cascade, post_id uuid references public.posts(id) on delete cascade, created_at timestamptz not null default now(), primary key(user_id, post_id));
create table public.comments (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, post_id uuid not null references public.posts(id) on delete cascade, body varchar(300) not null, created_at timestamptz not null default now());
create table public.follows (follower_id uuid references public.profiles(id) on delete cascade, following_id uuid references public.profiles(id) on delete cascade, created_at timestamptz not null default now(), primary key(follower_id, following_id), check(follower_id <> following_id));
create table public.reports (id uuid primary key default gen_random_uuid(), reporter_id uuid not null references public.profiles(id) on delete cascade, post_id uuid references public.posts(id) on delete cascade, reported_user_id uuid references public.profiles(id) on delete cascade, reason text not null, status text not null default 'open', created_at timestamptz not null default now());
create table public.blocks (blocker_id uuid references public.profiles(id) on delete cascade, blocked_id uuid references public.profiles(id) on delete cascade, created_at timestamptz not null default now(), primary key(blocker_id, blocked_id), check(blocker_id <> blocked_id));

alter table public.profiles enable row level security;
alter table public.challenges enable row level security;
alter table public.daily_challenge_assignments enable row level security;
alter table public.music_tracks enable row level security;
alter table public.posts enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;
alter table public.follows enable row level security;
alter table public.reports enable row level security;
alter table public.blocks enable row level security;

create policy "public profiles are readable" on public.profiles for select using (true);
create policy "users edit own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "public challenges are readable" on public.challenges for select using (true);
create policy "users read own challenge assignments" on public.daily_challenge_assignments for select using (auth.uid() = user_id);
create policy "public tracks are readable" on public.music_tracks for select using (true);
create policy "public posts are readable" on public.posts for select using (true);
create policy "users own posts" on public.posts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "public comments are readable" on public.comments for select using (true);
create policy "users create own comments" on public.comments for insert with check (auth.uid() = user_id);
create policy "users edit own comments" on public.comments for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users delete own comments" on public.comments for delete using (auth.uid() = user_id);
create policy "public likes are readable" on public.likes for select using (true);
create policy "users own likes" on public.likes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "public follows are readable" on public.follows for select using (true);
create policy "users own follows" on public.follows for all using (auth.uid() = follower_id) with check (auth.uid() = follower_id);
create policy "users create reports" on public.reports for insert with check (auth.uid() = reporter_id);
create policy "users read own reports" on public.reports for select using (auth.uid() = reporter_id);
create policy "users own blocks" on public.blocks for all using (auth.uid() = blocker_id) with check (auth.uid() = blocker_id);

create or replace function public.get_or_assign_daily_challenge(p_user_id uuid, p_date date default current_date) returns uuid language plpgsql security definer set search_path = public as $$
declare assigned_challenge uuid;
begin
	if auth.uid() is null or auth.uid() <> p_user_id then raise exception 'not authorized'; end if;
	select challenge_id into assigned_challenge from public.daily_challenge_assignments where user_id = p_user_id and challenge_date = p_date;
	if assigned_challenge is null then
		select id into assigned_challenge from public.challenges where challenge_date = p_date order by md5(id::text || p_user_id::text) limit 1;
		if assigned_challenge is null then raise exception 'no challenge available for date'; end if;
		insert into public.daily_challenge_assignments(user_id, challenge_date, challenge_id) values (p_user_id, p_date, assigned_challenge) on conflict (user_id, challenge_date) do nothing;
		select challenge_id into assigned_challenge from public.daily_challenge_assignments where user_id = p_user_id and challenge_date = p_date;
	end if;
	return assigned_challenge;
end; $$;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.profiles(id, username, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'username', 'dare-' || left(new.id::text, 6)), coalesce(new.raw_user_meta_data->>'display_name', 'Daily Dare member')); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
