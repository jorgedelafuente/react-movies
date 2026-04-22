import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { userFavoritesQueryOptions } from '@/services/favorites/favoritesQueryOptions';
import {
   addFavorite,
   type FavoriteRow,
   removeFavorite,
} from '@/services/supabase/favorites';

import { useAuth } from './useAuth';

export const useFavorites = () => {
   const user = useAuth((s) => s.user);
   const userId = user?.id ?? '';
   const queryClient = useQueryClient();
   const queryOpts = userFavoritesQueryOptions(userId);

   const { data: favoritesResult, isLoading } = useQuery(queryOpts);
   const favorites = favoritesResult?.data ?? [];

   const isFavorited = (filmId: number): boolean =>
      favorites.some((f) => f.film_id === filmId);

   const addMutation = useMutation({
      mutationFn: (filmId: number) => addFavorite(userId, filmId),
      onMutate: async (filmId) => {
         await queryClient.cancelQueries({ queryKey: queryOpts.queryKey });
         const previous = queryClient.getQueryData(queryOpts.queryKey);
         queryClient.setQueryData(queryOpts.queryKey, (old) => ({
            data: [
               ...(old?.data ?? []),
               {
                  id: 'optimistic',
                  user_id: userId,
                  film_id: filmId,
                  created_at: new Date().toISOString(),
               } satisfies FavoriteRow,
            ],
            error: null,
         }));
         return { previous };
      },
      onError: (_err, _filmId, context) => {
         queryClient.setQueryData(queryOpts.queryKey, context?.previous);
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: queryOpts.queryKey });
      },
   });

   const removeMutation = useMutation({
      mutationFn: (filmId: number) => removeFavorite(userId, filmId),
      onMutate: async (filmId) => {
         await queryClient.cancelQueries({ queryKey: queryOpts.queryKey });
         const previous = queryClient.getQueryData(queryOpts.queryKey);
         queryClient.setQueryData(queryOpts.queryKey, (old) => ({
            data: (old?.data ?? []).filter((f) => f.film_id !== filmId),
            error: null,
         }));
         return { previous };
      },
      onError: (_err, _filmId, context) => {
         queryClient.setQueryData(queryOpts.queryKey, context?.previous);
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: queryOpts.queryKey });
      },
   });

   const toggle = (filmId: number) => {
      if (!userId) return;
      if (isFavorited(filmId)) {
         removeMutation.mutate(filmId);
      } else {
         addMutation.mutate(filmId);
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
