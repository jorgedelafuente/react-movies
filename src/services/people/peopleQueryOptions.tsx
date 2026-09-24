import { queryOptions } from '@tanstack/react-query';

import { fetchPerson } from './people';

export const personQueryOptions = (personId: number) =>
   queryOptions({
      queryKey: ['person', { personId }],
      queryFn: () => fetchPerson(personId),
   });
