import type { z } from 'zod';

import type {
   SeasonSchema,
   SeriesInfoSchema,
   SeriesListItemSchema,
} from './series.schemas';

export type SeriesInfoType = z.infer<typeof SeriesInfoSchema>;
export type SeriesListItemType = z.infer<typeof SeriesListItemSchema>;
export type SeasonType = z.infer<typeof SeasonSchema>;
