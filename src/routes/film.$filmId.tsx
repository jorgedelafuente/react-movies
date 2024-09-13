import { useEffect } from 'react';
import {
    ErrorComponent,
    createFileRoute,
    useRouter,
    Link,
} from '@tanstack/react-router';
import {
    useQueryErrorResetBoundary,
    useSuspenseQuery,
} from '@tanstack/react-query';
import { FilmNotFoundError } from '../services/films';
import { filmQueryOptions } from '../services/filmQueryOptions';
import type { ErrorComponentProps } from '@tanstack/react-router';

export const Route = createFileRoute('/film/$filmId')({
    loader: ({ context: { queryClient }, params: { filmId } }) => {
        return queryClient.ensureQueryData(filmQueryOptions(filmId));
    },
    errorComponent: FilmErrorComponent,
    component: FilmComponent,
});

export function FilmErrorComponent({ error }: ErrorComponentProps) {
    const router = useRouter();
    if (error instanceof FilmNotFoundError) {
        return <div>{error.message}</div>;
    }
    const queryErrorResetBoundary = useQueryErrorResetBoundary();

    useEffect(() => {
        queryErrorResetBoundary.reset();
    }, [queryErrorResetBoundary]);

    return (
        <div>
            <button
                onClick={() => {
                    router.invalidate();
                }}
            >
                retry
            </button>
            <ErrorComponent error={error} />
        </div>
    );
}

function FilmComponent() {
    const filmId = Route.useParams().filmId;
    const { data: film } = useSuspenseQuery(filmQueryOptions(filmId));
    console.log('TCL: FilmComponent -> film', film);

    return (
        <div className="space-y-2">
            <Link to="/">
                <span className="p-4 text-white">&#x2B05; Back</span>
            </Link>
            <h4 className="text-xl font-bold underline">{film.title}</h4>
            <div className="text-m">{film.overview}</div>
            <div className="text-sm">{film.tagline}</div>
            <img src="" alt="" />
        </div>
    );
}
