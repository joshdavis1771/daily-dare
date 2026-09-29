-- Keep video_path / p_video_path for compatibility; both now store photo or video proof paths.
alter table public.posts add column media_type text not null default 'video' check (media_type in ('photo', 'video'));
update storage.buckets set allowed_mime_types = array['image/jpeg','image/png','image/webp','video/mp4','video/webm','video/quicktime']
where id = 'daily-proofs';

create or replace function public.complete_daily_dare(p_date date, p_video_path text, p_caption text) returns void
language plpgsql security definer set search_path = public as $$
declare
  who uuid := auth.uid();
  assignment public.dare_days;
  submitted_at timestamptz;
  proof_mime text;
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
  ) then raise exception 'Upload your photo or video first'; end if;
  select metadata->>'mimetype' into proof_mime from storage.objects
    where bucket_id = 'daily-proofs' and name = p_video_path;
  if proof_mime is null or proof_mime not in ('image/jpeg','image/png','image/webp','video/mp4','video/webm','video/quicktime') then
    raise exception 'Unsupported proof format';
  end if;
  if exists(select 1 from storage.objects where bucket_id = 'daily-proofs' and name = p_video_path
    and (metadata->>'size')::bigint > case when proof_mime like 'image/%' then 20971520 else 83886080 end) then
    raise exception 'Proof exceeds size limit';
  end if;
  insert into public.posts(user_id, challenge_id, video_path, caption, created_at, media_type)
    values (who, assignment.challenge_id, p_video_path, p_caption, submitted_at, case when proof_mime like 'image/%' then 'photo' else 'video' end);
  update public.dare_days set completed_at = submitted_at where user_id = who and day = p_date;
end;
$$;
revoke all on function public.complete_daily_dare(date, text, text) from public, anon;
grant execute on function public.complete_daily_dare(date, text, text) to authenticated;

