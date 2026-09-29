# Daily Dare Setup

## Requirements
- Node.js 20.9+ and npm
- Optional Supabase project for auth, database, and Storage

## Local demo
```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Without Supabase variables, Daily Dare runs in demo mode with seeded content and local interaction state.

## Supabase setup
1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Fill in the project URL and publishable anon key. Never add a service-role key to client environment variables.
4. Run `supabase/migrations/001_daily_dare.sql` in the Supabase SQL editor.
5. Optionally run `supabase/seed.sql` for database demo rows.
6. Create public `videos` and `avatars` buckets, or adapt the policies in the migration to private buckets with signed URLs.
7. Configure email auth in Supabase Authentication.

## Useful commands
```bash
npm run lint
npm run typecheck
npm test
npm run build
```