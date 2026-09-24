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

/** Rows written before the `media_type` column existed are films. */
const normalizeRow = (
   row: Partial<FavoriteRow> & FavoriteRow
): FavoriteRow => ({
   ...row,
   media_type: row.media_type ?? MEDIA_TYPES.MOVIE,
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
