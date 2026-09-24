import type { z } from 'zod';

import type { PersonInfoSchema } from './people.schemas';

export type PersonInfoType = z.infer<typeof PersonInfoSchema>;
export type { PersonCreditType } from './people.schemas';
