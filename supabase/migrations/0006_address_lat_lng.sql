-- Plain numeric lat/lng alongside the PostGIS `location` geography column.
-- `location` stays the source of truth for spatial queries (ST_DWithin
-- dispatch radius searches); lat/lng exist purely so the frontend map can
-- read coordinates directly via PostgREST without needing ST_X/ST_Y
-- extraction, which isn't expressible through a plain select() call.

alter table addresses add column if not exists lat numeric;
alter table addresses add column if not exists lng numeric;
