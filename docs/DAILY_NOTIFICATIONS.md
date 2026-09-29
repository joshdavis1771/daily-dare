# Daily drops and streaks

Each account gets a random daily drop between 09:00 inclusive and 20:00 exclusive in its enrollment timezone. The deadline is the following local midnight, exclusive. The schedule is persisted, so refreshes and multiple devices cannot reroll it. DST uses IANA timezone calendar boundaries rather than adding 24 hours. The timezone is fixed when an account first loads its daily status; travel does not move an existing deadline.

One accepted video submission counts for one day. The upload and completion RPC must finish before midnight. Starting an upload before midnight does not reserve a completion. The database checks the clock after locking the assignment and only accepts a file in that user/day's storage folder. Retries cannot increment twice. A streak includes consecutive completed dates ending today, or yesterday while today is still available. Missing a calendar day resets it to zero even when the app is closed; it is derived from the ledger, not a client counter or a midnight timer.

## Live setup

1. Configure Supabase auth using `.env.example`, apply `001_daily_dare.sql` then `002_daily_notifications.sql`, and ensure the challenges table contains at least one challenge. The scheduler chooses from the full challenge library. The second migration creates the private `daily-proofs` bucket and its storage policies.
2. Set the server-only `SUPABASE_SERVICE_ROLE_KEY`. Generate a persistent VAPID pair with `npx web-push generate-vapid-keys`, then set `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and a real `VAPID_SUBJECT` contact URI. Never expose the private key or service role to the browser.
3. Set a strong `CRON_SECRET`, deploy over HTTPS, and run `GET /api/cron/daily` with `Authorization: Bearer <CRON_SECRET>`. The default `vercel.json` schedule runs once daily on Vercel Hobby so the app can deploy without a paid plan. For minute-level random drops, upgrade the Vercel plan or use another authenticated scheduler. A laptop dev server cannot deliver reliable background alerts.
4. Sign in, visit the home feed to enroll, then press “Notify me when it drops” and grant permission. On iPhone/iPad, first add the app to the Home Screen and launch it there. Turn off daily alerts using the same control.
5. Verify a real notification on a subscribed device with the app closed, open it, upload a video, and verify completion persists across devices. This requires a deployed scheduler, database, and browser permission; local unit tests do not prove delivery.

The browser client uses Supabase SSR cookies so its session is also visible to the existing `/create` middleware. The live status and completion calls use authenticated Supabase RPCs. Push subscription writes validate the current user and known browser push endpoints before using the service role. The push worker uses database leases to prevent overlapping cron runs from claiming the same work, retries transient failures after five minutes, and removes expired subscriptions. Messages expire at the deadline. The browser notification tag replaces a duplicate if a job crashes after delivery but before acknowledgement; delivery is at-least-once, not exactly-once. The worker processes up to 50 due users per run; monitor backlog and increase throughput for a larger audience. OS/browser connectivity can delay delivery, so the drop time is independent of delivery/notification permission.

## Preview and verification

Without Supabase, the home screen runs a clearly labeled device-only demo with a persisted random schedule and completion history. Demo completion requires selecting a valid video, but does not upload or publish that video. Browser notifications are unavailable in demo mode; the UI explains this instead of requesting permission or claiming background timers can deliver them. Existing feed posts remain demo content, and in-browser recording is not yet implemented; use video upload.

Run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`. Database integration tests execute both migrations in embedded PostgreSQL with minimal Supabase auth/storage fixtures. They test server authorization, scheduling, deadline enforcement, idempotency, streak gaps, and notification leasing. Still run the migrations and a push smoke test against a staging Supabase project before release.

References: [MDN Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API), [Apple Web Push](https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers).
