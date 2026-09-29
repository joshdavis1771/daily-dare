# Daily Dare Product Spec

## MVP goal
Daily Dare turns one daily challenge into a small, social proof-of-progress ritual. A member can see today's dare, record or upload a short vertical proof video, publish it with a caption, and discover other creators through a chronological reels feed.

## Primary flows
- Demo visitor opens the feed, explores today's challenge, searches seeded creators, and views profiles without Supabase credentials.
- Authenticated member signs up or signs in with email, receives a profile, records/uploads one video for today's dare, previews and publishes it, then likes/comments/follows.
- A member can browse the challenge archive, edit their profile, report/block content, and read community guidelines.

## MVP scope
- Mobile-first Next.js App Router UI with responsive desktop layout.
- Demo repository with realistic users, challenges, posts, comments, hashtags, follows, and music metadata.
- Supabase-ready auth, PostgreSQL schema/RLS, and Storage path conventions.
- Browser MediaRecorder capture plus short-video upload validation.
- Chronological full-height feed with visibility-based autoplay and mute controls.

## Implementation plan
1. Scaffold the Next.js/Tailwind TypeScript application and establish shared domain types, demo data, and repository boundaries.
2. Build the public shell: feed, challenge, archive, search, profiles, guidelines, and responsive navigation.
3. Add post creation: camera capture, upload fallback, preview/retake, caption parsing, music selection, and validation.
4. Add social interactions and client-side demo state, then wire Supabase clients and SQL migrations for production persistence.
5. Add focused tests, documentation, lint/type/build verification, and record exact results.

## Out of scope for MVP
- Ranking/recommendation algorithms, DMs, notifications, moderation queues, licensed music, and server-side video transcoding.
