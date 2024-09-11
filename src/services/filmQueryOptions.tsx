import { queryOptions } from '@tanstack/react-query';
import { fetchFilm } from './films';

export const postQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ['posts', { postId }],
    queryFn: () => fetchFilm(postId),
  });
