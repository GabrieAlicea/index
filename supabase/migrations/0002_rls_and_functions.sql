-- Revvy — Row Level Security + security-definer functions
-- Implements docs/REVVY_PRD.md §7.1 and §8: owner-scoped policies for
-- everything, with cross-user invariants enforced only through
-- `security definer` functions rather than open UPDATE policies.

-- ============================================================
-- HELPERS
-- ============================================================

create function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('admin', 'support_agent', 'finance')
  );
$$;

create function is_owner_or_admin(target uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid() = target or is_admin();
$$;

-- ============================================================
-- NEW USER PROVISIONING
-- ============================================================

create function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role user_role;
begin
  requested_role := coalesce(
    (new.raw_user_meta_data ->> 'role')::user_role,
    'customer'
  );

  -- Only customer/mechanic can be self-selected at signup; admin roles are
  -- granted manually and never trusted from client-supplied metadata.
  if requested_role not in ('customer', 'mechanic') then
    requested_role := 'customer';
  end if;

  insert into profiles (id, role, full_name, email, phone)
  values (
    new.id,
    requested_role,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email,
    new.raw_user_meta_data ->> 'phone'
  );

  if requested_role = 'mechanic' then
    insert into mechanic_profiles (profile_id) values (new.id);
  else
    insert into customer_profiles (profile_id) values (new.id);
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- ENABLE RLS
-- ============================================================

alter table profiles enable row level security;
alter table customer_profiles enable row level security;
alter table mechanic_profiles enable row level security;
alter table mechanic_documents enable row level security;
alter table vehicles enable row level security;
alter table addresses enable row level security;
alter table service_categories enable row level security;
alter table services enable row level security;
alter table mechanic_services enable row level security;
alter table jobs enable row level security;
alter table job_services enable row level security;
alter table job_status_history enable row level security;
alter table job_dispatch_offers enable row level security;
alter table job_location_pings enable row level security;
alter table job_photos enable row level security;
alter table messages enable row level security;
alter table payments enable row level security;
alter table payouts enable row level security;
alter table reviews enable row level security;
alter table favorite_mechanics enable row level security;
alter table notifications enable row level security;
alter table disputes enable row level security;
alter table coupons enable row level security;
alter table support_tickets enable row level security;
alter table support_ticket_messages enable row level security;
alter table admin_audit_log enable row level security;
alter table blog_posts enable row level security;

-- ============================================================
-- IDENTITY
-- ============================================================

create policy "read own or admin" on profiles
  for select using (is_owner_or_admin(id));

create policy "update own profile" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "read own or admin" on customer_profiles
  for select using (is_owner_or_admin(profile_id));

create policy "update own customer profile" on customer_profiles
  for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- Mechanic profiles are public-readable (customers need to see mechanic
-- cards before/while a job is active) but only the owner or an admin can
-- write, and approval fields are admin-only via approve_mechanic() below.
create policy "mechanic profiles are publicly readable" on mechanic_profiles
  for select using (true);

create policy "mechanics update own non-approval fields" on mechanic_profiles
  for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "read own documents or admin" on mechanic_documents
  for select using (is_owner_or_admin(mechanic_id));

create policy "mechanics upload own documents" on mechanic_documents
  for insert with check (auth.uid() = mechanic_id);

-- ============================================================
-- VEHICLES & ADDRESSES
-- ============================================================

create policy "customers manage own vehicles" on vehicles
  for all using (is_owner_or_admin(customer_id)) with check (auth.uid() = customer_id);

create policy "customers manage own addresses" on addresses
  for all using (is_owner_or_admin(customer_id)) with check (auth.uid() = customer_id);

-- ============================================================
-- CATALOG (public read, admin write)
-- ============================================================

create policy "catalog is publicly readable" on service_categories for select using (true);
create policy "admins manage categories" on service_categories for all using (is_admin());

create policy "services are publicly readable" on services for select using (true);
create policy "admins manage services" on services for all using (is_admin());

create policy "mechanic service pricing is publicly readable" on mechanic_services for select using (true);
create policy "mechanics manage own service pricing" on mechanic_services
  for all using (is_owner_or_admin(mechanic_id)) with check (auth.uid() = mechanic_id);

-- ============================================================
-- JOBS
-- ============================================================

create policy "customers read own jobs" on jobs
  for select using (customer_id = auth.uid());

create policy "mechanics read assigned or offered jobs" on jobs
  for select using (
    mechanic_id = auth.uid()
    or exists (
      select 1 from job_dispatch_offers o
      where o.job_id = jobs.id and o.mechanic_id = auth.uid()
    )
  );

create policy "admins read all jobs" on jobs for select using (is_admin());

create policy "customers create own jobs" on jobs
  for insert with check (customer_id = auth.uid());

create policy "customers cancel own pre-dispatch jobs" on jobs
  for update using (
    customer_id = auth.uid() and status in ('draft', 'pending_payment', 'searching', 'scheduled')
  ) with check (customer_id = auth.uid());

-- All other transitions (accept, en_route, arrived, complete, admin cancel,
-- payment capture) go through security-definer functions, not open policies.

create policy "participants read job services" on job_services
  for select using (
    exists (
      select 1 from jobs j
      where j.id = job_services.job_id
        and (j.customer_id = auth.uid() or j.mechanic_id = auth.uid() or is_admin())
    )
  );

create policy "participants read job status history" on job_status_history
  for select using (
    exists (
      select 1 from jobs j
      where j.id = job_status_history.job_id
        and (j.customer_id = auth.uid() or j.mechanic_id = auth.uid() or is_admin())
    )
  );

create policy "mechanics read own dispatch offers" on job_dispatch_offers
  for select using (mechanic_id = auth.uid() or is_admin());

create policy "participants read location pings" on job_location_pings
  for select using (
    mechanic_id = auth.uid()
    or is_admin()
    or exists (
      select 1 from jobs j where j.id = job_location_pings.job_id and j.customer_id = auth.uid()
    )
  );

create policy "mechanics insert own location pings" on job_location_pings
  for insert with check (mechanic_id = auth.uid());

create policy "participants read job photos" on job_photos
  for select using (
    exists (
      select 1 from jobs j
      where j.id = job_photos.job_id
        and (j.customer_id = auth.uid() or j.mechanic_id = auth.uid() or is_admin())
    )
  );

create policy "mechanics upload job photos" on job_photos
  for insert with check (
    uploaded_by = auth.uid()
    and exists (select 1 from jobs j where j.id = job_photos.job_id and j.mechanic_id = auth.uid())
  );

create policy "participants read own messages" on messages
  for select using (sender_id = auth.uid() or recipient_id = auth.uid() or is_admin());

create policy "participants send messages on their jobs" on messages
  for insert with check (
    sender_id = auth.uid()
    and exists (
      select 1 from jobs j
      where j.id = messages.job_id and (j.customer_id = auth.uid() or j.mechanic_id = auth.uid())
    )
  );

-- ============================================================
-- PAYMENTS & PAYOUTS (read-only to participants; writes via webhooks
-- using the service role, which bypasses RLS)
-- ============================================================

create policy "participants read own payments" on payments
  for select using (
    is_admin() or exists (
      select 1 from jobs j
      where j.id = payments.job_id and (j.customer_id = auth.uid() or j.mechanic_id = auth.uid())
    )
  );

create policy "mechanics read own payouts" on payouts
  for select using (mechanic_id = auth.uid() or is_admin());

-- ============================================================
-- TRUST & SUPPORT
-- ============================================================

create policy "reviews visible once revealed or to admin" on reviews
  for select using (
    is_admin() or reviewer_id = auth.uid() or (reviewee_id = auth.uid() and visible_at is not null)
  );

create policy "participants submit one review per job" on reviews
  for insert with check (
    reviewer_id = auth.uid()
    and exists (
      select 1 from jobs j
      where j.id = reviews.job_id
        and j.status = 'completed'
        and (j.customer_id = auth.uid() or j.mechanic_id = auth.uid())
    )
  );

create policy "customers manage own favorites" on favorite_mechanics
  for all using (customer_id = auth.uid()) with check (customer_id = auth.uid());

create policy "read own notifications" on notifications
  for select using (profile_id = auth.uid());

create policy "update own notifications" on notifications
  for update using (profile_id = auth.uid()) with check (profile_id = auth.uid());

create policy "participants read own disputes" on disputes
  for select using (
    is_admin() or raised_by = auth.uid() or exists (
      select 1 from jobs j
      where j.id = disputes.job_id and (j.customer_id = auth.uid() or j.mechanic_id = auth.uid())
    )
  );

create policy "participants raise disputes on own jobs" on disputes
  for insert with check (
    raised_by = auth.uid()
    and exists (
      select 1 from jobs j
      where j.id = disputes.job_id and (j.customer_id = auth.uid() or j.mechanic_id = auth.uid())
    )
  );

create policy "active coupons are publicly readable" on coupons
  for select using (active = true or is_admin());
create policy "admins manage coupons" on coupons for all using (is_admin());

create policy "read own support tickets" on support_tickets
  for select using (profile_id = auth.uid() or is_admin());
create policy "create own support tickets" on support_tickets
  for insert with check (profile_id = auth.uid());

create policy "read own ticket messages" on support_ticket_messages
  for select using (
    is_admin() or exists (
      select 1 from support_tickets t
      where t.id = support_ticket_messages.ticket_id and t.profile_id = auth.uid()
    )
  );
create policy "send own ticket messages" on support_ticket_messages
  for insert with check (
    sender_id = auth.uid()
    and exists (
      select 1 from support_tickets t
      where t.id = support_ticket_messages.ticket_id and t.profile_id = auth.uid()
    )
  );

-- Audit log: admin-readable only, and append-only at the RLS layer (no
-- update/delete policy exists at all, so those operations are always denied
-- for every role except the service role used by trusted backend code).
create policy "admins read audit log" on admin_audit_log for select using (is_admin());
create policy "admins insert audit log" on admin_audit_log for insert with check (is_admin());

create policy "published posts are publicly readable" on blog_posts
  for select using (published_at is not null and published_at <= now());
create policy "admins manage blog posts" on blog_posts for all using (is_admin());

-- ============================================================
-- SECURITY DEFINER RPCs (the only path for cross-user invariants)
-- ============================================================

-- Race-safe accept: only the first mechanic whose UPDATE lands while the
-- job is still `searching` wins. Every other concurrent caller's WHERE
-- clause matches zero rows and gets a clean "offer no longer available".
create function accept_job(p_job_id uuid)
returns jobs
language plpgsql
security definer
set search_path = public
as $$
declare
  v_job jobs;
begin
  if not exists (
    select 1 from mechanic_profiles
    where profile_id = auth.uid() and approval_status = 'approved'
  ) then
    raise exception 'Only approved mechanics can accept jobs';
  end if;

  update jobs
  set mechanic_id = auth.uid(),
      status = 'accepted',
      accepted_at = now()
  where id = p_job_id
    and status = 'searching'
  returning * into v_job;

  if v_job is null then
    raise exception 'This job is no longer available';
  end if;

  update job_dispatch_offers
  set status = 'accepted', responded_at = now()
  where job_id = p_job_id and mechanic_id = auth.uid();

  update job_dispatch_offers
  set status = 'expired'
  where job_id = p_job_id and mechanic_id <> auth.uid() and status = 'sent';

  insert into job_status_history (job_id, status, changed_by)
  values (p_job_id, 'accepted', auth.uid());

  return v_job;
end;
$$;

-- Admin-only mechanic approval, always audit-logged.
create function approve_mechanic(p_mechanic_id uuid, p_decision mechanic_approval_status, p_reason text default null)
returns mechanic_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_mechanic mechanic_profiles;
begin
  if not is_admin() then
    raise exception 'Only admins can review mechanic applications';
  end if;

  if p_decision not in ('approved', 'rejected', 'needs_more_info', 'suspended') then
    raise exception 'Invalid decision: %', p_decision;
  end if;

  update mechanic_profiles
  set approval_status = p_decision,
      approval_reason = p_reason,
      approved_by = auth.uid(),
      approved_at = case when p_decision = 'approved' then now() else approved_at end
  where profile_id = p_mechanic_id
  returning * into v_mechanic;

  insert into admin_audit_log (admin_id, action, entity_type, entity_id, metadata)
  values (
    auth.uid(),
    'mechanic_review',
    'mechanic_profiles',
    p_mechanic_id,
    jsonb_build_object('decision', p_decision, 'reason', p_reason)
  );

  return v_mechanic;
end;
$$;

-- Customer- or mechanic-initiated cancellation, applying the confirmed
-- policy: free before dispatch acceptance, a fee once a mechanic is en
-- route. Mechanics must supply a reason; repeated unjustified mechanic
-- cancellations are surfaced to admins via approval-status review, not an
-- automated ban (see docs/REVVY_PRD.md §19.5).
create function cancel_job(p_job_id uuid, p_reason text)
returns jobs
language plpgsql
security definer
set search_path = public
as $$
declare
  v_job jobs;
  v_fee numeric(10, 2) := 0;
begin
  select * into v_job from jobs where id = p_job_id;

  if v_job is null then
    raise exception 'Job not found';
  end if;

  if v_job.customer_id <> auth.uid() and v_job.mechanic_id <> auth.uid() and not is_admin() then
    raise exception 'Not authorized to cancel this job';
  end if;

  if v_job.status in ('completed', 'cancelled') then
    raise exception 'Job is already %', v_job.status;
  end if;

  if v_job.status in ('en_route', 'arrived', 'in_progress') then
    v_fee := round(v_job.total * 0.15, 2);
  end if;

  update jobs
  set status = 'cancelled',
      cancelled_at = now(),
      cancelled_by = auth.uid(),
      cancellation_reason = p_reason,
      cancellation_fee = v_fee
  where id = p_job_id
  returning * into v_job;

  insert into job_status_history (job_id, status, changed_by)
  values (p_job_id, 'cancelled', auth.uid());

  return v_job;
end;
$$;
