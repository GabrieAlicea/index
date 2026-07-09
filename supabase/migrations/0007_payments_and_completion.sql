-- Approved mechanics can browse unclaimed `searching` jobs directly. This is
-- a manual stand-in for the dispatch wave engine (§8.3, not built yet) —
-- once that exists, job_dispatch_offers rows will scope visibility instead
-- and this broad policy should be narrowed or removed.
create policy "approved mechanics browse searching jobs" on jobs
  for select using (
    status = 'searching'
    and exists (
      select 1 from mechanic_profiles mp
      where mp.profile_id = (select auth.uid()) and mp.approval_status = 'approved'
    )
  );

-- Payments need an INSERT policy (0002 only ever added SELECT) so the
-- booking Server Action can record the authorized PaymentIntent against the
-- job it belongs to. Amounts are always server-computed before this insert
-- runs (see app/(booking)/book/actions.ts) — RLS here only guards *whose*
-- job a payment can be attached to, not the amount.
create policy "customers insert own job payments" on payments
  for insert with check (
    exists (
      select 1 from jobs j
      where j.id = payments.job_id and j.customer_id = (select auth.uid())
    )
  );

-- Job completion is a cross-cutting state change (job status, payment
-- capture bookkeeping, payout record) that must happen atomically and only
-- for the assigned mechanic — the same "security definer RPC, not an open
-- UPDATE policy" pattern as accept_job/cancel_job. The actual Stripe
-- capture + Transfer calls happen in the calling Server Action (Postgres
-- can't make HTTP calls); this RPC only runs after those succeed, recording
-- the outcome.
create function complete_job(
  p_job_id uuid,
  p_stripe_transfer_id text default null
)
returns jobs
language plpgsql
security definer
set search_path = public
as $$
declare
  v_job jobs;
begin
  select * into v_job from jobs where id = p_job_id;

  if v_job is null then
    raise exception 'Job not found';
  end if;

  if v_job.mechanic_id <> auth.uid() and not is_admin() then
    raise exception 'Only the assigned mechanic can complete this job';
  end if;

  if v_job.status not in ('accepted', 'en_route', 'arrived', 'in_progress') then
    raise exception 'Job cannot be completed from status %', v_job.status;
  end if;

  update jobs
  set status = 'completed', completed_at = now()
  where id = p_job_id
  returning * into v_job;

  insert into job_status_history (job_id, status, changed_by)
  values (p_job_id, 'completed', auth.uid());

  update payments
  set status = 'captured', captured_at = now()
  where job_id = p_job_id;

  if p_stripe_transfer_id is not null then
    insert into payouts (mechanic_id, stripe_transfer_id, amount, period_start, period_end, status)
    select v_job.mechanic_id, p_stripe_transfer_id, p.mechanic_payout_amount, current_date, current_date, 'paid'
    from payments p
    where p.job_id = p_job_id;
  end if;

  update mechanic_profiles
  set jobs_completed = jobs_completed + 1
  where profile_id = v_job.mechanic_id;

  return v_job;
end;
$$;

-- Grant hardening for this function lives in 0008, not here: Supabase
-- appears to re-apply its default anon/authenticated EXECUTE grants right
-- after a CREATE FUNCTION lands, so a REVOKE in the same migration as the
-- CREATE is a no-op (confirmed via has_function_privilege) — it only
-- sticks as a separate, later migration.
