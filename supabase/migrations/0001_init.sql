-- Revvy — initial schema
-- Mirrors docs/REVVY_PRD.md §7 Database Schema, adjusted for the V1 decisions
-- recorded in §19 (single admin role, manual mechanic review, hybrid pricing).

create extension if not exists "postgis";
create extension if not exists "pgcrypto";

create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- IDENTITY
-- ============================================================

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

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

create table customer_profiles (
  profile_id uuid primary key references profiles(id) on delete cascade,
  stripe_customer_id text unique,
  default_address_id uuid,
  referral_code text unique,
  created_at timestamptz not null default now()
);

create type mechanic_approval_status as enum ('pending_review', 'approved', 'rejected', 'needs_more_info', 'suspended');
create type mechanic_availability as enum ('offline', 'online', 'busy');

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
  current_location geography(Point, 4326),
  current_heading numeric,
  location_updated_at timestamptz,
  rating_avg numeric(3, 2) not null default 0,
  rating_count int not null default 0,
  jobs_completed int not null default 0,
  member_since date not null default current_date,
  created_at timestamptz not null default now()
);

create index mechanic_profiles_geo_idx on mechanic_profiles using gist (current_location);
create index mechanic_profiles_availability_idx on mechanic_profiles (availability, approval_status);

create type doc_type as enum ('drivers_license', 'insurance', 'certification', 'w9');
create type doc_status as enum ('pending', 'approved', 'rejected');

create table mechanic_documents (
  id uuid primary key default gen_random_uuid(),
  mechanic_id uuid not null references mechanic_profiles(profile_id) on delete cascade,
  doc_type doc_type not null,
  label text,
  file_path text not null,
  status doc_status not null default 'pending',
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index mechanic_documents_mechanic_idx on mechanic_documents (mechanic_id);

-- ============================================================
-- VEHICLES & ADDRESSES
-- ============================================================

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

create index vehicles_customer_idx on vehicles (customer_id);

create table addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customer_profiles(profile_id) on delete cascade,
  label text,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  location geography(Point, 4326) not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index addresses_geo_idx on addresses using gist (location);
create index addresses_customer_idx on addresses (customer_id);

alter table customer_profiles
  add constraint customer_profiles_default_address_fk
  foreign key (default_address_id) references addresses(id) on delete set null;

-- ============================================================
-- CATALOG
-- ============================================================

create table service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text,
  description text,
  sort_order int not null default 0
);

create type price_type as enum ('fixed', 'estimate', 'quote_only');

create table services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references service_categories(id),
  name text not null,
  slug text not null unique,
  description text,
  base_price numeric(10, 2),
  price_type price_type not null default 'fixed',
  duration_minutes int,
  is_active boolean not null default true
);

create index services_category_idx on services (category_id);

create table mechanic_services (
  mechanic_id uuid references mechanic_profiles(profile_id) on delete cascade,
  service_id uuid references services(id) on delete cascade,
  custom_price numeric(10, 2),
  primary key (mechanic_id, service_id)
);

-- ============================================================
-- JOBS
-- ============================================================

create type job_status as enum (
  'draft', 'pending_payment', 'searching', 'scheduled', 'accepted',
  'en_route', 'arrived', 'in_progress', 'completed', 'cancelled', 'disputed'
);
create type scheduling_type as enum ('asap', 'scheduled');

create table jobs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customer_profiles(profile_id),
  mechanic_id uuid references mechanic_profiles(profile_id),
  vehicle_id uuid not null references vehicles(id),
  address_id uuid not null references addresses(id),
  status job_status not null default 'draft',
  scheduling_type scheduling_type not null default 'asap',
  scheduled_at timestamptz,
  subtotal numeric(10, 2) not null default 0,
  platform_fee numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  currency text not null default 'usd',
  stripe_payment_intent_id text,
  dispatch_radius_miles numeric default 5,
  cancelled_by uuid references profiles(id),
  cancellation_reason text,
  cancellation_fee numeric(10, 2),
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  arrived_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz
);

create index jobs_customer_idx on jobs (customer_id);
create index jobs_mechanic_idx on jobs (mechanic_id);
create index jobs_status_idx on jobs (status);

create table job_services (
  job_id uuid references jobs(id) on delete cascade,
  service_id uuid references services(id),
  price numeric(10, 2) not null,
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

create index job_status_history_job_idx on job_status_history (job_id);

create type offer_status as enum ('sent', 'accepted', 'declined', 'expired');

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

create index job_dispatch_offers_job_idx on job_dispatch_offers (job_id);
create index job_dispatch_offers_mechanic_idx on job_dispatch_offers (mechanic_id);

create table job_location_pings (
  id bigint generated always as identity primary key,
  job_id uuid not null references jobs(id) on delete cascade,
  mechanic_id uuid not null references mechanic_profiles(profile_id),
  location geography(Point, 4326) not null,
  heading numeric,
  speed numeric,
  recorded_at timestamptz not null default now()
);

create index job_location_pings_job_idx on job_location_pings (job_id, recorded_at desc);

create type photo_type as enum ('before', 'after');

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

create index messages_job_idx on messages (job_id, created_at);

-- ============================================================
-- PAYMENTS
-- ============================================================

create type payment_status as enum ('requires_capture', 'captured', 'refunded', 'partially_refunded', 'failed');

create table payments (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id),
  stripe_payment_intent_id text not null,
  amount numeric(10, 2) not null,
  platform_fee_amount numeric(10, 2) not null,
  mechanic_payout_amount numeric(10, 2) not null,
  status payment_status not null default 'requires_capture',
  captured_at timestamptz,
  refunded_at timestamptz,
  created_at timestamptz not null default now()
);

create index payments_job_idx on payments (job_id);

create table payouts (
  id uuid primary key default gen_random_uuid(),
  mechanic_id uuid not null references mechanic_profiles(profile_id),
  stripe_transfer_id text,
  amount numeric(10, 2) not null,
  period_start date,
  period_end date,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create index payouts_mechanic_idx on payouts (mechanic_id);

-- ============================================================
-- TRUST & SUPPORT
-- ============================================================

create table reviews (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id),
  reviewer_id uuid not null references profiles(id),
  reviewee_id uuid not null references profiles(id),
  rating int not null check (rating between 1 and 5),
  comment text,
  visible_at timestamptz,
  created_at timestamptz not null default now(),
  unique (job_id, reviewer_id)
);

create index reviews_reviewee_idx on reviews (reviewee_id);

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
  data jsonb not null default '{}',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_profile_idx on notifications (profile_id, created_at desc);

create type dispute_status as enum ('open', 'investigating', 'resolved_customer', 'resolved_mechanic', 'resolved_split');

create table disputes (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id),
  raised_by uuid not null references profiles(id),
  reason text not null,
  status dispute_status not null default 'open',
  resolution text,
  refund_amount numeric(10, 2),
  resolved_by uuid references profiles(id),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value numeric(10, 2) not null,
  max_uses int,
  used_count int not null default 0,
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
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

create table support_ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references support_tickets(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  body text not null,
  created_at timestamptz not null default now()
);

create table admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}',
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
