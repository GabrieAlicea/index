-- Revvy — hardening pass based on Supabase's security & performance advisors
-- run against the live project. Addresses:
--   1. mutable search_path on a trigger function (security)
--   2. RPCs callable by roles that should never call them directly (security)
--   3. missing indexes on foreign keys (performance)
--   4. RLS policies re-evaluating auth.uid() per row instead of once per
--      statement — wrap in `(select auth.uid())` so Postgres caches it as
--      an InitPlan (performance, see Supabase docs on RLS performance)
--   5. redundant overlapping permissive policies on the same
--      table/role/action (performance)

-- ============================================================
-- 1. Function hardening
-- ============================================================

create or replace function set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- handle_new_user must only ever run as an auth.users trigger, never as a
-- directly-callable RPC (it dereferences the trigger's implicit `new`
-- record, so a direct call always fails anyway, but there's no reason to
-- leave it reachable via PostgREST at all).
revoke execute on function handle_new_user() from public, anon, authenticated;

-- These mutate state and already re-check authorization internally
-- (auth.uid(), is_admin()), but should not be reachable by anon at all —
-- only signed-in users can ever legitimately call them.
revoke execute on function accept_job(uuid) from anon;
revoke execute on function cancel_job(uuid, text) from anon;
revoke execute on function approve_mechanic(uuid, mechanic_approval_status, text) from anon;

-- ============================================================
-- 2. Missing foreign key indexes
-- ============================================================

create index if not exists admin_audit_log_admin_id_idx on admin_audit_log (admin_id);
create index if not exists blog_posts_author_id_idx on blog_posts (author_id);
create index if not exists customer_profiles_default_address_idx on customer_profiles (default_address_id);
create index if not exists disputes_job_id_idx on disputes (job_id);
create index if not exists disputes_raised_by_idx on disputes (raised_by);
create index if not exists disputes_resolved_by_idx on disputes (resolved_by);
create index if not exists favorite_mechanics_mechanic_id_idx on favorite_mechanics (mechanic_id);
create index if not exists job_location_pings_mechanic_id_idx on job_location_pings (mechanic_id);
create index if not exists job_photos_job_id_idx on job_photos (job_id);
create index if not exists job_photos_uploaded_by_idx on job_photos (uploaded_by);
create index if not exists job_services_service_id_idx on job_services (service_id);
create index if not exists job_status_history_changed_by_idx on job_status_history (changed_by);
create index if not exists jobs_address_id_idx on jobs (address_id);
create index if not exists jobs_cancelled_by_idx on jobs (cancelled_by);
create index if not exists jobs_vehicle_id_idx on jobs (vehicle_id);
create index if not exists mechanic_documents_reviewed_by_idx on mechanic_documents (reviewed_by);
create index if not exists mechanic_profiles_approved_by_idx on mechanic_profiles (approved_by);
create index if not exists mechanic_services_service_id_idx on mechanic_services (service_id);
create index if not exists messages_recipient_id_idx on messages (recipient_id);
create index if not exists messages_sender_id_idx on messages (sender_id);
create index if not exists reviews_reviewer_id_idx on reviews (reviewer_id);
create index if not exists support_ticket_messages_sender_id_idx on support_ticket_messages (sender_id);
create index if not exists support_ticket_messages_ticket_id_idx on support_ticket_messages (ticket_id);
create index if not exists support_tickets_assigned_to_idx on support_tickets (assigned_to);
create index if not exists support_tickets_profile_id_idx on support_tickets (profile_id);

-- ============================================================
-- 3. RLS policy rewrites: wrap auth.uid() so it's evaluated once per
--    statement instead of once per row, and consolidate overlapping
--    permissive policies.
-- ============================================================

drop policy "update own profile" on profiles;
create policy "update own profile" on profiles
  for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy "update own customer profile" on customer_profiles;
create policy "update own customer profile" on customer_profiles
  for update using ((select auth.uid()) = profile_id) with check ((select auth.uid()) = profile_id);

drop policy "mechanics update own non-approval fields" on mechanic_profiles;
create policy "mechanics update own non-approval fields" on mechanic_profiles
  for update using ((select auth.uid()) = profile_id) with check ((select auth.uid()) = profile_id);

drop policy "mechanics upload own documents" on mechanic_documents;
create policy "mechanics upload own documents" on mechanic_documents
  for insert with check ((select auth.uid()) = mechanic_id);

drop policy "customers manage own vehicles" on vehicles;
create policy "customers manage own vehicles" on vehicles
  for all using (is_owner_or_admin(customer_id)) with check ((select auth.uid()) = customer_id);

drop policy "customers manage own addresses" on addresses;
create policy "customers manage own addresses" on addresses
  for all using (is_owner_or_admin(customer_id)) with check ((select auth.uid()) = customer_id);

drop policy "mechanics manage own service pricing" on mechanic_services;
create policy "mechanics manage own service pricing" on mechanic_services
  for insert with check ((select auth.uid()) = mechanic_id);
create policy "mechanics update own service pricing" on mechanic_services
  for update using (is_owner_or_admin(mechanic_id)) with check ((select auth.uid()) = mechanic_id);
create policy "mechanics delete own service pricing" on mechanic_services
  for delete using (is_owner_or_admin(mechanic_id));

-- jobs: consolidate the three overlapping SELECT policies into one so
-- Postgres evaluates a single qual instead of OR-ing three separate
-- permissive policies together on every read of the hottest table in
-- the schema.
drop policy "customers read own jobs" on jobs;
drop policy "mechanics read assigned or offered jobs" on jobs;
drop policy "admins read all jobs" on jobs;
create policy "read own, assigned, offered, or admin" on jobs
  for select using (
    customer_id = (select auth.uid())
    or mechanic_id = (select auth.uid())
    or is_admin()
    or exists (
      select 1 from job_dispatch_offers o
      where o.job_id = jobs.id and o.mechanic_id = (select auth.uid())
    )
  );

drop policy "customers create own jobs" on jobs;
create policy "customers create own jobs" on jobs
  for insert with check (customer_id = (select auth.uid()));

drop policy "customers cancel own pre-dispatch jobs" on jobs;
create policy "customers cancel own pre-dispatch jobs" on jobs
  for update using (
    customer_id = (select auth.uid()) and status in ('draft', 'pending_payment', 'searching', 'scheduled')
  ) with check (customer_id = (select auth.uid()));

drop policy "participants read job services" on job_services;
create policy "participants read job services" on job_services
  for select using (
    exists (
      select 1 from jobs j
      where j.id = job_services.job_id
        and (j.customer_id = (select auth.uid()) or j.mechanic_id = (select auth.uid()) or is_admin())
    )
  );

drop policy "participants read job status history" on job_status_history;
create policy "participants read job status history" on job_status_history
  for select using (
    exists (
      select 1 from jobs j
      where j.id = job_status_history.job_id
        and (j.customer_id = (select auth.uid()) or j.mechanic_id = (select auth.uid()) or is_admin())
    )
  );

drop policy "mechanics read own dispatch offers" on job_dispatch_offers;
create policy "mechanics read own dispatch offers" on job_dispatch_offers
  for select using (mechanic_id = (select auth.uid()) or is_admin());

drop policy "participants read location pings" on job_location_pings;
create policy "participants read location pings" on job_location_pings
  for select using (
    mechanic_id = (select auth.uid())
    or is_admin()
    or exists (
      select 1 from jobs j where j.id = job_location_pings.job_id and j.customer_id = (select auth.uid())
    )
  );

drop policy "mechanics insert own location pings" on job_location_pings;
create policy "mechanics insert own location pings" on job_location_pings
  for insert with check (mechanic_id = (select auth.uid()));

drop policy "participants read job photos" on job_photos;
create policy "participants read job photos" on job_photos
  for select using (
    exists (
      select 1 from jobs j
      where j.id = job_photos.job_id
        and (j.customer_id = (select auth.uid()) or j.mechanic_id = (select auth.uid()) or is_admin())
    )
  );

drop policy "mechanics upload job photos" on job_photos;
create policy "mechanics upload job photos" on job_photos
  for insert with check (
    uploaded_by = (select auth.uid())
    and exists (select 1 from jobs j where j.id = job_photos.job_id and j.mechanic_id = (select auth.uid()))
  );

drop policy "participants read own messages" on messages;
create policy "participants read own messages" on messages
  for select using (sender_id = (select auth.uid()) or recipient_id = (select auth.uid()) or is_admin());

drop policy "participants send messages on their jobs" on messages;
create policy "participants send messages on their jobs" on messages
  for insert with check (
    sender_id = (select auth.uid())
    and exists (
      select 1 from jobs j
      where j.id = messages.job_id and (j.customer_id = (select auth.uid()) or j.mechanic_id = (select auth.uid()))
    )
  );

drop policy "participants read own payments" on payments;
create policy "participants read own payments" on payments
  for select using (
    is_admin() or exists (
      select 1 from jobs j
      where j.id = payments.job_id and (j.customer_id = (select auth.uid()) or j.mechanic_id = (select auth.uid()))
    )
  );

drop policy "mechanics read own payouts" on payouts;
create policy "mechanics read own payouts" on payouts
  for select using (mechanic_id = (select auth.uid()) or is_admin());

drop policy "reviews visible once revealed or to admin" on reviews;
create policy "reviews visible once revealed or to admin" on reviews
  for select using (
    is_admin() or reviewer_id = (select auth.uid()) or (reviewee_id = (select auth.uid()) and visible_at is not null)
  );

drop policy "participants submit one review per job" on reviews;
create policy "participants submit one review per job" on reviews
  for insert with check (
    reviewer_id = (select auth.uid())
    and exists (
      select 1 from jobs j
      where j.id = reviews.job_id
        and j.status = 'completed'
        and (j.customer_id = (select auth.uid()) or j.mechanic_id = (select auth.uid()))
    )
  );

drop policy "customers manage own favorites" on favorite_mechanics;
create policy "customers manage own favorites" on favorite_mechanics
  for all using (customer_id = (select auth.uid())) with check (customer_id = (select auth.uid()));

drop policy "read own notifications" on notifications;
create policy "read own notifications" on notifications
  for select using (profile_id = (select auth.uid()));

drop policy "update own notifications" on notifications;
create policy "update own notifications" on notifications
  for update using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));

drop policy "participants read own disputes" on disputes;
create policy "participants read own disputes" on disputes
  for select using (
    is_admin() or raised_by = (select auth.uid()) or exists (
      select 1 from jobs j
      where j.id = disputes.job_id and (j.customer_id = (select auth.uid()) or j.mechanic_id = (select auth.uid()))
    )
  );

drop policy "participants raise disputes on own jobs" on disputes;
create policy "participants raise disputes on own jobs" on disputes
  for insert with check (
    raised_by = (select auth.uid())
    and exists (
      select 1 from jobs j
      where j.id = disputes.job_id and (j.customer_id = (select auth.uid()) or j.mechanic_id = (select auth.uid()))
    )
  );

drop policy "read own support tickets" on support_tickets;
create policy "read own support tickets" on support_tickets
  for select using (profile_id = (select auth.uid()) or is_admin());

drop policy "create own support tickets" on support_tickets;
create policy "create own support tickets" on support_tickets
  for insert with check (profile_id = (select auth.uid()));

drop policy "read own ticket messages" on support_ticket_messages;
create policy "read own ticket messages" on support_ticket_messages
  for select using (
    is_admin() or exists (
      select 1 from support_tickets t
      where t.id = support_ticket_messages.ticket_id and t.profile_id = (select auth.uid())
    )
  );

drop policy "send own ticket messages" on support_ticket_messages;
create policy "send own ticket messages" on support_ticket_messages
  for insert with check (
    sender_id = (select auth.uid())
    and exists (
      select 1 from support_tickets t
      where t.id = support_ticket_messages.ticket_id and t.profile_id = (select auth.uid())
    )
  );

-- ============================================================
-- 4. Split "admin manages everything" policies so they no longer overlap
--    with the dedicated public/customer SELECT policy on the same table.
-- ============================================================

drop policy "admins manage categories" on service_categories;
create policy "admins insert categories" on service_categories for insert with check (is_admin());
create policy "admins update categories" on service_categories for update using (is_admin());
create policy "admins delete categories" on service_categories for delete using (is_admin());

drop policy "admins manage services" on services;
create policy "admins insert services" on services for insert with check (is_admin());
create policy "admins update services" on services for update using (is_admin());
create policy "admins delete services" on services for delete using (is_admin());

drop policy "admins manage coupons" on coupons;
create policy "admins insert coupons" on coupons for insert with check (is_admin());
create policy "admins update coupons" on coupons for update using (is_admin());
create policy "admins delete coupons" on coupons for delete using (is_admin());

drop policy "admins manage blog posts" on blog_posts;
create policy "admins insert blog posts" on blog_posts for insert with check (is_admin());
create policy "admins update blog posts" on blog_posts for update using (is_admin());
create policy "admins delete blog posts" on blog_posts for delete using (is_admin());
