import { z } from 'zod';

import { MEDIA_TYPES } from './media.types';

/** Discriminates TMDB movies from TV series; the two id spaces overlap. */
export const MediaTypeSchema = z.enum(MEDIA_TYPES);

export const GenreSchema = z.object({
   id: z.number(),
   name: z.string(),
});

export const ProductionCompanySchema = z.object({
   id: z.number(),
   logo_path: z.string().nullable(),
   name: z.string(),
   origin_country: z.string(),
});

export const SpokenLanguageSchema = z.object({
   english_name: z.string(),
   iso_639_1: z.string(),
   name: z.string(),
});

export const GenreListSchema = z.object({
   genres: z.array(GenreSchema),
});

/**
 * One entry from `/movie/{id}/release_dates`. `type` is TMDB's release kind:
 * 1 premiere, 2 limited theatrical, 3 theatrical, 4 digital, 5 physical, 6 TV.
 */
export const ReleaseDateSchema = z.object({
   certification: z.string(),
   iso_639_1: z.string().optional(),
   release_date: z.string(),
   type: z.number(),
   note: z.string().optional(),
});

export const ReleaseDatesByCountrySchema = z.object({
   iso_3166_1: z.string(),
   release_dates: z.array(ReleaseDateSchema),
});

export const FilmInfoSchema = z.object({
   id: z.number(),
   media_type: MediaTypeSchema.default(MEDIA_TYPES.MOVIE),
   title: z.string(),
   original_title: z.string(),
   original_language: z.string().optional(),
   overview: z.string(),
   backdrop_path: z.string().nullable(),
   poster_path: z.string().nullable(),
   release_date: z.string(),
   vote_average: z.number().optional(),
   vote_count: z.number().optional(),
   popularity: z.number().optional(),
   tagline: z.string().optional().nullable(),
   homepage: z.string().optional().nullable(),
   imdb_id: z.string().optional().nullable(),
   runtime: z.number().optional().nullable(),
   status: z.string().optional(),
   budget: z.number().optional(),
   revenue: z.number().optional(),
   genres: z.array(GenreSchema).optional(),
   production_companies: z.array(ProductionCompanySchema).optional(),
   spoken_languages: z.array(SpokenLanguageSchema).optional(),
   /** Present on the detail endpoint via `append_to_response=release_dates`. */
   release_dates: z
      .object({ results: z.array(ReleaseDatesByCountrySchema) })
      .optional(),
});

export const FilmListSchema = z.object({
   results: z.array(FilmInfoSchema),
});

export const FilmVideoTypeSchema = z.object({
   site: z.string(),
   type: z.string(),
   name: z.string(),
   key: z.string(),
});

export const FilmVideoListSchema = z.object({
   results: z.array(FilmVideoTypeSchema),
});

export const CastMemberSchema = z.object({
   id: z.number(),
   name: z.string(),
   character: z.string(),
   profile_path: z.string().nullable(),
   order: z.number(),
});

export const CrewMemberSchema = z.object({
   id: z.number(),
   name: z.string(),
   job: z.string(),
   department: z.string(),
   profile_path: z.string().nullable(),
});

export const FilmCreditsSchema = z.object({
   cast: z.array(CastMemberSchema),
   crew: z.array(CrewMemberSchema),
});

export const FilmRecommendationsSchema = z.object({
   results: z.array(
      z.object({
         id: z.number(),
         media_type: MediaTypeSchema.default(MEDIA_TYPES.MOVIE),
         title: z.string(),
         poster_path: z.string().nullable(),
         release_date: z.string(),
         vote_average: z.number().optional(),
      })
   ),
});

export type FilmInfoType = z.infer<typeof FilmInfoSchema>;
export type FilmList = z.infer<typeof FilmListSchema>;
export type FilmVideoType = z.infer<typeof FilmVideoTypeSchema>;
export type FilmVideoList = z.infer<typeof FilmVideoListSchema>;
export type FilmCreditsType = z.infer<typeof FilmCreditsSchema>;
export type CastMemberType = z.infer<typeof CastMemberSchema>;
export type CrewMemberType = z.infer<typeof CrewMemberSchema>;
export type FilmRecommendationType = z.infer<
   typeof FilmRecommendationsSchema
>['results'][number];
export type GenreType = z.infer<typeof GenreSchema>;
export type ReleaseDateType = z.infer<typeof ReleaseDateSchema>;
export type ReleaseDatesByCountryType = z.infer<
   typeof ReleaseDatesByCountrySchema
>;
