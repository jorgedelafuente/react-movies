import {
   FAVORITE_STATUSES,
   type FavoriteStatus,
} from '@/types/favorites.types';
import { MEDIA_TYPES, type MediaType } from '@/types/media.types';

import { supabase } from './supabaseClient';

export type FavoriteRow = {
   id: string;
   user_id: string;
   film_id: number;
   media_type: MediaType;
   created_at: string;
   film_title: string;
   film_poster_path: string | null;
   film_release_date: string;
   status: FavoriteStatus;
   watched_at: string | null;
};

/** Everything needed to save a film or series as a favorite. */
export type FavoriteInput = {
   filmId: number;
   mediaType: MediaType;
   filmTitle: string;
   filmPosterPath: string | null;
   filmReleaseDate: string;
};

type FavoritesError = {
   message: string;
   code?: string;
};

/**
 * Rows written before the `media_type` column existed are films, and rows
 * written before `status` existed are plain bookmarks.
 */
const normalizeRow = (
   row: Partial<FavoriteRow> & FavoriteRow
): FavoriteRow => ({
   ...row,
   media_type: row.media_type ?? MEDIA_TYPES.MOVIE,
   status: row.status ?? FAVORITE_STATUSES.SAVED,
   watched_at: row.watched_at ?? null,
});

export const getUserFavorites = async (
   userId: string
): Promise<{ data: FavoriteRow[]; error: FavoritesError | null }> => {
   try {
      const { data, error } = await supabase
         .from('favorites')
         .select('*')
         .eq('user_id', userId);

      if (error)
         return {
            data: [],
            error: { message: error.message, code: error.code },
         };
      return { data: (data ?? []).map(normalizeRow), error: null };
   } catch (err) {
      return {
         data: [],
         error: {
            message: err instanceof Error ? err.message : 'Unknown error',
         },
      };
   }
};

export const addFavorite = async (
   userId: string,
   {
      filmId,
      mediaType,
      filmTitle,
      filmPosterPath,
      filmReleaseDate,
   }: FavoriteInput
): Promise<{ data: FavoriteRow | null; error: FavoritesError | null }> => {
   try {
      const { data, error } = await supabase
         .from('favorites')
         .insert({
            user_id: userId,
            film_id: filmId,
            media_type: mediaType,
            film_title: filmTitle,
            film_poster_path: filmPosterPath,
            film_release_date: filmReleaseDate,
         })
         .select()
         .single();

      if (error)
         return {
            data: null,
            error: { message: error.message, code: error.code },
         };
      return { data: normalizeRow(data), error: null };
   } catch (err) {
      return {
         data: null,
         error: {
            message: err instanceof Error ? err.message : 'Unknown error',
         },
      };
   }
};

export const updateFavoriteStatus = async (
   userId: string,
   filmId: number,
   mediaType: MediaType,
   status: FavoriteStatus
): Promise<{ data: FavoriteRow | null; error: FavoritesError | null }> => {
   try {
      const { data, error } = await supabase
         .from('favorites')
         .update({
            status,
            watched_at:
               status === FAVORITE_STATUSES.WATCHED
                  ? new Date().toISOString()
                  : null,
         })
         .eq('user_id', userId)
         .eq('film_id', filmId)
         .eq('media_type', mediaType)
         .select()
         .single();

      if (error)
         return {
            data: null,
            error: { message: error.message, code: error.code },
         };
      return { data: normalizeRow(data), error: null };
   } catch (err) {
      return {
         data: null,
         error: {
            message: err instanceof Error ? err.message : 'Unknown error',
         },
      };
   }
};

export const removeFavorite = async (
   userId: string,
   filmId: number,
   mediaType: MediaType
): Promise<{ error: FavoritesError | null }> => {
   try {
      const { error } = await supabase
         .from('favorites')
         .delete()
         .eq('user_id', userId)
         .eq('film_id', filmId)
         .eq('media_type', mediaType);

      if (error) return { error: { message: error.message, code: error.code } };
      return { error: null };
   } catch (err) {
      return {
         error: {
            message: err instanceof Error ? err.message : 'Unknown error',
         },
      };
   }
};
