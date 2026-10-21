# Implementation Log

## Phase 0: foundation
- Scaffolded Next.js App Router with TypeScript, Tailwind CSS, ESLint, and strict mode.
- Added required product, architecture, setup, data-model, and testing documentation.
- Added environment template with no credentials.

## Phase 1: application shell
- Added typed domain models, realistic demo users/challenges/posts, validation helpers, and a demo repository seam.
- Added responsive shell, daily challenge banner, chronological snap feed, archive, search, profile grid, guidelines, and auth page.

## Phase 2: creation and social interactions
- Added vertical preview/upload flow with MIME/size validation, caption remaining count, hashtag/mention parsing, retake state, and demo music metadata selection.
- Added local like state, follow affordance, comments/report/block data model, and profile editing/follow UI affordance.

## Phase 3: persistence and verification
- Added Supabase browser client, SSR auth middleware for `/create`, PostgreSQL migration with profile trigger and RLS policies, seed data, and environment template.
- Added focused Vitest tests and completed lint, typecheck, test, and production build verification.

## Phase 4: per-user daily challenges
- Replaced the single global daily challenge with a same-day challenge pool and stable user/date assignment helper.
- Added persisted Supabase assignments plus an authorized `get_or_assign_daily_challenge` function and distinct demo-user assignments.

## Reporting and blocking

- Added report reasons, optional details, private submissions, and explicit block confirmation on posts, profiles, and message threads. Comment authors also have safety controls.
- Demo reports and blocks persist on the device. Demo report confirmation explicitly states that reports are not sent to moderators. Blocking filters the feed, discovery, comments, conversations, share recipients, shared previews, and notifications; blocked profile URLs show an unblock control. Settings lists blocked accounts.
- UUID targets use authenticated Supabase inserts/deletes; the existing social repository still uses demo profiles/posts. Live social data integration and a moderator review interface remain separate work.
- Apply `005_reporting_and_blocking.sql` to enforce bilateral visibility and interaction restrictions, remove follows when blocking, and validate private report submissions. The migration does not change public media storage access or add a direct-message database.
- Added persistence/error tests and PostgreSQL RLS tests for private reports, bilateral blocks, rejected interactions, and unblocking.
