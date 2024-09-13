import { Link, createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { filmsQueryOptions } from '../services/filmsQueryOptions';
import Card from '@/components/card/card.component';

export const Route = createFileRoute('/')({
    loader: ({ context: { queryClient } }) =>
        queryClient.ensureQueryData(filmsQueryOptions),
    component: Index,
});

function Index() {
    const { data: popularFilms, isLoading } =
        useSuspenseQuery(filmsQueryOptions);

    return (
        <div className="flex flex-row flex-wrap justify-center gap-6 p-8 sm:p-4 md:p-10 lg:p-20">
            {isLoading ? (
                <>Loading...</>
            ) : (
                popularFilms.map((item) => {
                    return (
                        <Link
                            to="/film/$filmId"
                            params={{
                                filmId: item.id,
                            }}
                        >
                            <Card key={item.id}>{item.title}</Card>
                        </Link>
                    );
                })
            )}
        </div>
    );
}
