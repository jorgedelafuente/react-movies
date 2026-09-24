import { useSuspenseQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';

import { ErrorComponent } from '@/components/layout/error-component/error-component.component';
import { personQueryOptions } from '@/services/people/peopleQueryOptions';
import PersonInfo from '@/views/person-info/person-info.view';

export const Route = createLazyFileRoute('/person/$personId')({
   errorComponent: ErrorComponent,
   component: PersonComponent,
});

function PersonComponent() {
   const personId = Number(Route.useParams().personId);
   const { data: person } = useSuspenseQuery(personQueryOptions(personId));

   return <PersonInfo person={person} />;
}
