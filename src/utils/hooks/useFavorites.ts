import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { userFavoritesQueryOptions } from '@/services/favorites/favoritesQueryOptions';
import {
   addFavorite,
   type FavoriteInput,
   type FavoriteRow,
   removeFavorite,
} from '@/services/supabase/favorites';
import type { MediaType } from '@/types/media.types';

import { useAuth } from './useAuth';

type FavoriteKey = Pick<FavoriteInput, 'filmId' | 'mediaType'>;

export const useFavorites = () => {
   const user = useAuth((s) => s.user);
   const userId = user?.id ?? '';
   const queryClient = useQueryClient();
   const queryOpts = userFavoritesQueryOptions(userId);

   const { data: favoritesResult, isLoading } = useQuery(queryOpts);
   const favorites = favoritesResult?.data ?? [];

   const isFavorited = (filmId: number, mediaType: MediaType): boolean =>
      favorites.some((f) => f.film_id === filmId && f.media_type === mediaType);

   const addMutation = useMutation({
      mutationFn: (favorite: FavoriteInput) => addFavorite(userId, favorite),
      onMutate: async ({
         filmId,
         mediaType,
         filmTitle,
         filmPosterPath,
         filmReleaseDate,
      }) => {
         await queryClient.cancelQueries({ queryKey: queryOpts.queryKey });
         const previous = queryClient.getQueryData(queryOpts.queryKey);
         queryClient.setQueryData(queryOpts.queryKey, (old) => ({
            data: [
               ...(old?.data ?? []),
               {
                  id: 'optimistic',
                  user_id: userId,
                  film_id: filmId,
                  media_type: mediaType,
                  created_at: new Date().toISOString(),
                  film_title: filmTitle,
                  film_poster_path: filmPosterPath,
                  film_release_date: filmReleaseDate,
               } satisfies FavoriteRow,
            ],
            error: null,
         }));
         return { previous };
      },
      onError: (_err, _favorite, context) => {
         queryClient.setQueryData(queryOpts.queryKey, context?.previous);
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: queryOpts.queryKey });
      },
   });

   const removeMutation = useMutation({
      mutationFn: ({ filmId, mediaType }: FavoriteKey) =>
         removeFavorite(userId, filmId, mediaType),
      onMutate: async ({ filmId, mediaType }) => {
         await queryClient.cancelQueries({ queryKey: queryOpts.queryKey });
         const previous = queryClient.getQueryData(queryOpts.queryKey);
         queryClient.setQueryData(queryOpts.queryKey, (old) => ({
            data: (old?.data ?? []).filter(
               (f) => !(f.film_id === filmId && f.media_type === mediaType)
            ),
            error: null,
         }));
         return { previous };
      },
      onError: (_err, _key, context) => {
         queryClient.setQueryData(queryOpts.queryKey, context?.previous);
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: queryOpts.queryKey });
      },
   });

   const toggle = (favorite: FavoriteInput) => {
      if (!userId) return;
      if (isFavorited(favorite.filmId, favorite.mediaType)) {
         removeMutation.mutate({
            filmId: favorite.filmId,
            mediaType: favorite.mediaType,
         });
      } else {
         addMutation.mutate(favorite);
      }
   };

   return {
      favorites,
      isLoading,
      isFavorited,
      toggle,
      isPending: addMutation.isPending || removeMutation.isPending,
   };
};
