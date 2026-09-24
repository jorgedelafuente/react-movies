import { z } from 'zod';

import { type FilmRecommendationType, MediaTypeSchema } from './films.schemas';

/**
 * One row of `/person/{id}/combined_credits`. Movies carry `title` and
 * `release_date`, series carry `name` and `first_air_date`; both carry
 * `media_type`, so we normalise to the card shape plus the person's role.
 */
const PersonCreditRawSchema = z.object({
   id: z.number(),
   media_type: MediaTypeSchema,
   title: z.string().optional(),
   name: z.string().optional(),
   poster_path: z.string().nullable(),
   release_date: z.string().nullable().optional(),
   first_air_date: z.string().nullable().optional(),
   vote_average: z.number().optional(),
   popularity: z.number().optional(),
   character: z.string().optional(),
   job: z.string().optional(),
   department: z.string().optional(),
   episode_count: z.number().optional(),
});

export type PersonCreditType = FilmRecommendationType & {
   character?: string;
   job?: string;
   department?: string;
   episode_count?: number;
   popularity?: number;
};

export const toPersonCredit = (
   raw: z.infer<typeof PersonCreditRawSchema>
): PersonCreditType => ({
   id: raw.id,
   media_type: raw.media_type,
   title: raw.title ?? raw.name ?? '',
   poster_path: raw.poster_path,
   release_date: raw.release_date ?? raw.first_air_date ?? '',
   vote_average: raw.vote_average,
   popularity: raw.popularity,
   character: raw.character,
   job: raw.job,
   department: raw.department,
   episode_count: raw.episode_count,
});

const PersonCreditSchema = PersonCreditRawSchema.transform(toPersonCredit);

/**
 * TMDB `/person/{id}` fetched with
 * `append_to_response=combined_credits,external_ids`.
 */
export const PersonInfoSchema = z.object({
   id: z.number(),
   name: z.string(),
   biography: z.string(),
   birthday: z.string().nullable(),
   deathday: z.string().nullable(),
   place_of_birth: z.string().nullable(),
   profile_path: z.string().nullable(),
   known_for_department: z.string().optional(),
   also_known_as: z.array(z.string()).optional(),
   homepage: z.string().nullable().optional(),
   popularity: z.number().optional(),
   external_ids: z
      .object({ imdb_id: z.string().nullable().optional() })
      .optional(),
   combined_credits: z
      .object({
         cast: z.array(PersonCreditSchema),
         crew: z.array(PersonCreditSchema),
      })
      .optional(),
});

export type PersonInfoType = z.infer<typeof PersonInfoSchema>;
