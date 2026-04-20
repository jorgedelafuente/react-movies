import type { z } from 'zod';
import type {
   FilmInfoSchema,
   FilmListSchema,
   FilmVideoListSchema,
   FilmVideoTypeSchema,
} from './films.schemas';

export type FilmInfoType = z.infer<typeof FilmInfoSchema>;
export type FilmList = z.infer<typeof FilmListSchema>;
export type FilmVideoType = z.infer<typeof FilmVideoTypeSchema>;
export type FilmVideoList = z.infer<typeof FilmVideoListSchema>;
