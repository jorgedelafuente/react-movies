import { z } from 'zod';

const GenreSchema = z.object({
   id: z.number(),
   name: z.string(),
});

const ProductionCompanySchema = z.object({
   id: z.number(),
   logo_path: z.string().nullable(),
   name: z.string(),
   origin_country: z.string(),
});

const SpokenLanguageSchema = z.object({
   english_name: z.string(),
   iso_639_1: z.string(),
   name: z.string(),
});

export const FilmInfoSchema = z.object({
   id: z.number(),
   title: z.string(),
   original_title: z.string(),
   original_language: z.string().optional(),
   overview: z.string(),
   backdrop_path: z.string().nullable(),
   poster_path: z.string().nullable(),
   release_date: z.string(),
   vote_average: z.number().optional(),
   vote_count: z.number().optional(),
   tagline: z.string().optional().nullable(),
   homepage: z.string().optional().nullable(),
   runtime: z.number().optional().nullable(),
   status: z.string().optional(),
   budget: z.number().optional(),
   revenue: z.number().optional(),
   genres: z.array(GenreSchema).optional(),
   production_companies: z.array(ProductionCompanySchema).optional(),
   spoken_languages: z.array(SpokenLanguageSchema).optional(),
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
