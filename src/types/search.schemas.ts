import { z } from 'zod';

import { FilmInfoSchema } from './films.schemas';
import type { FilmInfoType } from './films.types';
import { MEDIA_TYPES } from './media.types';
import { SeriesListItemSchema, toMediaItem } from './series.schemas';

const MultiSearchMovieSchema = FilmInfoSchema.extend({
   media_type: z.literal(MEDIA_TYPES.MOVIE),
});

const MultiSearchSeriesSchema = SeriesListItemSchema.extend({
   media_type: z.literal(MEDIA_TYPES.TV),
}).transform(toMediaItem);

/**
 * `/search/multi` also returns people. The app only reaches people through
 * cast lists, so they are parsed to `null` and filtered out below.
 */
const MultiSearchPersonSchema = z
   .object({ media_type: z.literal('person') })
   .transform(() => null);

/**
 * `/search/multi` response: films and series normalised onto the film shape,
 * in TMDB's relevance order, people removed.
 */
export const MultiSearchSchema = z.object({
   results: z
      .array(
         z.union([
            MultiSearchMovieSchema,
            MultiSearchSeriesSchema,
            MultiSearchPersonSchema,
         ])
      )
      .transform((items) =>
         items.filter((item): item is FilmInfoType => item !== null)
      ),
});

export const KeywordSchema = z.object({
   id: z.number(),
   name: z.string(),
});

export type KeywordType = z.infer<typeof KeywordSchema>;

/** `/search/keyword` response. */
export const KeywordSearchSchema = z.object({
   results: z.array(KeywordSchema),
});
