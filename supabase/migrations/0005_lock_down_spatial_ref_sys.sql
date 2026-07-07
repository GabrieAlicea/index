-- spatial_ref_sys is PostGIS's built-in table of ~8500 coordinate reference
-- system definitions (not Revvy data). It has no owner/tenant column and is
-- pure reference data, but the linter correctly flags that RLS was off,
-- meaning anon/authenticated could theoretically write to it via PostgREST.
-- Lock it to read-only for everyone; nothing in the app ever writes to it.
--
-- NOTE: applied to migrations 0001-0004 live on the "revvy" Supabase project
-- (zqjimtteytdugfaqyatv) during this session; this one has NOT been applied
-- yet — the Supabase MCP tool started erroring ("tool call requires
-- approval") right as this migration was being sent. Run it via the SQL
-- editor or `supabase db push` once you're able.

alter table spatial_ref_sys enable row level security;

create policy "spatial_ref_sys is publicly readable"
  on spatial_ref_sys for select using (true);
