import { z } from 'zod';

/** One entry from TMDB's `/movie/{id}/images` or `/tv/{id}/images`. */
export const TmdbImageSchema = z.object({
   file_path: z.string(),
   width: z.number(),
   height: z.number(),
   aspect_ratio: z.number(),
   /** Language of any text baked into the image; `null` means textless. */
   iso_639_1: z.string().nullable(),
   vote_average: z.number(),
   vote_count: z.number(),
});

/** Movies and series share this shape, so one schema serves both. */
export const MediaImagesSchema = z.object({
   id: z.number(),
   backdrops: z.array(TmdbImageSchema),
   posters: z.array(TmdbImageSchema),
   logos: z.array(TmdbImageSchema).optional(),
});

export const GALLERY_BACKDROP_LIMIT = 12;

/**
 * Picks the backdrops worth showing in the detail-page gallery: best voted
 * first, ties broken by vote count, capped so the section stays scannable.
 */
export const pickGalleryBackdrops = (
   backdrops: z.infer<typeof TmdbImageSchema>[],
   limit = GALLERY_BACKDROP_LIMIT
) =>
   [...backdrops]
      .sort(
         (a, b) =>
            b.vote_average - a.vote_average || b.vote_count - a.vote_count
      )
      .slice(0, limit);

export type TmdbImageType = z.infer<typeof TmdbImageSchema>;
export type MediaImagesType = z.infer<typeof MediaImagesSchema>;
