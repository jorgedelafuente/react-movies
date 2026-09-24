import type { z } from 'zod';

import type { ReviewListSchema, ReviewSchema } from './reviews.schemas';

export type ReviewType = z.infer<typeof ReviewSchema>;
export type ReviewListType = z.infer<typeof ReviewListSchema>;
