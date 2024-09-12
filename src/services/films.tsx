import axios from 'redaxios';
import type { FilmType, FilmList } from '@/types/films.types';

export class FilmNotFoundError extends Error {}

const apiKey = import.meta.env.VITE_APIKEY;
axios.defaults.baseURL = ' https://api.themoviedb.org/3';

const paramOptions = {
    popular: () => `/movie/popular${apiKey}&language=en-US&page=1`,
    movieInfo: (searchQuery: string) =>
        `movie/${searchQuery}${apiKey}&language=en-US`,
    search: (searchQuery: string) =>
        `/search/movie${apiKey}&query=${searchQuery}`,
};

export const fetchFilms = async () => {
    console.info('Fetching posts...');
    await new Promise((res) => setTimeout(res, 500));
    return axios
        .get<FilmList>(paramOptions.popular())
        .then((res) => res.data.results);
};

export const fetchFilm = async (filmId: string) => {
    console.info(`Fetching post with id ${filmId}...`);
    await new Promise((res) => setTimeout(res, 500));
    const post = await axios
        .get<FilmType>(`https://jsonplaceholder.typicode.com/posts/${filmId}`)
        .then((res) => res.data)
        .catch((err) => {
            if (err.status === 404) {
                throw new FilmNotFoundError(
                    `Post with id "${filmId}" not found!`
                );
            }
            throw err;
        });

    return post;
};
