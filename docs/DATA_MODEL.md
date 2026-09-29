# Daily Dare Data Model

## Core tables
- `profiles`: one row per auth user; username, display name, bio, avatar path.
- `challenges`: challenge pool with title, instructions, category, difficulty, and date; multiple rows can share a date.
- `daily_challenge_assignments`: stable user/date assignment to one challenge, created through the authorized database function.
- `posts`: one proof video per user/challenge, caption, media path, music metadata, counts.
- `likes`: unique user/post action.
- `comments`: user-authored post comments.
- `follows`: follower/following graph.
- `reports`: reporter, target post/user, reason, status.
- `blocks`: blocker and blocked user pair.
- `music_tracks`: demo/royalty-free track metadata; mixing status remains server-side work.

## Invariants
- `posts (user_id, challenge_id)` is unique.
- Each user has at most one `daily_challenge_assignments` row per date; different users are assigned from the same-day challenge pool.
- Users may insert/update/delete only their own profile, posts, likes, comments, follows, reports, and blocks.
- Public read access is limited to public profiles, challenges, posts, comments, and music metadata.
- Storage object ownership is derived from the first path segment matching `auth.uid()`.
