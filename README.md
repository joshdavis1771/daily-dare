# Daily Dare

Daily Dare is a mobile-first social challenge app: one daily prompt, one photo or short proof video, and a feed of people showing up together.

## What is included

- Demo-first chronological vertical video feed with visibility-based autoplay and mute controls.
- Daily challenge banner, archive, search, profile grid, community guidelines, and auth entry point.
- Photo/video upload flow with native mobile capture, preview, replacement, and caption limits. Photos: JPG/PNG/WebP up to 20 MB. Videos: MP4/WebM/MOV up to 80 MB.
- Supabase-ready browser client, SSR auth middleware, PostgreSQL schema, RLS policies, seed data, and Storage path conventions.
- Like state, follow affordance, comments model, report/block model, and focused Vitest coverage.

## Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. The app runs with seeded demo data without Supabase credentials. To enable email magic-link auth, copy `.env.example` to `.env.local` and add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Use on iPhone and Android

Deploy the app to an HTTPS host before installing it on a phone. On iPhone, open the site in Safari, tap Share, then choose **Add to Home Screen**. On Android, open the site in Chrome and choose **Install app** or **Add to Home screen**. The app includes a responsive mobile layout, web manifest, service worker, offline fallback, and iPhone standalone metadata.

For database setup, run migrations `001_daily_dare.sql`, `002_daily_notifications.sql`, and `003_photo_proofs.sql` in `supabase/migrations/` in order and optionally `supabase/seed.sql` in Supabase. Configure `videos` and `avatars` Storage buckets and email authentication in the Supabase dashboard. Never expose `SUPABASE_SERVICE_ROLE_KEY` to client code.

## Commands

```bash
npm run dev       # local development
npm run lint      # ESLint
npm run typecheck # strict TypeScript
npm test          # focused Vitest suite
npm run build     # production build
```

## Project structure

```text
src/app/          App Router pages
src/components/   Reusable product UI
src/lib/          Types, demo data, validation, repositories, Supabase client
supabase/         SQL migration and seed data
docs/             Product, architecture, setup, data, testing, and implementation notes
```

## Known limitations

- Demo mode keeps interactions in memory; Supabase repository mutations are the next persistence step.
- Capture uses the native camera on supported phones and falls back to a file picker on desktop. In-browser desktop recording is not implemented.
- Audio mixing is not implemented. Secure server-side FFmpeg processing, licensing, moderation review, transcoding, signed media URLs, and abuse controls are required before public launch.
- Demo avatars and video posters use remote placeholder assets and are intentionally not production media.
