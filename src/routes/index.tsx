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
            // TODO : create cards
            <div className="text-3xl font-bold underline" key={item.id}>
              {item.title}

              {/* <Link
                  to="/posts/$postId"
                  params={{
                    postId: post.id,
                  }}
                  className="block py-1 text-blue-600 hover:opacity-75"
                  activeProps={{ className: 'font-bold underline' }}
                >
                  <div>{post.title.substring(0, 20)}</div>
                </Link> */}
            </div>
          );
        })
      )}
    </div>
  );
}
