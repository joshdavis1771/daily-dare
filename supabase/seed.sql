insert into public.challenges (title, instructions, category, difficulty, challenge_date) values
('Make your ordinary iconic', 'Turn one everyday moment into a 10-second celebration.', 'Joy', 'gentle', current_date),
('Find your five-second groove', 'Add a tiny dance break to something you already do today.', 'Movement', 'steady', current_date),
('Send a little sunshine', 'Send someone a kind message and show us the moment you hit send.', 'People', 'gentle', current_date),
('Make the ordinary delicious', 'Turn a snack, drink, or meal into a tiny ceremony.', 'Ritual', 'bold', current_date),
('Take the scenic route', 'Walk somewhere you usually rush past and show us what you notice.', 'Outside', 'steady', current_date - 1);
insert into public.music_tracks (title, artist, mood, duration_seconds, is_demo) values ('Sunroom', 'Daily Dare Demo', 'warm / acoustic', 18, true), ('Run It Back', 'Daily Dare Demo', 'bright / bounce', 15, true), ('Blue Hour', 'Daily Dare Demo', 'soft / late night', 20, true);
