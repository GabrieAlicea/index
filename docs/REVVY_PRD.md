# Revvy — Product & Architecture Document
### "Mechanics that come to you." — The Uber for Mobile Mechanics

Status: **Pre-implementation architecture — awaiting approval.** No application code has been written yet, per the project brief ("architect first, code second").

---

## 1. Executive Summary

Revvy is a two-sided, on-demand marketplace connecting vehicle owners with vetted, insured mobile mechanics who travel to the customer's location to perform repairs, maintenance, diagnostics, mobile electronics installs, and roadside assistance. The platform launches in Florida with an architecture designed for nationwide, multi-region expansion from day one.

**Core mechanics:**
- Three-sided system: **Customer app**, **Mechanic app**, **Admin/Ops console** — all served from one Next.js codebase with role-gated route groups.
- **Supabase** (Postgres + PostGIS + Auth + Realtime + Storage) as the system of record and real-time backbone.
- **Stripe Connect (Standard/Express)** for marketplace payments — customer charged up front (or on completion), platform takes a 10% commission, mechanic receives the remainder via automated payout.
- **Google Maps Platform** (Places, Directions, Geocoding, Maps JS/Android/iOS SDKs) for address entry, ETA, routing, and live tracking.
- **Twilio** for SMS (dispatch alerts, OTP, arrival notifications) and **Resend** for transactional email.
- Dispatch is a **broadcast-and-claim model** (same family as Uber/DoorDash): nearby eligible mechanics are notified in expanding radius waves; first to accept atomically wins the job via a guarded database transaction.

**Why this stack:** every piece is chosen to let a small team ship a production-grade two-sided marketplace without operating undifferentiated infrastructure (no custom message queue, no self-hosted Postgres, no custom auth). Supabase gives us Postgres + Row-Level Security + Realtime + Auth + Storage as one coherent, SQL-native platform, which matters enormously for a marketplace where "who can see/write which row" (customer vs. mechanic vs. admin) is the single hardest security problem. Next.js on Vercel gives us edge delivery, ISR for the SEO-critical marketing site, and one deployment story for both the public site and the authenticated apps.

---

## 2. Product Requirements Document

### 2.1 Problem Statement
Vehicle owners lose hours and leverage by driving to a shop and waiting; shops carry high fixed overhead (rent, lifts) that gets passed to the customer. A large share of common repairs (fluids, brakes, batteries, diagnostics, electronics installs, roadside issues) do not require a lift or a bay — they can be done in a driveway or parking lot. Independent mechanics want more jobs and predictable payouts but lack a trusted acquisition channel, scheduling, routing, and payments infrastructure.

### 2.2 Solution
A marketplace that supplies **demand generation, trust & vetting, dispatch, navigation, payments, and reputation** so customers get shop-quality repair at their location, and mechanics get a steady stream of jobs without running a shop.

### 2.3 Goals (V1 / Florida launch)
1. Customer can request a service ASAP or schedule it, see an upfront estimate, and pay in-app.
2. A background-checked, insured mechanic is dispatched automatically based on proximity, availability, and service capability.
3. Customer can track the mechanic live from acceptance to arrival.
4. Mechanic can run their entire workday (availability, jobs, navigation, photos, payouts) from one dashboard.
5. Platform takes 10% commission automatically via Stripe Connect; mechanics are paid out without manual intervention.
6. Admin can see every job on a live map, approve/reject mechanics, manage disputes, and view revenue in real time.

### 2.4 Non-Goals (V1)
- Native iOS/Android apps (V1 ships as a responsive, installable PWA; native wraps come post-launch — see Roadmap).
- Multi-mechanic "shop" accounts with employees (V1 is single mechanic = single account).
- Parts inventory/warehousing (mechanics source their own parts; "Custom Repair" flow handles parts-heavy jobs via quote).
- International/multi-currency support.
- Surge pricing (flagged as a fast-follow, not V1).

### 2.5 Success Metrics
- **Marketplace liquidity:** median time-to-accept under 4 minutes in covered ZIP codes.
- **Conversion:** estimate-to-booked-job rate, target >35%.
- **Trust:** average two-sided rating ≥ 4.7, dispute rate < 2% of completed jobs.
- **Unit economics:** take rate 10% net of Stripe fees; contribution margin positive per job at launch pricing.
- **Core Web Vitals:** LCP < 2.5s, INP < 200ms, CLS < 0.1 on marketing pages (SEO + conversion dependent on this).

### 2.6 Key Assumptions (flagged, not invented as business rules)
These are engineering assumptions made to keep the architecture concrete. They should be confirmed by product/legal before Phase 2:
- Background checks and insurance verification are performed by a third-party vendor (e.g., Checkr) integrated at mechanic onboarding; until that integration is scoped, the flow supports **manual document review by admin ops**.
- Pricing is **hybrid**: catalog services (oil change, brakes, battery, etc.) have platform-set base pricing mechanics opt into; "Custom Repair" and complex jobs go through a **quote flow** (mechanic or admin sends a quote, customer approves before dispatch/charge).
- Parts cost is included in catalog service pricing at a standard tier; custom/quote jobs itemize parts separately.
- Payout cadence follows Stripe Connect's standard rolling payout schedule (T+2 business days), configurable per mechanic later (instant payout as a paid feature is a roadmap item).
- Launch metros: Tampa, Orlando, Miami–Fort Lauderdale (highest mobile-mechanic search volume in FL); architecture treats "service area" as a data-driven polygon/radius, not a hardcoded list, so adding a metro is a config change, not a code change.

---

## 3. User Personas

**1. Alex — The Busy Customer.** 34, suburban Tampa, two cars, works 50+ hrs/week. Wants: never take a car to a shop again, transparent price before booking, trust that the mechanic is legitimate, live ETA like a rideshare.

**2. Mark — The Independent Mechanic.** 38, ASE-certified, owns a service van, previously worked at a dealership. Wants: consistent job flow without paying for his own marketing, fast payouts, control over his schedule/service radius, low platform friction (fast onboarding, simple navigation to jobs).

**3. Priya — The Fleet Manager (future-ready persona).** Manages 12 delivery vans for a local business. Wants: priority scheduling, consolidated invoicing, maintenance plans — informs the "For Fleets" section even though fleet accounts are a V2 feature.

**4. Dana — The Ops/Admin Specialist.** Works for Revvy. Approves mechanics, resolves disputes, watches the live jobs map for coverage gaps, monitors revenue and refunds.

---

## 4. User Flows

### 4.1 Customer — Book a Service (ASAP)
1. Land on marketing home → "Book a Service" or "ASAP Service" CTA.
2. Auth gate: sign up / log in (email+password, Google OAuth, or phone OTP) if not authenticated — booking intent is preserved through auth via a redirect param.
3. **Where is your car?** — Google Places Autocomplete address input (or "use current location").
4. **Your vehicle** — select an existing vehicle or add one (Year/Make/Model cascading selects populated from a VIN-decode lookup when VIN is provided, else manual; Mileage, Engine, License Plate, Color, Transmission, Fuel Type).
5. **Choose a service** — grid of service categories with icons and "From $X" pricing; multi-select allowed (e.g., Oil Change + Battery).
6. **Instant Estimate** panel — live-updating subtotal, platform fee transparency line ("includes tax & fees"), estimated duration, warranty blurb.
7. Choose **ASAP** or **Schedule Later** (date/time picker respecting mechanic availability density in that ZIP).
8. Review & confirm → payment method (saved card via Stripe, Apple Pay/Google Pay via Stripe Payment Request Button) → **authorize** payment (hold, not capture, until job completes — see §Stripe Integration).
9. Job enters `searching` state → dispatch engine broadcasts to nearby mechanics.
10. Customer sees a **"Finding your mechanic"** animated state (same visual language as the reference app's tracking screen) with live status updates over Supabase Realtime.
11. Mechanic **accepts** → customer sees mechanic profile card (photo, name, rating, van, ETA) and a live map with the mechanic's position updating in real time.
12. Mechanic marks **arrived** → **in progress** → uploads before/after photos → marks **complete**.
13. Payment **captured** automatically on completion (see Stripe flow) → customer gets a receipt (email + in-app).
14. Customer prompted to **rate the mechanic** (1–5 stars + comment); mechanic separately rates the customer (double-blind, see §Review System).

### 4.2 Customer — Schedule Later
Same as above except step 9 differs: job is created in `scheduled` state with a future `scheduled_at`; dispatch broadcast is deferred to run automatically at `scheduled_at - lead_time` (default 45 min) rather than immediately, so nearby mechanics get a fresh, close-to-departure ping rather than committing hours in advance.

### 4.3 Mechanic — Onboarding
1. Sign up (email/phone) → select role = mechanic.
2. Complete profile: photo, bio, years of experience, service categories offered, service radius, home base address.
3. Upload documents: driver's license, proof of insurance, certifications (ASE, EV, brake specialist, etc.) → status `pending_review`.
4. Connect payouts: **Stripe Connect Express onboarding** (embedded via Stripe-hosted onboarding link) — collects identity, bank account, tax info directly with Stripe (Revvy never touches SSNs/bank numbers).
5. Admin reviews documents → `approved` / `rejected` (with reason) / `needs_more_info`. Only `approved` mechanics can go online.
6. Mechanic sets **availability** (online/offline toggle, like a rideshare driver app) and opens the **Jobs** feed.

### 4.4 Mechanic — Job Lifecycle
1. Goes **online** → location tracked (foreground) while online.
2. Receives a job broadcast (push + SMS fallback) with distance, service summary, and payout estimate; has a countdown window to **Accept/Decline**.
3. On accept, navigates via in-app map (deep link to Google Maps/Waze optional) to the customer's location; status auto-transitions `accepted → en_route → arrived`.
4. Marks **in progress**, performs work, uploads before/after photos (Supabase Storage), adjusts line items only within the quote flow if scope changed (requires customer re-approval for anything beyond the quoted price).
5. Marks **complete** → payment captured → payout accrues to mechanic's Connect balance minus 10% platform fee minus Stripe processing fee.
6. Rates the customer; views job in history.

### 4.5 Admin — Mechanic Approval
Dashboard queue of `pending_review` mechanics → view uploaded docs inline (signed Supabase Storage URLs, short TTL) → approve/reject with an audit-logged reason → triggers notification to mechanic.

### 4.6 Admin — Dispute Resolution
Dispute raised by either party on a completed job → ticket created → admin reviews job timeline, photos, chat log, payment → can issue partial/full refund (Stripe refund API) or adjust payout, with every action written to `admin_audit_log`.

---

## 5. Feature List

**Customer:** account & auth, multi-vehicle garage, saved addresses, ASAP/scheduled booking, live instant estimate, service catalog browsing, custom-repair quote requests, live mechanic tracking, in-app chat with assigned mechanic, saved payment methods (Stripe), invoices/receipts, favorite mechanics, ratings & reviews, notification center, referral (roadmap).

**Mechanic:** account & document onboarding, Stripe Connect payouts, availability toggle, service-radius & category configuration, job feed with accept/decline, navigation hand-off, before/after photo upload, earnings dashboard (daily/weekly/monthly), payout history, ratings, in-app chat, vehicle-history view for repeat customers.

**Admin:** live jobs map (all active jobs, all online mechanics), mechanic approval queue, customer & mechanic account management (suspend/ban), dispute console, coupon/promo management, revenue analytics (GMV, take rate, refunds), service catalog & pricing CMS, support ticket inbox, blog/CMS pages, global settings (service areas, fee %, notification templates), audit log.

**Platform-wide systems:** dispatch engine, real-time location broadcasting, multi-channel notifications (push/SMS/email), double-blind review system, Stripe Connect payment/payout pipeline, RBAC/RLS security model, SEO-optimized marketing site & blog.

---

## 6. Information Architecture

### 6.1 Route Map (Next.js App Router)

```
/                                   Marketing home
/how-it-works
/services                           Catalog index (SEO landing)
/services/[category-slug]           e.g. /services/brakes  (SEO landing, schema.org LocalBusiness/Service)
/pricing
/fleets                             "For Fleets" (future-ready waitlist)
/roadside-assistance
/become-a-mechanic                  Mechanic recruiting funnel
/about
/faq
/support
/contact
/blog
/blog/[slug]
/careers
/legal/terms  /legal/privacy

/login  /signup  /verify            Auth (role chosen at signup or inferred by entry point)
/onboarding/customer
/onboarding/mechanic

/book                               Booking wizard (auth-gated at payment step, not at entry)
/book/vehicle
/book/service
/book/schedule
/book/review

/dashboard                          → redirects by role
/dashboard/customer
/dashboard/customer/vehicles
/dashboard/customer/appointments
/dashboard/customer/appointments/[id]      (live tracking view lives here)
/dashboard/customer/invoices
/dashboard/customer/addresses
/dashboard/customer/favorites
/dashboard/customer/payment-methods
/dashboard/customer/notifications
/dashboard/customer/reviews
/dashboard/customer/profile

/dashboard/mechanic
/dashboard/mechanic/availability
/dashboard/mechanic/jobs
/dashboard/mechanic/jobs/[id]
/dashboard/mechanic/calendar
/dashboard/mechanic/earnings
/dashboard/mechanic/payouts
/dashboard/mechanic/analytics
/dashboard/mechanic/ratings
/dashboard/mechanic/messages
/dashboard/mechanic/profile

/dashboard/admin
/dashboard/admin/live-map
/dashboard/admin/revenue
/dashboard/admin/mechanics
/dashboard/admin/mechanics/[id]
/dashboard/admin/customers
/dashboard/admin/disputes
/dashboard/admin/coupons
/dashboard/admin/analytics
/dashboard/admin/stripe
/dashboard/admin/services
/dashboard/admin/pricing
/dashboard/admin/support
/dashboard/admin/cms
/dashboard/admin/settings

/api/*                              Route handlers (see §API Design)
```

Route groups: `(marketing)`, `(auth)`, `(customer)`, `(mechanic)`, `(admin)` — each with its own `layout.tsx` and a `middleware.ts` guard checking Supabase session + `profiles.role`.

### 6.2 Sitemap (SEO-relevant subset)
Home → How it Works → Services (hub) → Services/[category] (12+ indexed landing pages, one per major category: Oil Change, Brakes, Battery, Diagnostics, Suspension, Electronics/Audio, Roadside Assistance, etc.) → Pricing → Become a Mechanic → About/FAQ/Blog/Careers → Legal. Each service landing page is server-rendered/ISR with unique title/meta/schema for local SEO ("mobile mechanic near me", "mobile oil change Tampa").

---

## 7. Database Schema

Postgres (Supabase) with **PostGIS** enabled for geospatial dispatch queries. All tables have `id uuid default gen_random_uuid()`, `created_at timestamptz default now()`, and `updated_at` maintained by trigger unless noted.

```sql
-- ============ IDENTITY ============
create type user_role as enum ('customer', 'mechanic', 'admin', 'support_agent', 'finance');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'customer',
  full_name text not null,
  email text not null,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table customer_profiles (
  profile_id uuid primary key references profiles(id) on delete cascade,
  stripe_customer_id text unique,
  default_address_id uuid,
  referral_code text unique
);

create type mechanic_approval_status as enum ('pending_review','approved','rejected','needs_more_info','suspended');
create type mechanic_availability as enum ('offline','online','busy');

create table mechanic_profiles (
  profile_id uuid primary key references profiles(id) on delete cascade,
  bio text,
  years_experience int,
  van_description text,
  stripe_connect_account_id text unique,
  stripe_payouts_enabled boolean not null default false,
  approval_status mechanic_approval_status not null default 'pending_review',
  approval_reason text,
  approved_by uuid references profiles(id),
  approved_at timestamptz,
  availability mechanic_availability not null default 'offline',
  service_radius_miles numeric not null default 15,
  current_location geography(Point,4326),
  current_heading numeric,
  location_updated_at timestamptz,
  rating_avg numeric(3,2) not null default 0,
  rating_count int not null default 0,
  jobs_completed int not null default 0,
  member_since date not null default current_date
);
create index mechanic_profiles_geo_idx on mechanic_profiles using gist (current_location);

create type doc_type as enum ('drivers_license','insurance','certification','w9');
create type doc_status as enum ('pending','approved','rejected');

create table mechanic_documents (
  id uuid primary key default gen_random_uuid(),
  mechanic_id uuid not null references mechanic_profiles(profile_id) on delete cascade,
  doc_type doc_type not null,
  label text,                          -- e.g. "ASE Master", "Brake Specialist"
  file_path text not null,             -- Supabase Storage path (private bucket)
  status doc_status not null default 'pending',
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============ VEHICLES & ADDRESSES ============
create table vehicles (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customer_profiles(profile_id) on delete cascade,
  year int not null,
  make text not null,
  model text not null,
  vin text,
  mileage int,
  engine text,
  license_plate text,
  color text,
  transmission text,
  fuel_type text,
  nickname text,
  created_at timestamptz not null default now()
);

create table addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customer_profiles(profile_id) on delete cascade,
  label text,                          -- "Home", "Office"
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  location geography(Point,4326) not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index addresses_geo_idx on addresses using gist (location);

-- ============ CATALOG ============
create table service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text,
  description text,
  sort_order int not null default 0
);

create type price_type as enum ('fixed','estimate','quote_only');

create table services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references service_categories(id),
  name text not null,
  slug text not null unique,
  description text,
  base_price numeric(10,2),            -- null when price_type = quote_only
  price_type price_type not null default 'fixed',
  duration_minutes int,
  is_active boolean not null default true
);

create table mechanic_services (
  mechanic_id uuid references mechanic_profiles(profile_id) on delete cascade,
  service_id uuid references services(id) on delete cascade,
  custom_price numeric(10,2),
  primary key (mechanic_id, service_id)
);

-- ============ JOBS ============
create type job_status as enum (
  'draft','pending_payment','searching','scheduled','accepted',
  'en_route','arrived','in_progress','completed','cancelled','disputed'
);
create type scheduling_type as enum ('asap','scheduled');

create table jobs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customer_profiles(profile_id),
  mechanic_id uuid references mechanic_profiles(profile_id),
  vehicle_id uuid not null references vehicles(id),
  address_id uuid not null references addresses(id),
  status job_status not null default 'draft',
  scheduling_type scheduling_type not null default 'asap',
  scheduled_at timestamptz,
  subtotal numeric(10,2) not null default 0,
  platform_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  currency text not null default 'usd',
  stripe_payment_intent_id text,
  dispatch_radius_miles numeric default 5,
  cancellation_reason text,
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  arrived_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz
);
create index jobs_customer_idx on jobs(customer_id);
create index jobs_mechanic_idx on jobs(mechanic_id);
create index jobs_status_idx on jobs(status);

create table job_services (
  job_id uuid references jobs(id) on delete cascade,
  service_id uuid references services(id),
  price numeric(10,2) not null,
  quantity int not null default 1,
  primary key (job_id, service_id)
);

create table job_status_history (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  status job_status not null,
  changed_by uuid references profiles(id),
  changed_at timestamptz not null default now()
);

-- Dispatch offers: one row per mechanic per broadcast wave
create type offer_status as enum ('sent','accepted','declined','expired');
create table job_dispatch_offers (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  mechanic_id uuid not null references mechanic_profiles(profile_id),
  wave int not null,
  distance_miles numeric,
  status offer_status not null default 'sent',
  sent_at timestamptz not null default now(),
  responded_at timestamptz
);

-- Periodic persisted snapshots (live ping stream itself rides Realtime, not this table)
create table job_location_pings (
  id bigint generated always as identity primary key,
  job_id uuid not null references jobs(id) on delete cascade,
  mechanic_id uuid not null references mechanic_profiles(profile_id),
  location geography(Point,4326) not null,
  heading numeric,
  speed numeric,
  recorded_at timestamptz not null default now()
);

create type photo_type as enum ('before','after');
create table job_photos (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  type photo_type not null,
  file_path text not null,
  uploaded_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  recipient_id uuid not null references profiles(id),
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============ PAYMENTS ============
create type payment_status as enum ('requires_capture','captured','refunded','partially_refunded','failed');
create table payments (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id),
  stripe_payment_intent_id text not null,
  amount numeric(10,2) not null,
  platform_fee_amount numeric(10,2) not null,
  mechanic_payout_amount numeric(10,2) not null,
  status payment_status not null default 'requires_capture',
  captured_at timestamptz,
  refunded_at timestamptz,
  created_at timestamptz not null default now()
);

create table payouts (
  id uuid primary key default gen_random_uuid(),
  mechanic_id uuid not null references mechanic_profiles(profile_id),
  stripe_transfer_id text,
  amount numeric(10,2) not null,
  period_start date,
  period_end date,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- ============ TRUST & SUPPORT ============
create table reviews (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id),
  reviewer_id uuid not null references profiles(id),
  reviewee_id uuid not null references profiles(id),
  rating int not null check (rating between 1 and 5),
  comment text,
  visible_at timestamptz,             -- null until double-blind reveal condition met
  created_at timestamptz not null default now(),
  unique (job_id, reviewer_id)
);

create table favorite_mechanics (
  customer_id uuid references customer_profiles(profile_id) on delete cascade,
  mechanic_id uuid references mechanic_profiles(profile_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (customer_id, mechanic_id)
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  data jsonb default '{}',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create type dispute_status as enum ('open','investigating','resolved_customer','resolved_mechanic','resolved_split');
create table disputes (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id),
  raised_by uuid not null references profiles(id),
  reason text not null,
  status dispute_status not null default 'open',
  resolution text,
  refund_amount numeric(10,2),
  resolved_by uuid references profiles(id),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percent','fixed')),
  discount_value numeric(10,2) not null,
  max_uses int,
  used_count int not null default 0,
  expires_at timestamptz,
  active boolean not null default true
);

create table support_tickets (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id),
  subject text not null,
  status text not null default 'open',
  priority text not null default 'normal',
  assigned_to uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text not null,
  author_id uuid references profiles(id),
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);
```

### 7.1 Row-Level Security (representative policies)

```sql
alter table jobs enable row level security;

create policy "customers read own jobs" on jobs
  for select using (customer_id = auth.uid());

create policy "mechanics read assigned or open jobs" on jobs
  for select using (
    mechanic_id = auth.uid()
    or (mechanic_id is null and status = 'searching' and exists (
      select 1 from job_dispatch_offers o
      where o.job_id = jobs.id and o.mechanic_id = auth.uid()
    ))
  );

create policy "admins read all jobs" on jobs
  for select using (exists (
    select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','support_agent')
  ));

create policy "customers create own jobs" on jobs
  for insert with check (customer_id = auth.uid());

-- Mutations that cross ownership boundaries (accept, capture payment, refund)
-- are NOT exposed as raw table UPDATE policies to end users; they go through
-- SECURITY DEFINER Postgres functions / Edge Functions using the service role,
-- which re-validate business rules server-side (see §API Design, Dispatch Logic).
```

Every table follows the same pattern: **owner-scoped SELECT policies**, **narrow INSERT policies for the creating party**, and **no direct UPDATE/DELETE policies for state-changing columns** — those go through `security definer` RPC functions (`accept_job(job_id)`, `capture_job_payment(job_id)`, `approve_mechanic(mechanic_id)`) so business invariants (only one mechanic can accept, only an admin can approve) are enforced in one place, not scattered across client code.

---

## 8. API Design

Two layers, deliberately:
1. **Direct Supabase client calls (PostgREST + RLS)** for simple, owner-scoped CRUD — reading your own vehicles, addresses, notifications, job history. No custom API needed; RLS is the authorization layer.
2. **Next.js Route Handlers (`/api/*`) and Supabase Edge Functions** for anything that (a) needs a secret (Stripe, Twilio, Google server-side keys, Resend), (b) enforces a cross-user invariant (dispatch, accept-race, payment capture, admin approval), or (c) is a webhook target.

### 8.1 Key endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/estimate` | POST | Compute live price estimate from selected services + address (tax, fees) before a job exists |
| `/api/jobs` | POST | Create a job (draft → pending_payment), authorize payment intent |
| `/api/jobs/:id/dispatch` | POST (internal, called by DB trigger via `pg_net` or a queue) | Run the dispatch wave algorithm |
| `/api/jobs/:id/accept` | POST | Mechanic accept — guarded RPC, race-safe |
| `/api/jobs/:id/decline` | POST | Mechanic decline current offer |
| `/api/jobs/:id/status` | POST | Valid state transitions only (state machine enforced server-side) |
| `/api/jobs/:id/location` | POST | Mechanic location ping → Realtime broadcast + periodic persistence |
| `/api/jobs/:id/complete` | POST | Marks complete, triggers payment capture + payout accrual |
| `/api/payments/webhook` (Stripe) | POST | Stripe webhook: `payment_intent.succeeded`, `charge.refunded`, `account.updated`, `payout.paid` |
| `/api/notifications/webhook` (Twilio) | POST | Inbound SMS status callbacks |
| `/api/mechanics/:id/documents` | POST | Upload + register a compliance document |
| `/api/admin/mechanics/:id/approve` | POST | Admin approval action (audit-logged) |
| `/api/reviews` | POST | Submit a review (held until double-blind reveal) |
| `/api/geocode` | POST | Server-side proxy to Google Geocoding (keeps API key server-only) |

All route handlers validate input with **Zod**, use the Supabase **service role key only inside the handler** (never shipped to the client), and return typed JSON matching a shared `types/api.ts` contract consumed by the frontend via generated TypeScript types + hand-written response types.

### 8.2 Authentication Flow
- Supabase Auth: email/password, Google OAuth, and phone OTP (via Supabase Auth's Twilio integration) for mechanics who prefer phone-first signup.
- On signup, a Postgres trigger (`handle_new_user`) inserts a `profiles` row and the role-specific `customer_profiles`/`mechanic_profiles` row.
- **Custom JWT claim for role** via a Supabase Auth Hook (Postgres function invoked at token issuance) so `role` is available in the JWT without an extra DB round-trip — RLS policies read `auth.jwt() ->> 'role'` where convenient, falling back to a `profiles` join where freshness matters (e.g., after an admin demotes a suspended mechanic, the JWT claim only refreshes on next token refresh, so **suspension checks are also re-validated against the live `profiles`/`mechanic_profiles` row** on every state-changing RPC, not just trusted from the JWT).
- `middleware.ts` reads the session cookie, redirects unauthenticated users away from `/dashboard/*`, and redirects a role mismatch (e.g., a mechanic hitting `/dashboard/admin`) to their own dashboard.
- Session refresh handled by `@supabase/ssr` cookie-based helpers (no client-side localStorage tokens, avoiding XSS token theft).

### 8.3 Mechanic Dispatch Logic
Goal: mirror the reliability guarantees of rideshare dispatch — fast, fair, and race-free.

1. Job enters `searching`. A Postgres trigger enqueues a dispatch job (via `pg_net.http_post` to an Edge Function, or a lightweight queue table polled by a scheduled function).
2. **Candidate query** (PostGIS): 
   ```sql
   select mp.profile_id, ST_Distance(mp.current_location, :job_point) / 1609.34 as miles
   from mechanic_profiles mp
   join mechanic_services ms on ms.mechanic_id = mp.profile_id
   where mp.availability = 'online'
     and mp.approval_status = 'approved'
     and ms.service_id = any(:requested_service_ids)
     and ST_DWithin(mp.current_location, :job_point, :radius_meters)
   group by mp.profile_id, mp.current_location
   having count(distinct ms.service_id) = cardinality(:requested_service_ids)
   order by miles asc
   limit 5;
   ```
3. **Wave broadcast:** top 5 eligible mechanics receive a simultaneous offer (`job_dispatch_offers` rows + push/SMS) with a 90-second countdown.
4. **Race-safe accept:** `accept_job(job_id, mechanic_id)` is a `security definer` function that does `UPDATE jobs SET mechanic_id = :mechanic_id, status='accepted' WHERE id = :job_id AND status = 'searching'` — the `WHERE status='searching'` guard means only the first committed transaction wins; Postgres's row lock serializes concurrent attempts and losers get zero rows affected, which the function turns into a clean "offer no longer available" response.
5. **Expanding radius:** if no acceptance within the wave window, radius escalates 5mi → 10mi → 15mi → 25mi and the query repeats, excluding mechanics already offered. If exhausted with a Florida-wide radius and still no acceptance, job is flagged for admin manual dispatch/customer notification with an option to cancel with full refund.
6. **Scheduled jobs** run the same pipeline, kicked off by a scheduled function `lead_time` minutes before `scheduled_at`.

### 8.4 Live GPS Tracking Logic
- While a job is `accepted → en_route → arrived`, the mechanic client posts a location ping every 3–5 seconds to a **Supabase Realtime channel** (`job:{id}:location`) via `broadcast` — this is ephemeral, low-latency, and never touches Postgres for the hot path.
- Every ~30 seconds (or on status change), a ping is also **persisted** to `job_location_pings` for ETA audit trail, dispute investigation, and analytics — this is the only path that hits the database, keeping write volume sane at scale.
- The customer's tracking screen subscribes to the same channel and renders the mechanic's marker on a Google Map with client-side interpolation between pings (so movement looks smooth even at a 3–5s update interval, matching the reference app's tracking UI).
- ETA is computed via the Google **Directions API**, recalculated on a debounce (every ~15s or >150m movement) rather than on every ping, to control API cost.
- Admin's live map subscribes to a broader Realtime channel (or polls an aggregated view) showing all active jobs + all online mechanics for coverage visibility.

### 8.5 Stripe Integration Flow
- **Customers:** Stripe Customer object created on first payment method save; cards tokenized via Stripe Elements (PCI scope stays with Stripe, never touches our servers).
- **Mechanics:** Stripe Connect **Express** accounts — onboarding is a Stripe-hosted flow linked from the mechanic dashboard; Revvy only stores `stripe_connect_account_id` and `payouts_enabled`.
- **Charge flow:** on booking confirmation, create a **PaymentIntent with `capture_method: manual`** for the estimated total (authorize, don't capture) — this holds funds without charging until the job is verified complete, protecting customers from being charged for work not done.
- **On job completion:** capture the PaymentIntent for the final amount (may include admin/mechanic-approved scope changes), then create a **Transfer** to the mechanic's connected account for `total - platform_fee (10%) `, using **Stripe Connect's destination charges / application_fee_amount** pattern so the fee split happens atomically in the same charge rather than as a separate transfer step, minimizing reconciliation drift.
- **Refunds/disputes:** admin-triggered partial/full refunds call Stripe's refund API against the original charge; if a transfer already occurred, a reversal is issued against the connected account per Stripe Connect's reversal rules.
- **Webhooks** (`/api/payments/webhook`, signature-verified with the Stripe webhook secret) keep local `payments`/`payouts` rows in sync with Stripe's async state (`payment_intent.succeeded`, `transfer.created`, `payout.paid`, `account.updated` for payouts_enabled flips).

### 8.6 Notification System
Three channels, orchestrated from one internal `notify(profile_id, type, payload)` service used by both Route Handlers and Edge Functions:
- **In-app:** insert into `notifications`, delivered instantly to an open client via Realtime subscription (badge/toast) and persisted for the notification center.
- **SMS (Twilio):** time-critical events only — job accepted, mechanic arriving, job complete, OTP codes — to respect carrier cost and user attention.
- **Email (Resend):** receipts, weekly digests, marketing/lifecycle emails, mechanic approval decisions.
- **Web Push** (V1) via the Push API/service worker for the installable PWA; native push (APNs/FCM) is added when native apps ship (see Roadmap).

### 8.7 Review System
Double-blind, Airbnb-style: both `reviews` rows exist as soon as either party submits, but `visible_at` stays `null` (hidden from the other party) until **both submit or a 14-day window elapses**, at which point a scheduled function stamps `visible_at = now()` on both simultaneously. This prevents retaliatory/anchored ratings. A trigger on `reviews` insert recomputes `mechanic_profiles.rating_avg`/`rating_count` (customer-side rating aggregate is out of scope for V1 display but stored the same way for future use, e.g. flagging abusive customers).

### 8.8 Admin Permissions
`profiles.role` drives both RLS and UI gating: `admin` (full access), `support_agent` (tickets, messages, read-only on jobs/disputes, cannot touch Stripe/payouts or approve mechanics), `finance` (revenue, payouts, refunds, cannot approve mechanics or manage CMS). Every privileged mutation (approve mechanic, issue refund, edit pricing, disable a coupon) is wrapped in a `security definer` function that checks the caller's role server-side and writes to `admin_audit_log` — the audit log is append-only (no UPDATE/DELETE policy at all) so it can't be tampered with by a compromised admin session.

---

## 9. UI Design System

Aesthetic direction (from the attached reference, pushed further upmarket): **dark luxury automotive** — think Porsche digital showroom meets Stripe Dashboard meets Uber's booking flow.

**Color tokens**
- `background.base`: `#08090D` (near-black, not pure black — reduces OLED smear and looks less "default dark mode")
- `background.surface`: `#111319`
- `background.elevated` (glass cards): `rgba(255,255,255,0.04)` fill, `rgba(255,255,255,0.08)` 1px border, `backdrop-filter: blur(20px)`
- `accent.primary` (electric blue): `#2E6BFF`
- `accent.primary.hover`: `#4C7DFF`
- `accent.success`: `#2ECC71` (job complete, online status)
- `accent.warning`: `#F5A623` (ASAP/urgent)
- `accent.danger`: `#EF4444` (cancellations, disputes)
- `text.primary`: `#F5F6F8`
- `text.secondary`: `#9AA1AF`
- `border.subtle`: `rgba(255,255,255,0.08)`

**Typography:** `Inter` (or `Geist Sans`) for UI text — geometric, excellent at small sizes for dashboard density; a tighter display cut (`Geist`/`Inter Tight`) for hero headlines at large weights (matching the bold "MECHANICS THAT COME TO YOU." treatment in the reference). Numeric tables (earnings, invoices) use tabular figures (`font-variant-numeric: tabular-nums`).

**Shape & elevation:** base radius `1rem`–`1.5rem` (`rounded-2xl`/`3xl` in Tailwind terms) on cards and inputs, `9999px` on pills/badges/status chips. Elevation via soft, colored shadows (`shadow-[0_8px_40px_-8px_rgba(46,107,255,0.25)]`) rather than heavy black drop shadows, to keep the dark UI feeling premium rather than muddy.

**Motion (Framer Motion):** page-level fade/slide transitions (150–250ms, `ease-out`), card hover lift (`translateY(-2px)` + shadow bloom), skeleton shimmer loaders for async dashboard data, live map marker interpolation, step-transition animation in the booking wizard mirroring the 5-screen "app experience" flow in the reference image.

**Accessibility:** all interactive elements meet WCAG AA contrast against the dark background (blue accent tuned to pass at 4.5:1 for text use), full keyboard navigation, visible focus rings (`ring-2 ring-accent-primary/60`), `prefers-reduced-motion` respected by disabling non-essential motion, live regions (`aria-live`) for tracking status changes.

---

## 10. Component Inventory

**Primitives (shadcn/ui-based):** Button, Input, Select, Combobox (Places autocomplete wrapper), DatePicker/TimePicker, Dialog, Sheet (mobile bottom-sheet pattern for booking steps), Tabs, Badge/StatusChip, Avatar, Card (incl. `GlassCard` variant), Tooltip, Toast, Skeleton, DataTable (admin lists), Progress, Slider (service radius), Switch (availability toggle).

**Domain components:**
- `VehicleCard`, `VehicleForm` (with VIN decode lookup)
- `ServiceCategoryGrid`, `ServiceCard`, `EstimatePanel` (sticky live-updating price summary)
- `AddressAutocomplete` (Google Places), `MapView` (Google Maps wrapper: booking preview, live tracking, admin heat/coverage map — one component, three modes)
- `BookingStepper` (wizard shell driving `/book/*`)
- `MechanicOfferCard` (job feed item for mechanics — distance, payout, countdown ring)
- `MechanicProfileCard` (customer-facing: photo, rating, van, certs — mirrors the reference's profile panel)
- `LiveTrackingPanel` (ETA, mechanic marker, call/message buttons)
- `JobTimeline` (status history, receipts)
- `PhotoUploadGrid` (before/after)
- `RatingStars`, `ReviewCard`
- `EarningsChart`, `RevenueChart` (shared charting primitives, dataviz-skill compliant)
- `DisputeThread`, `AdminApprovalQueueRow`, `AuditLogRow`
- `NotificationBell` + `NotificationCenter` (Realtime-backed)
- `CouponForm`, `ServiceCatalogEditor`, `CMSPageEditor`

---

## 11. Dashboard Designs (text wireframes)

### 11.1 Booking flow (mirrors the reference's 5-screen "app experience")
```
[1 Home]                [2 Services]            [3 Booking Details]      [4 Tracking]              [5 Summary]
Greeting + "Where can    Searchable list +       Location / Vehicle /     "Mechanic on the way"     Green check "Job Complete"
we help today?"          popular grid, from      Service summary, each    ETA badge, live map,      Service + price recap
Vehicle summary card     $-price chips           row editable             mechanic contact bar      Photos, "View Receipt",
Popular services grid                            Estimated total sticky                             "Book Again"
Bottom nav: Home/                                bar, Continue CTA
Bookings/Track/Profile
```

### 11.2 Customer Dashboard — Appointment detail (`/dashboard/customer/appointments/[id]`)
Left: full-bleed `MapView` in tracking mode. Right rail (glass panel): status header (chip: Searching/Accepted/En Route/In Progress/Complete), `MechanicProfileCard`, `JobTimeline`, itemized services + total, call/message buttons, cancel/reschedule (only while `searching`/`scheduled`).

### 11.3 Mechanic Dashboard — Jobs feed (`/dashboard/mechanic/jobs`)
Top: availability `Switch` + today's earnings snapshot. List of `MechanicOfferCard`s for pending offers (countdown ring, Accept/Decline). Below: active job (if any) pinned with a "Navigate" primary CTA. Tabs: Pending / Active / History.

### 11.4 Admin — Live Jobs Map (`/dashboard/admin/live-map`)
Full-viewport map, color-coded pins (online idle mechanic = blue, en route = amber trail, active job = green pulse). Left filter rail: metro/ZIP, status, service category. Click a pin → side panel with job/mechanic detail and quick actions (reassign, contact, view job).

### 11.5 Admin — Mechanic Approval Queue
`DataTable`: name, submitted date, docs status chips, quick-view drawer with inline document viewer (signed URLs), Approve/Reject/Request More Info actions — every action audit-logged.

---

## 12. Route Map & Folder Structure

```
app/
  (marketing)/
    page.tsx                     Home
    how-it-works/page.tsx
    services/page.tsx
    services/[slug]/page.tsx
    pricing/page.tsx
    fleets/page.tsx
    roadside-assistance/page.tsx
    become-a-mechanic/page.tsx
    about/  faq/  support/  contact/  blog/  blog/[slug]/  careers/
    layout.tsx
  (auth)/
    login/page.tsx  signup/page.tsx  verify/page.tsx
  (booking)/
    book/[[...step]]/page.tsx     Wizard driven by BookingStepper
  (customer)/
    dashboard/layout.tsx
    dashboard/page.tsx  vehicles/  appointments/  appointments/[id]/
    invoices/  addresses/  favorites/  payment-methods/  notifications/  reviews/  profile/
  (mechanic)/
    dashboard/layout.tsx
    dashboard/page.tsx  availability/  jobs/  jobs/[id]/  calendar/
    earnings/  payouts/  analytics/  ratings/  messages/  profile/
  (admin)/
    dashboard/layout.tsx
    dashboard/page.tsx  live-map/  revenue/  mechanics/  mechanics/[id]/
    customers/  disputes/  coupons/  analytics/  stripe/  services/  pricing/  support/  cms/  settings/
  api/
    estimate/  jobs/  jobs/[id]/{accept,decline,status,location,complete}/
    payments/webhook/  notifications/webhook/  mechanics/[id]/documents/
    admin/mechanics/[id]/approve/  reviews/  geocode/
  middleware.ts

components/
  ui/                             shadcn primitives
  marketing/
  booking/
  maps/
  dashboard/customer/  dashboard/mechanic/  dashboard/admin/
  shared/

lib/
  supabase/{client.ts,server.ts,middleware.ts}
  stripe/{client.ts,connect.ts,webhooks.ts}
  maps/{places.ts,directions.ts,geocode.ts}
  twilio/  resend/
  dispatch/{candidateQuery.ts,waveEngine.ts}
  validations/                   Zod schemas
  utils/

hooks/                            useJob, useJobTracking, useMechanicOffers, useNotifications...
stores/                           Zustand: bookingWizard.ts, mapViewport.ts, uiState.ts
types/                            supabase.ts (generated), domain.ts, api.ts

supabase/
  migrations/
  functions/                      dispatch-wave, review-reveal, payout-reconciler
  seed.sql
```

---

## 13. State Management Strategy
- **Server/remote state:** TanStack Query wrapping every Supabase read/write — gives caching, dedupe, optimistic updates (e.g., optimistic "Accept" button state before the RPC confirms), and background refetch.
- **Real-time bridge:** Supabase Realtime subscriptions (`postgres_changes` for row updates like job status, `broadcast` for high-frequency location) push into the Query cache via `queryClient.setQueryData`/`invalidateQueries`, so components just read Query state and never juggle sockets directly.
- **Local/UI state:** Zustand for booking-wizard step state, map viewport, modal/sheet open state — deliberately not global app state, just ephemeral UI.
- **Form state:** React Hook Form + Zod resolvers for all multi-field forms (vehicle entry, mechanic onboarding, admin pricing editor).
- No Redux — the combination above covers server cache, real-time, and local UI without the ceremony.

---

## 14. Security

- **Row-Level Security everywhere**; no table is left with RLS disabled. Service-role key is used **only** inside server-only code (Route Handlers, Edge Functions) and is never bundled client-side.
- **Privileged mutations go through `security definer` Postgres functions**, not raw table policies — this is the single most important decision for correctness in a marketplace: it puts "only one mechanic can accept," "only an admin can approve," and "payment capture requires job.status = completed" in one auditable place.
- **Stripe webhook signature verification** on every webhook route; replay protection via Stripe's event `id` idempotency table.
- **Rate limiting** (Vercel Edge Middleware + a token-bucket in Upstash Redis, or Supabase's built-in rate limits) on booking creation, OTP requests, and login to blunt abuse/fraud.
- **Input validation** with Zod at every API boundary; never trust client-computed prices — `/api/estimate` and job creation always recompute totals server-side from the catalog, ignoring any client-sent price.
- **File uploads** (licenses, insurance, photos) go to private Supabase Storage buckets with short-lived signed URLs for viewing; MIME-type and size validated server-side before accepting.
- **Least privilege admin roles** (`admin`/`support_agent`/`finance`) and an append-only `admin_audit_log` for every privileged action.
- **Secrets management:** all third-party keys (Stripe, Twilio, Google, Resend, Supabase service role) live in Vercel/Supabase environment variables, scoped per environment (dev/staging/prod), never committed.
- **Auth hardening:** httpOnly, SameSite cookies via `@supabase/ssr` (no tokens in localStorage), phone OTP for mechanic identity step, optional 2FA for admin accounts.
- **PII handling:** VIN, license plate, driver's license, and insurance documents are the most sensitive fields — stored in Postgres/Storage with RLS/signed-URL access control; a data-retention/deletion policy should be defined with legal before launch (flagged as an open question, §18).

---

## 15. Performance

- **Marketing & blog:** ISR (revalidate on publish via webhook or a sane TTL), `next/image` with responsive `sizes`, font subsetting, critical-CSS-friendly Tailwind purge — targeting LCP < 2.5s and CLS < 0.1 on the home page's hero, which is the highest-traffic, highest-conversion-sensitivity page.
- **Code splitting:** the Google Maps SDK, Stripe Elements, and heavy charting libraries are dynamically imported only on the routes that need them (booking, tracking, admin map, earnings) — the marketing site never pays that bundle cost.
- **Dispatch/geo queries:** GiST spatial index on `mechanic_profiles.current_location` and `addresses.location` keeps `ST_DWithin` candidate queries fast even at tens of thousands of mechanics.
- **Realtime cost control:** location broadcast is ephemeral (not a DB write) on the hot path; only a throttled snapshot persists, keeping write amplification low as concurrent active jobs scale.
- **Connection pooling:** Supabase's pooled connection string (PgBouncer, transaction mode) for serverless Route Handlers to avoid connection exhaustion under Vercel's scale-to-zero model.
- **Caching:** service catalog and marketing content cached at the edge (rarely changes); anything personalized (dashboards) is `no-store`/dynamic by design.
- **Monitoring:** Web Vitals reported via Vercel Analytics; backend latency/error tracking via Sentry; slow-query alerting via Supabase's built-in Postgres insights.

---

## 16. Deployment

- **Frontend:** Vercel — Preview Deployment per PR (with a preview Supabase branch or a shared staging project seeded per PR), Production deployment on merge to `main`.
- **Backend:** Supabase — separate **dev**, **staging**, and **production** projects; schema changes are files in `supabase/migrations/`, applied via `supabase db push` in CI, never edited by hand in the dashboard for staging/prod.
- **Domains:** `revvy.com` (marketing + app on one domain, path-based, to keep auth cookies first-party and simplify SEO — no split subdomain unless traffic/isolation needs force it later).
- **Environments:** Stripe test mode wired to dev/staging, live mode to production only, gated by environment variable, with a CI check that fails the build if a live Stripe key is referenced outside the `production` environment.
- **Secrets:** managed in Vercel Project Settings and Supabase Dashboard, one set per environment, never in the repo.

### 16.1 CI/CD Pipeline (GitHub Actions)
1. **On PR:** install → typecheck (`tsc --noEmit`) → lint (`eslint`) → unit tests (`vitest`) → `supabase db push --dry-run` against a throwaway branch DB to catch migration errors early → Playwright smoke tests against the Vercel preview URL (booking flow, login) → bundle-size / Lighthouse CI budget check.
2. **On merge to `main`:** run the same checks → apply migrations to the production Supabase project → Vercel production deploy → Sentry release + source-map upload → post-deploy smoke test.
3. **Rollback:** Vercel instant rollback to previous deployment; database migrations are written additive/backward-compatible (no destructive migration ships in the same release as the code that depends on it being gone) so a frontend rollback never leaves the DB in an incompatible state.

---

## 17. Future Roadmap
- **Native apps** (React Native/Expo) sharing the same Supabase backend and TypeScript domain types; push via FCM/APNs replacing web push as primary.
- **Fleet accounts** — multi-vehicle org billing, consolidated invoicing, priority SLAs, dedicated account management (the "For Fleets" page becomes a real product, not a waitlist).
- **Maintenance plans/subscriptions** — recurring scheduled service packages with Stripe Subscriptions.
- **Nationwide expansion** — service-area is already a data-driven polygon/radius concept; expansion is an ops/marketing exercise plus adding time-zone-aware scheduling.
- **Dynamic/surge pricing** during high-demand windows, mirrored after rideshare demand-based pricing, with transparent customer-facing messaging.
- **Multi-mechanic shop accounts** (a business entity with employee mechanics, shared calendar/dispatch).
- **Parts marketplace integration** for custom-repair quotes (sourcing/pricing parts inline rather than mechanic-supplied).
- **AI diagnostic triage** (chat-based symptom intake that pre-fills the likely service and a more accurate estimate).
- **Spanish-language localization** given the Florida market.
- **Instant payouts** (paid tier) via Stripe Instant Payouts.
- **White-label/franchise model** for licensing the platform to regional operators.

---

## 18. Development Phases
- **Phase 0 — Architecture (this document).** Approval gate before any code.
- **Phase 1 — Foundation.** Supabase project + full schema/RLS, Next.js scaffold, design system/Tailwind theme + shadcn setup, auth (signup/login/roles/middleware), marketing site shell (SEO-ready, no dynamic data yet).
- **Phase 2 — Customer booking core.** Vehicle management, address/Places integration, service catalog, estimate engine, booking wizard end-to-end against a **manually-assigned** job (no live dispatch yet) so the payment + status pipeline can be validated in isolation.
- **Phase 3 — Mechanic app & real dispatch.** Mechanic onboarding + document upload + Stripe Connect, availability, the dispatch wave engine, accept/decline race-safety, navigation hand-off.
- **Phase 4 — Live experience.** Realtime location broadcast + tracking UI, multi-channel notifications, in-app chat, before/after photos, double-blind reviews.
- **Phase 5 — Admin & trust/safety.** Live jobs map, mechanic approval queue, disputes, coupons, revenue analytics, support tickets, CMS/blog.
- **Phase 6 — Hardening.** Security review pass, performance/Core Web Vitals pass, SEO audit, accessibility audit, load-testing the dispatch query path.
- **Phase 7 — Launch (Florida).** Phased metro rollout (Tampa → Orlando → Miami), monitoring/alerting live, support ops staffed.
- **Phase 8 — Post-launch iteration.** Roadmap items prioritized by real usage data.

---

## 19. Questions / Assumptions Requiring Your Input

1. **Background checks & insurance verification** — which vendor (e.g., Checkr) should we integrate, or is this manual admin review only for V1?
2. **Pricing model confirmation** — confirm the hybrid model (fixed catalog price + quote flow for custom repairs) matches your intent, and who sets catalog prices platform-wide vs. per-mechanic customization.
3. **Payout cadence** — default Stripe rolling payout (T+2) acceptable for V1, with instant payout as a later paid feature?
4. **Launch metros** — confirm Tampa/Orlando/Miami as the first three, or a different initial set/order.
5. **Cancellation & refund policy** — what cancellation window is free vs. penalized, for both customer- and mechanic-initiated cancellations?
6. **Data retention** — how long do we retain VIN/license/insurance documents after a mechanic is rejected or a customer closes their account (legal/compliance input needed)?
7. **Native app timing** — is a PWA acceptable for launch, or is native iOS/Android a V1 hard requirement (this materially changes Phase 1–3 scope)?
8. **Support staffing model** — is `support_agent`/`finance` role separation reflecting your actual planned org, or should permissions be modeled differently?

---

*Once these are confirmed (or you say "proceed with the stated assumptions"), implementation begins at Phase 1.*
