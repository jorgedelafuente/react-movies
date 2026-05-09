import type { z } from 'zod';

import type {
   CastMemberSchema,
   CrewMemberSchema,
   FilmCreditsSchema,
   FilmInfoSchema,
   FilmListSchema,
   FilmRecommendationsSchema,
   FilmVideoListSchema,
   FilmVideoTypeSchema,
} from './films.schemas';

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
