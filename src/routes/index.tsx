import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { filmsQueryOptions } from '../services/filmsQueryOptions';
import Card from '../components/card/card.component';

export const Route = createFileRoute('/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(filmsQueryOptions),
  component: Index,
});

function Index() {
  const { data: popularFilms, isLoading } = useSuspenseQuery(filmsQueryOptions);

  return (
    <div className="flex-row flex-wrap">
      {isLoading ? (
        <>Loading...</>
      ) : (
        popularFilms.map((item) => {
          return (
            <Card key={item.id}>
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
            </Card>
          );
        })
      )}
    </div>
  );
}

{
  /* <ul className="list-disc pl-4">
{[...posts, { id: 'i-do-not-exist', title: 'Non-existent Post' }].map(
  (post) => {
    return (
      <li key={post.id} className="whitespace-nowrap">
        <Link
          to="/posts/$postId"
          params={{
            postId: post.id,
          }}
          className="block py-1 text-blue-600 hover:opacity-75"
          activeProps={{ className: 'font-bold underline' }}
        >
          <div>{post.title.substring(0, 20)}</div>
        </Link>
      </li>
    );
  }
)}
</ul> */
}
