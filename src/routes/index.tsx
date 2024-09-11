import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { filmsQueryOptions } from '../services/filmsQueryOptions';

export const Route = createFileRoute('/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(filmsQueryOptions),
  component: Index,
});

function Index() {
  const { data: popularFilms, isLoading } = useSuspenseQuery(filmsQueryOptions);

  return (
    <div className="p-2">
      {isLoading ? (
        <>Loading...</>
      ) : (
        popularFilms.map((item) => {
          return (
            <div className="text-3xl font-bold underline" key={item.id}>
              {item.title}
            </div>
          );
        })
      )}
    </div>
  );
}
