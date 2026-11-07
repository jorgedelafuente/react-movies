-- Give every favorite a watch status so `/favorites` can split into Saved,
-- Watchlist and Seen sections.
--
-- 1. `status` defaults to 'saved', so every existing row keeps meaning
--    "bookmarked, not yet planned" and nothing needs backfilling. The check
--    constraint is dropped before it is added so the migration re-runs clean.
--
-- 2. `watched_at` is stamped by the client when a row moves to 'watched' and
--    cleared when it moves back out. It is nullable because the other two
--    statuses have no timestamp.
--
-- 3. The table had no UPDATE policy, only SELECT, INSERT and DELETE, so
--    changing a status would have been rejected by RLS. UPDATE needs both
--    `using` (which rows may be targeted) and `with check` (what they may be
--    changed into); without the second a user could reassign a row's
--    `user_id` to someone else.
--
-- Applied with the Supabase MCP `apply_migration`, or paste into the SQL
-- editor. Safe to re-run.

alter table public.favorites
   add column if not exists status text not null default 'saved';

alter table public.favorites
   add column if not exists watched_at timestamptz;

alter table public.favorites
   drop constraint if exists favorites_status_check;
alter table public.favorites
   add constraint favorites_status_check
   check (status in ('saved', 'watch_next', 'watched'));

drop policy if exists "Users can update their own favorites" on public.favorites;
create policy "Users can update their own favorites"
   on public.favorites
   for update
   to authenticated
   using ((select auth.uid()) = user_id)
   with check ((select auth.uid()) = user_id);

-- Verify:
--   select column_name, data_type, is_nullable, column_default
--     from information_schema.columns
--    where table_name = 'favorites' and column_name in ('status', 'watched_at');
--   select conname, pg_get_constraintdef(oid) from pg_constraint
--    where conrelid = 'public.favorites'::regclass and conname = 'favorites_status_check';
--   select policyname, cmd, roles, qual, with_check
--     from pg_policies where tablename = 'favorites';
