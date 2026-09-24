import { createFileRoute } from '@tanstack/react-router';

import { personQueryOptions } from '@/services/people/peopleQueryOptions';

export const Route = createFileRoute('/person/$personId')({
   loader: ({ context: { queryClient }, params: { personId } }) =>
      queryClient.ensureQueryData(personQueryOptions(Number(personId))),
});
