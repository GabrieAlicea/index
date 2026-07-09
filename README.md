# Revvy

Mobile mechanics, on demand. Revvy is a two-sided marketplace connecting vehicle owners
with vetted mobile mechanics who travel to the customer's location.

Full product/architecture documentation lives in [`docs/REVVY_PRD.md`](./docs/REVVY_PRD.md) —
read that first for the database schema, dispatch logic, security model, and phased roadmap.
This README covers local setup only.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · Supabase
(Postgres + PostGIS + Auth + Realtime + Storage) · Framer Motion · Zod · Leaflet +
OpenStreetMap (maps/geocoding) · Resend (email) · Stripe (payments, partial).

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

This codebase currently covers **Phase 1 (Foundation)** of the roadmap in the PRD, plus a
few Phase 2 pieces pulled forward:

- ✅ Full marketing site (SEO-ready, static)
- ✅ Auth (email/password signup + login, role-aware) via Supabase Auth
- ✅ Database schema + RLS policies + security-definer RPCs (`accept_job`, `cancel_job`,
  `approve_mechanic`), deployed to a live Supabase project
- ✅ Customer, mechanic, and admin dashboards wired to real Supabase queries and Server
  Actions (vehicles, availability, mechanic approvals, etc.)
- ✅ A real end-to-end booking flow (`/book`) that creates a job row in the database
- ✅ **Geocoding & maps** — addresses are geocoded via OpenStreetMap's free Nominatim API
  (`lib/maps/geocode.ts`), and job/tracking pages render a real Leaflet + OSM map
  (`components/maps/`). No API key required. Nominatim's unauthenticated tier caps at
  ~1 request/second — fine at launch scale, revisit if volume grows.
- ✅ **Transactional email** via Resend — booking confirmations and mechanic
  approval/rejection decisions (`lib/notifications/email.ts`). Sends from Resend's shared
  `onboarding@resend.dev` sender until you verify your own domain in the Resend dashboard.
- ✅ **Stripe payments & Connect payouts** — the booking wizard collects a real card via
  Stripe Elements and authorizes (not captures) a manual-capture PaymentIntent
  (`app/(booking)/book/payment-actions.ts`). Mechanics connect a Stripe Express account
  for payouts (`/dashboard/mechanic/payouts`, `app/dashboard/mechanic/payouts/actions.ts`).
  Since there's no automatic dispatch yet, any approved mechanic can claim an open
  `searching` job (`/dashboard/mechanic/jobs`) and mark it complete
  (`app/dashboard/mechanic/jobs/actions.ts`), which captures the PaymentIntent and creates
  a Stripe Transfer to the mechanic's connected account for the payout amount (total minus
  the 10% platform fee). A webhook route (`app/api/webhooks/stripe/route.ts`) keeps
  `payments`/`mechanic_profiles` in sync with Stripe's async events once
  `STRIPE_WEBHOOK_SECRET` is set (needs a public URL registered in the Stripe dashboard,
  so this only activates after deploying).
  **Whatever keys are in `.env.local` are what's live** — check whether they're
  `pk_test_`/`sk_test_` or `pk_live_`/`sk_live_` before testing the booking flow, since live
  keys really charge real cards.
- 🚧 **Not yet implemented** (see `docs/REVVY_PRD.md` §17 for the full roadmap): the
  automatic dispatch wave engine (matching a job to the *nearest* mechanic instead of
  first-to-claim), Twilio SMS notifications, and the double-blind review reveal job.

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
