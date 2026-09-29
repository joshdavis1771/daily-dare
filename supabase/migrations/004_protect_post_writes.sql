-- Creation must pass complete_daily_dare's assignment, deadline and media checks.
-- Do not allow changing an accepted proof's owner, path or challenge afterward.
-- The security-definer completion function retains its existing write access.
begin;

drop policy "users own posts" on public.posts;

-- Preserve the existing ability to remove one's own post. Completion history
-- remains in dare_days; deleting a post does not award another completion.
create policy "users delete own posts" on public.posts
  for delete to authenticated using (auth.uid() = user_id);

commit;
