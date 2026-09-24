import { z } from 'zod';

import {
   FilmInfoSchema,
   type FilmInfoType,
   MediaTypeSchema,
} from './films.schemas';
import { MEDIA_TYPES, type MediaType } from './media.types';
import { SeriesListItemSchema, toMediaItem } from './series.schemas';

export const DISCOVER_SORTS = {
   POPULAR: 'popular',
   RATING: 'rating',
   NEWEST: 'newest',
   REVENUE: 'revenue',
} as const;

export type DiscoverSort = (typeof DISCOVER_SORTS)[keyof typeof DISCOVER_SORTS];

export const DISCOVER_SORT_LABELS: Record<DiscoverSort, string> = {
   [DISCOVER_SORTS.POPULAR]: 'Most popular',
   [DISCOVER_SORTS.RATING]: 'Highest rated',
   [DISCOVER_SORTS.NEWEST]: 'Newest',
   [DISCOVER_SORTS.REVENUE]: 'Highest grossing',
};

/** Sorts that only make sense for one media type. */
export const MOVIE_ONLY_SORTS: ReadonlySet<DiscoverSort> = new Set([
   DISCOVER_SORTS.REVENUE,
]);

export const DISCOVER_MIN_YEAR = 1900;
export const DISCOVER_MAX_PAGE = 500; // TMDB hard limit

/**
 * TMDB watch-provider ids (`/watch/providers/{type}`) for the services that
 * operate in nearly every region. Ids are global; availability is looked up
 * in the visitor's region, so region-locked services (Hulu, Peacock) are left
 * out rather than returning empty lists abroad.
 */
export const STREAMING_PROVIDERS = [
   { id: 350, name: 'Apple TV' },
   { id: 337, name: 'Disney+' },
   { id: 1899, name: 'HBO Max' },
   { id: 8, name: 'Netflix' },
   { id: 9, name: 'Prime Video' },
] as const;

export type StreamingProviderId = (typeof STREAMING_PROVIDERS)[number]['id'];

const STREAMING_PROVIDER_IDS: StreamingProviderId[] = STREAMING_PROVIDERS.map(
   (p) => p.id
);

/**
 * URL search params for `/discover`. Every field is optional and falls back
 * silently on bad input so a hand-edited URL never throws.
 */
export const DiscoverSearchSchema = z.object({
   type: MediaTypeSchema.optional().catch(undefined),
   genre: z.number().int().positive().optional().catch(undefined),
   keyword: z.number().int().positive().optional().catch(undefined),
   sort: z.enum(DISCOVER_SORTS).optional().catch(undefined),
   provider: z.literal(STREAMING_PROVIDER_IDS).optional().catch(undefined),
   year: z
      .number()
      .int()
      .min(DISCOVER_MIN_YEAR)
      .max(new Date().getFullYear() + 1)
      .optional()
      .catch(undefined),
   page: z
      .number()
      .int()
      .min(1)
      .max(DISCOVER_MAX_PAGE)
      .optional()
      .catch(undefined),
});

export type DiscoverSearch = z.infer<typeof DiscoverSearchSchema>;

export type DiscoverParams = {
   type: MediaType;
   genre?: number;
   keyword?: number;
   sort: DiscoverSort;
   provider?: StreamingProviderId;
   year?: number;
   page: number;
};

/** Fills in defaults and drops sorts that don't apply to the chosen type. */
export const resolveDiscoverSearch = (
   search: DiscoverSearch
): DiscoverParams => {
   const type = search.type ?? MEDIA_TYPES.MOVIE;
   const requested = search.sort ?? DISCOVER_SORTS.POPULAR;
   const sort =
      type !== MEDIA_TYPES.MOVIE && MOVIE_ONLY_SORTS.has(requested)
         ? DISCOVER_SORTS.POPULAR
         : requested;
   return {
      type,
      genre: search.genre,
      keyword: search.keyword,
      sort,
      provider: search.provider,
      year: search.year,
      page: search.page ?? 1,
   };
};

const pageFields = {
   page: z.number(),
   total_pages: z.number(),
   total_results: z.number(),
};

export const DiscoverMoviesSchema = z.object({
   ...pageFields,
   results: z.array(FilmInfoSchema),
});

export const DiscoverSeriesSchema = z.object({
   ...pageFields,
   results: z.array(SeriesListItemSchema.transform(toMediaItem)),
});

export type DiscoverPage = {
   page: number;
   total_pages: number;
   total_results: number;
   results: FilmInfoType[];
};
