-- See the note at the end of 0007: revoking EXECUTE in the same migration
-- that creates the function doesn't stick on this project (Supabase
-- appears to re-apply default anon/authenticated grants right after the
-- CREATE FUNCTION lands). Doing it as a separate, later migration works —
-- verified live via has_function_privilege().
revoke execute on function complete_job(uuid, text) from public, anon;
grant execute on function complete_job(uuid, text) to authenticated;
