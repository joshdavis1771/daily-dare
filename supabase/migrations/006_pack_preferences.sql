-- Seed onboarding pack challenges so every selection has eligible dares.
insert into public.challenges(id,title,instructions,category,difficulty,challenge_date) values
('00600000-0000-4000-8000-000000000001','A one-song stretch','Put on a favourite song and gently stretch in a way that feels comfortable. Share a photo of your setup or a short clip.','fitness','gentle',current_date),
('00600000-0000-4000-8000-000000000002','Take the scenic route','Take a five-minute walk or roll somewhere accessible. Capture one detail you normally miss.','fitness','steady',current_date),
('00600000-0000-4000-8000-000000000003','Make your own mini routine','Combine three comfortable movements into a short routine. Move at your own pace and stop if anything hurts.','fitness','bold',current_date),
('00600000-0000-4000-8000-000000000004','Find your colour','Find three everyday things in your favourite colour. Arrange them and take a photo.','creativity','gentle',current_date),
('00600000-0000-4000-8000-000000000005','The 60-second sketch','Draw the nearest object without lifting your pen. Celebrate the wobbly lines.','creativity','steady',current_date),
('00600000-0000-4000-8000-000000000006','Tell a tiny story','Make a three-frame photo story using objects you already own. Give it a surprising title.','creativity','bold',current_date),
('00600000-0000-4000-8000-000000000007','Give yourself some credit','Write down one thing you handled well this week. Keep private details out of your photo.','confidence','gentle',current_date),
('00600000-0000-4000-8000-000000000008','Try a new combination','Style an outfit using something you rarely wear. Take a photo just for yourself or your group.','confidence','steady',current_date),
('00600000-0000-4000-8000-000000000009','Your tiny victory speech','Record a short celebration of something you learned. You choose who, if anyone, gets to see it.','confidence','bold',current_date),
('00600000-0000-4000-8000-000000000010','A note worth keeping','Write your partner a kind note about an everyday thing you appreciate. Share only what you both want to share.','couples','gentle',current_date),
('00600000-0000-4000-8000-000000000011','Trade favourite songs','Each choose a favourite song, listen together, and explain what you love about it.','couples','steady',current_date),
('00600000-0000-4000-8000-000000000012','Invent your next date','Together, plan a free mini date using three things you already have. Both of you get a veto.','couples','bold',current_date),
('00600000-0000-4000-8000-000000000013','A quiet reset','Take two minutes to notice what you need next.','wellbeing','gentle',current_date),
('00600000-0000-4000-8000-000000000014','Look up','Find one detail above eye level and remember it.','outdoors','gentle',current_date),
('00600000-0000-4000-8000-000000000015','A mindful bite','Slow down for one bite and notice its texture and flavour.','food','gentle',current_date),
('00600000-0000-4000-8000-000000000016','Ask why','Write down one question and spend five minutes exploring it.','learning','gentle',current_date),
('00600000-0000-4000-8000-000000000017','Send warmth','Send a thoughtful message with no request attached.','connection','gentle',current_date),
('00600000-0000-4000-8000-000000000018','One small corner','Make one small corner more welcoming for tomorrow.','home','gentle',current_date)
on conflict (id) do nothing;

-- Signup stores the three confirmed pack IDs in auth user metadata.
-- Existing accounts without preferences retain their current challenge library.
create or replace function public.plan_dare_day(p_user uuid) returns void
language plpgsql security definer set search_path = public as $$
declare
  zone text;
  today date;
  chosen uuid;
  packs jsonb;
begin
  select timezone into zone from public.daily_preferences where user_id = p_user;
  if zone is null then return; end if;
  today := (clock_timestamp() at time zone zone)::date;
  if exists(select 1 from public.dare_days where user_id = p_user and day = today) then return; end if;
  select raw_user_meta_data->'selected_packs' into packs from auth.users where id = p_user;
  if packs is not null then
    if jsonb_typeof(packs) <> 'array' then raise exception 'Choose exactly three packs'; end if;
    if jsonb_array_length(packs) <> 3 or
       (select count(distinct value) from jsonb_array_elements_text(packs)) <> 3 or
       exists(select 1 from jsonb_array_elements_text(packs) as p(value)
         where value not in ('fitness','creativity','confidence','couples','wellbeing','outdoors','food','learning','connection','home'))
    then raise exception 'Choose exactly three valid packs'; end if;
  end if;
  select id into chosen from public.challenges
    where packs is null or category in (select jsonb_array_elements_text(packs))
    order by random() limit 1;
  if chosen is null then raise exception 'No challenges available'; end if;
  insert into public.dare_days(user_id, day, challenge_id, opens_at, deadline)
  values (p_user, today, chosen,
    (today + time '09:00' + (floor(random() * 660)::int * interval '1 minute')) at time zone zone,
    (today + 1)::timestamp at time zone zone)
  on conflict (user_id, day) do nothing;
end;
$$;
