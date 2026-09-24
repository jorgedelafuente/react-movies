-- Tighten the favorites RLS policies and lock down the RLS helper function.
--
-- 1. Policies: `auth.uid() = user_id` is re-evaluated for every row Postgres
--    scans. Wrapping the call as `(select auth.uid())` turns it into an init
--    plan that runs once per query. The policies are also restricted to the
--    `authenticated` role so they are not evaluated at all for anonymous
--    requests, which are denied either way because auth.uid() is null.
--    Flagged by the Supabase performance advisor (auth_rls_initplan).
--
-- 2. `public.rls_auto_enable()` is the event-trigger function that switches
--    RLS on for every new table. It is SECURITY DEFINER and was executable by
--    anon and authenticated through /rest/v1/rpc. Postgres refuses direct
--    calls to trigger functions, so nothing was exploitable, but the security
--    advisor flags it. Event triggers run without an EXECUTE check, and the
--    postgres and service_role grants are kept, so the trigger keeps working.
--
-- Applied with the Supabase MCP `apply_migration`, or paste into the SQL
-- editor. Safe to re-run.

drop policy if exists "Users can view their own favorites" on public.favorites;
create policy "Users can view their own favorites"
   on public.favorites
   for select
   to authenticated
   using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own favorites" on public.favorites;
create policy "Users can insert their own favorites"
   on public.favorites
   for insert
   to authenticated
   with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own favorites" on public.favorites;
create policy "Users can delete their own favorites"
   on public.favorites
   for delete
   to authenticated
   using ((select auth.uid()) = user_id);

revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- Verify:
--   select policyname, roles, qual, with_check
--     from pg_policies where tablename = 'favorites';
--   select grantee, privilege_type from information_schema.routine_privileges
--    where routine_schema = 'public' and routine_name = 'rls_auto_enable';
