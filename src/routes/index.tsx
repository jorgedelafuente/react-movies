import { Link, createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { filmsQueryOptions } from '../services/filmsQueryOptions';
import Card from '@/components/card/card.component';
import Spinner from '@/components/spinner/Spinner/spinner.component';
import { baseImagePath } from '@/services/config';

export const Route = createFileRoute('/')({
    loader: ({ context: { queryClient } }) =>
        queryClient.ensureQueryData(filmsQueryOptions),
    component: Index,
});

function Index() {
    const { data: popularFilms, isLoading } =
        useSuspenseQuery(filmsQueryOptions);

    return (
        <div className="flex flex-row flex-wrap justify-center gap-6 bg-black p-6 sm:p-4 md:p-10 lg:p-10">
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
                            <Card>
                                <img
                                    className="aspect-[1/1.5] rounded-md object-cover object-center hover:blur-md"
                                    src={`${baseImagePath}${item.poster_path}`}
                                    alt={item.title}
                                />

                                <div>
                                    <h2>{item.title}</h2>
                                    {item.overview}
                                </div>

                                {/* <MovieContent className="content">
                                    <h2>{title}</h2>
                                    {overview}
                                </MovieContent>  */}
                            </Card>
                        </Link>
                    );
                })
            )}
        </div>
    );
}
