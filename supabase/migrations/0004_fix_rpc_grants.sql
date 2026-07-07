-- Migration 0003's REVOKE ... FROM anon was a no-op: EXECUTE was granted to
-- PUBLIC at function creation time (Postgres default), and anon inherits
-- through PUBLIC rather than holding a direct grant, so revoking only from
-- `anon` revokes nothing. Revoke from PUBLIC instead, then re-grant to the
-- roles that should actually have it.

revoke execute on function accept_job(uuid) from public;
revoke execute on function cancel_job(uuid, text) from public;
revoke execute on function approve_mechanic(uuid, mechanic_approval_status, text) from public;

grant execute on function accept_job(uuid) to authenticated;
grant execute on function cancel_job(uuid, text) to authenticated;
grant execute on function approve_mechanic(uuid, mechanic_approval_status, text) to authenticated;
