import { z } from 'zod';

export const FilmInfoSchema = z.object({
   id: z.number(),
   title: z.string(),
   original_title: z.string(),
   overview: z.string(),
   backdrop_path: z.string().nullable(),
   poster_path: z.string().nullable(),
   release_date: z.string(),
   vote_average: z.number().optional(),
   vote_count: z.number().optional(),
   tagline: z.string().optional().nullable(),
   homepage: z.string().optional().nullable(),
   runtime: z.number().optional().nullable(),
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
