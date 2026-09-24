import type { z } from 'zod';

import type { MediaImagesSchema, TmdbImageSchema } from './images.schemas';

export type TmdbImageType = z.infer<typeof TmdbImageSchema>;
export type MediaImagesType = z.infer<typeof MediaImagesSchema>;
