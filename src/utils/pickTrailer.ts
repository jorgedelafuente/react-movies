import type { FilmVideoType } from '@/types/films.schemas';

/** TMDB video `type` / `name` values the detail pages care about. */
export const VIDEO_TYPES = {
   TRAILER: 'Trailer',
   OFFICIAL_TRAILER: 'Official Trailer',
   FINAL_TRAILER: 'Final Trailer',
} as const;

/**
 * Choose the one video a detail page embeds from a TMDB `/videos` response.
 * Only entries typed `Trailer` count (teasers, clips and featurettes are
 * skipped); among those a "Final Trailer" or "Official Trailer" wins, otherwise
 * the first trailer in API order. Returns `undefined` when there is none.
 */
export const pickTrailer = (
   videos: readonly FilmVideoType[]
): FilmVideoType | undefined => {
   const trailers = videos.filter((item) => item.type === VIDEO_TYPES.TRAILER);
   return (
      trailers.find(
         (item) =>
            item.name === VIDEO_TYPES.FINAL_TRAILER ||
            item.name === VIDEO_TYPES.OFFICIAL_TRAILER
      ) ?? trailers[0]
   );
};
