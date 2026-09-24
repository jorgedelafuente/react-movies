-- Add a media_type discriminator to favorites.
--
-- TMDB movie ids and TV ids are separate namespaces, so id 1399 is a film in
-- one and Game of Thrones in the other. Uniqueness must therefore be on
-- (user_id, film_id, media_type), not (user_id, film_id).
--
-- Existing rows were all films, so the default backfills them correctly.
-- RLS policies are row-based and are unaffected by adding a column.
--
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)
-- or with `supabase db push` if you adopt the CLI later.

alter table public.favorites
   add column if not exists media_type text not null default 'movie';

alter table public.favorites
   drop constraint if exists favorites_media_type_check;

alter table public.favorites
   add constraint favorites_media_type_check
   check (media_type in ('movie', 'tv'));

-- Drop any existing UNIQUE constraint that covers exactly (user_id, film_id),
-- whatever it was named, so the same TMDB id can be saved once per media type.
do $$
declare
   old_constraint text;
begin
   select con.conname
     into old_constraint
     from pg_constraint con
     join pg_class rel on rel.oid = con.conrelid
     join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'favorites'
      and con.contype = 'u'
      and (
         select array_agg(att.attname::text order by att.attname)
           from unnest(con.conkey) as k(attnum)
           join pg_attribute att
             on att.attrelid = con.conrelid and att.attnum = k.attnum
      ) = array['film_id', 'user_id']::text[];

   if old_constraint is not null then
      execute format(
         'alter table public.favorites drop constraint %I',
         old_constraint
      );
   end if;
end $$;

alter table public.favorites
   drop constraint if exists favorites_user_film_media_unique;

alter table public.favorites
   add constraint favorites_user_film_media_unique
   unique (user_id, film_id, media_type);

-- Verify:
--   select column_name, data_type, column_default
--     from information_schema.columns
--    where table_name = 'favorites' and column_name = 'media_type';
