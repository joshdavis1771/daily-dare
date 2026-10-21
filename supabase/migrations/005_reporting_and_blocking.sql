-- Resolve blocks in either direction without exposing another user's block list.
create or replace function public.can_interact_with(p_user_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select not exists (
    select 1 from public.blocks
    where (blocker_id = auth.uid() and blocked_id = p_user_id)
       or (blocked_id = auth.uid() and blocker_id = p_user_id)
  );
$$;
revoke all on function public.can_interact_with(uuid) from public;
grant execute on function public.can_interact_with(uuid) to anon, authenticated;

alter table public.reports add constraint reports_valid_target
  check ((post_id is not null or reported_user_id is not null) and
         (reported_user_id is null or reported_user_id <> reporter_id));
alter table public.reports add constraint reports_valid_reason
  check (length(btrim(reason)) between 1 and 1200);

drop policy "users create reports" on public.reports;
create policy "users create reports" on public.reports for insert to authenticated
with check (
  auth.uid() = reporter_id and status = 'open'
  and (post_id is null or exists (
    select 1 from public.posts where id = post_id and user_id <> auth.uid()
      and (reported_user_id is null or user_id = reported_user_id)
  ))
);

-- A permissive owner policy must not allow profile reads to bypass blocks.
drop policy "public profiles are readable" on public.profiles;
drop policy "users edit own profile" on public.profiles;
create policy "visible profiles are readable" on public.profiles for select
using (public.can_interact_with(id));
create policy "users insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "users delete own profile" on public.profiles for delete using (auth.uid() = id);

drop policy "public posts are readable" on public.posts;
create policy "visible posts are readable" on public.posts for select
using (public.can_interact_with(user_id));
drop policy "public comments are readable" on public.comments;
create policy "visible comments are readable" on public.comments for select using (
  public.can_interact_with(user_id) and exists (select 1 from public.posts where id = post_id)
);
drop policy "users create own comments" on public.comments;
create policy "users create visible comments" on public.comments for insert with check (
  auth.uid() = user_id and exists (select 1 from public.posts where id = post_id and public.can_interact_with(user_id))
);

drop policy "users own likes" on public.likes;
create policy "users create visible likes" on public.likes for insert with check (
  auth.uid() = user_id and exists (select 1 from public.posts where id = post_id and public.can_interact_with(user_id))
);
create policy "users delete own likes" on public.likes for delete using (auth.uid() = user_id);
drop policy "public likes are readable" on public.likes;
create policy "visible likes are readable" on public.likes for select using (
  public.can_interact_with(user_id) and exists (select 1 from public.posts where id = post_id)
);

drop policy "users own follows" on public.follows;
drop policy "public follows are readable" on public.follows;
create policy "visible follows are readable" on public.follows for select
using (public.can_interact_with(follower_id) and public.can_interact_with(following_id));
create policy "users create visible follows" on public.follows for insert with check (
  auth.uid() = follower_id and public.can_interact_with(following_id)
);
create policy "users delete own follows" on public.follows for delete using (auth.uid() = follower_id);

-- Blocking ends existing follow relationships in both directions.
create or replace function public.remove_blocked_follows() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  delete from public.follows
  where (follower_id = new.blocker_id and following_id = new.blocked_id)
     or (follower_id = new.blocked_id and following_id = new.blocker_id);
  return new;
end;
$$;
revoke all on function public.remove_blocked_follows() from public;
create trigger remove_follows_on_block after insert on public.blocks
for each row execute function public.remove_blocked_follows();
delete from public.follows f using public.blocks b
where (f.follower_id = b.blocker_id and f.following_id = b.blocked_id)
   or (f.follower_id = b.blocked_id and f.following_id = b.blocker_id);

drop policy "users edit own comments" on public.comments;
create policy "users edit visible comments" on public.comments for update
using (auth.uid() = user_id) with check (
  auth.uid() = user_id and exists (select 1 from public.posts where id = post_id and public.can_interact_with(user_id))
);

-- Blocks are created or removed, never retargeted with an update.
drop policy "users own blocks" on public.blocks;
create policy "users read own blocks" on public.blocks for select using (auth.uid() = blocker_id);
create policy "users create own blocks" on public.blocks for insert with check (auth.uid() = blocker_id);
create policy "users delete own blocks" on public.blocks for delete using (auth.uid() = blocker_id);
