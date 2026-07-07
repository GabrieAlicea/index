# Revvy

Mobile mechanics, on demand. Revvy is a two-sided marketplace connecting vehicle owners
with vetted mobile mechanics who travel to the customer's location.

Full product/architecture documentation lives in [`docs/REVVY_PRD.md`](./docs/REVVY_PRD.md) —
read that first for the database schema, dispatch logic, security model, and phased roadmap.
This README covers local setup only.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · Supabase
(Postgres + PostGIS + Auth + Realtime + Storage) · Framer Motion · Zod · TanStack Query ·
Zustand.

## Prerequisites

- Node.js 20+
- A Supabase project ([supabase.com](https://supabase.com)) with the **PostGIS** extension
  available (enabled automatically by the first migration)
- The [Supabase CLI](https://supabase.com/docs/guides/cli) if you want to run migrations
  locally rather than pasting SQL into the dashboard

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and fill in your Supabase project's credentials:

   ```bash
   cp .env.example .env.local
   ```

3. Apply the database schema. Either paste the contents of
   `supabase/migrations/*.sql` (in order) into the Supabase SQL editor, or, with the
   Supabase CLI linked to your project:

   ```bash
   supabase db push
   ```

4. Seed the service catalog so it matches the frontend (`lib/data/services.ts`):

   ```bash
   supabase db execute -f supabase/seed.sql
   ```

5. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## What's implemented vs. scaffolded

This codebase currently covers **Phase 1 (Foundation)** of the roadmap in the PRD:

- ✅ Full marketing site (SEO-ready, static)
- ✅ Auth (email/password signup + login, role-aware) via Supabase Auth
- ✅ Database schema + RLS policies + security-definer RPCs (`accept_job`, `cancel_job`,
  `approve_mechanic`)
- ✅ Customer, mechanic, and admin dashboards wired to real Supabase queries and Server
  Actions (vehicles, availability, mechanic approvals, etc.)
- ✅ A real end-to-end booking flow (`/book`) that creates a job row in the database
- 🚧 **Not yet implemented** (see `docs/REVVY_PRD.md` §17 for the full roadmap): the
  dispatch wave engine, Stripe Connect payments/payouts, Google Maps
  geocoding/directions/live tracking, Twilio/Resend notifications, and the double-blind
  review reveal job. Booking currently geocodes new addresses to a fixed placeholder point
  (see the comment in `app/(booking)/book/actions.ts`) until Google Maps integration ships.

## Project structure

```
app/            Next.js App Router routes (marketing, auth, booking, dashboards, API)
components/     UI primitives (components/ui), marketing sections, dashboard widgets
lib/            Supabase clients, Zod validation schemas, static catalog/blog data, utils
supabase/       SQL migrations + seed data
types/          Hand-written Database type (regenerate with `supabase gen types typescript`
                once a live project exists)
docs/           Product & architecture documentation
```

## Scripts

- `npm run dev` — start the dev server (Turbopack)
- `npm run build` — production build
- `npm run lint` — ESLint
