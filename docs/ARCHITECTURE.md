# Daily Dare Architecture

## Application layers
- `src/app`: App Router routes and page composition.
- `src/components`: reusable visual and interaction components.
- `src/features`: feature-owned UI and domain helpers.
- `src/lib`: types, demo data, validation, and repository adapters.
- `supabase/migrations`: PostgreSQL schema and Row Level Security policies.
- `supabase/seed.sql`: optional local/demo database seed.

UI components use typed repository interfaces rather than embedding database calls. Demo mode is the default when Supabase environment variables are absent; the same interfaces can be replaced with Supabase-backed implementations.

## Supabase boundaries
- Browser auth uses the publishable anon key only.
- `src/middleware.ts` uses `@supabase/ssr` request cookies to refresh sessions and protects `/create` whenever Supabase is configured.
- Service-role credentials must remain server-only and are never included in client bundles.
- Storage buckets: `videos` and `avatars`, with paths scoped by user id (`{user_id}/{post_id}.webm` and `{user_id}/avatar-{timestamp}.webp`).

## Media
The browser uses `MediaRecorder` for vertical capture and object URLs for local preview. Uploads are validated by MIME type and size before Storage upload. Selecting a demo music track stores its metadata with the post and communicates the intended soundtrack; actual audio-video mixing requires a secure server-side media-processing job, such as FFmpeg in a worker, before public launch. This MVP does not claim licensed music integration or perform mixing in the browser.

## Feed and visibility
The feed is chronological now, with an explicit repository seam for a later ranking query. `IntersectionObserver` controls video playback when a card is primarily visible. Video elements are muted by default for autoplay policy compliance and expose a keyboard-accessible mute toggle.

## Safety
Reports and blocks are modeled in SQL and exposed as basic controls in the UI. Before launch, add moderation review tooling, automated media/content screening, abuse rate limits, retention policies, audit logs, and verified media-processing isolation.
