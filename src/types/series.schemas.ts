import { z } from 'zod';

import {
   GenreSchema,
   ProductionCompanySchema,
   SpokenLanguageSchema,
} from './films.schemas';
import type { FilmInfoType, FilmRecommendationType } from './films.types';
import { MEDIA_TYPES } from './media.types';

/**
 * Raw TMDB `/tv/...` list item. TV uses `name` / `first_air_date` where
 * movies use `title` / `release_date`, so we normalise it below.
 */
export const SeriesListItemSchema = z.object({
   id: z.number(),
   name: z.string(),
   original_name: z.string(),
   original_language: z.string().optional(),
   overview: z.string(),
   backdrop_path: z.string().nullable(),
   poster_path: z.string().nullable(),
   first_air_date: z.string().nullable().optional(),
   vote_average: z.number().optional(),
   vote_count: z.number().optional(),
   popularity: z.number().optional(),
});

/**
 * Maps a TMDB TV list item onto the film shape so FilmList, FilmCard and
 * FilmTable can render series without knowing about TV field names.
 */
export const toMediaItem = (
   series: z.infer<typeof SeriesListItemSchema>
): FilmInfoType => ({
   id: series.id,
   media_type: MEDIA_TYPES.TV,
   title: series.name,
   original_title: series.original_name,
   original_language: series.original_language,
   overview: series.overview,
   backdrop_path: series.backdrop_path,
   poster_path: series.poster_path,
   release_date: series.first_air_date ?? '',
   vote_average: series.vote_average,
   vote_count: series.vote_count,
   popularity: series.popularity,
});

export const SeriesListSchema = z.object({
   results: z.array(SeriesListItemSchema.transform(toMediaItem)),
});

const CreatorSchema = z.object({
   id: z.number(),
   name: z.string(),
   profile_path: z.string().nullable(),
});

const NetworkSchema = z.object({
   id: z.number(),
   name: z.string(),
   logo_path: z.string().nullable(),
   origin_country: z.string(),
});

export const SeasonSchema = z.object({
   id: z.number(),
   name: z.string(),
   season_number: z.number(),
   episode_count: z.number(),
   air_date: z.string().nullable(),
   poster_path: z.string().nullable(),
   overview: z.string(),
});

/**
 * TMDB `/tv/{id}` detail. Fetched with `append_to_response=external_ids`
 * because, unlike movies, the TV detail payload has no top-level `imdb_id`.
 */
export const SeriesInfoSchema = z.object({
   id: z.number(),
   name: z.string(),
   original_name: z.string(),
   original_language: z.string().optional(),
   overview: z.string(),
   backdrop_path: z.string().nullable(),
   poster_path: z.string().nullable(),
   first_air_date: z.string().nullable(),
   last_air_date: z.string().nullable().optional(),
   vote_average: z.number().optional(),
   vote_count: z.number().optional(),
   popularity: z.number().optional(),
   tagline: z.string().optional().nullable(),
   homepage: z.string().optional().nullable(),
   status: z.string().optional(),
   type: z.string().optional(),
   in_production: z.boolean().optional(),
   number_of_seasons: z.number().optional(),
   number_of_episodes: z.number().optional(),
   episode_run_time: z.array(z.number()).optional(),
   genres: z.array(GenreSchema).optional(),
   created_by: z.array(CreatorSchema).optional(),
   networks: z.array(NetworkSchema).optional(),
   production_companies: z.array(ProductionCompanySchema).optional(),
   spoken_languages: z.array(SpokenLanguageSchema).optional(),
   seasons: z.array(SeasonSchema).optional(),
   external_ids: z
      .object({ imdb_id: z.string().nullable().optional() })
      .optional(),
});

export const EpisodeSchema = z.object({
   id: z.number(),
   name: z.string(),
   overview: z.string(),
   air_date: z.string().nullable(),
   episode_number: z.number(),
   season_number: z.number(),
   still_path: z.string().nullable(),
   vote_average: z.number().optional(),
   vote_count: z.number().optional(),
   runtime: z.number().nullable().optional(),
});

/** TMDB `/tv/{id}/season/{n}`: the season header plus every episode. */
export const SeasonDetailSchema = z.object({
   id: z.number(),
   name: z.string(),
   overview: z.string(),
   air_date: z.string().nullable(),
   poster_path: z.string().nullable(),
   season_number: z.number(),
   vote_average: z.number().optional(),
   episodes: z.array(EpisodeSchema),
});

const SeriesRecommendationItemSchema = z.object({
   id: z.number(),
   name: z.string(),
   poster_path: z.string().nullable(),
   first_air_date: z.string().nullable().optional(),
   vote_average: z.number().optional(),
});

export const SeriesRecommendationsSchema = z.object({
   results: z.array(
      SeriesRecommendationItemSchema.transform(
         (series): FilmRecommendationType => ({
            id: series.id,
            media_type: MEDIA_TYPES.TV,
            title: series.name,
            poster_path: series.poster_path,
            release_date: series.first_air_date ?? '',
            vote_average: series.vote_average,
         })
      )
   ),
});
