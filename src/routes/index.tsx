import { Link, createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { filmsQueryOptions } from '../services/filmsQueryOptions';
import Card from '@/components/card/card.component';
import Spinner from '@/components/spinner/Spinner/spinner.component';

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
                <Spinner />
            ) : (
                popularFilms.map((item) => {
                    return (
                        <Link
                            key={item.id}
                            to="/film/$filmId"
                            params={{
                                filmId: item.id,
                            }}
                        >
                            <Card>{item.title}</Card>
                        </Link>
                    );
                })
            )}
        </div>
    );
}
