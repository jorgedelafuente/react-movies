import axios from 'redaxios';
import type {
   FilmInfoType,
   FilmList,
   FilmVideoList,
} from '@/types/films.types';

export class FilmNotFoundError extends Error {}

const apiKey = import.meta.env.VITE_APIKEY;
axios.defaults.baseURL = ' https://api.themoviedb.org/3';

const paramOptions = {
   popular: () => `/movie/popular${apiKey}&language=en-US&page=1`,
   top_rated: () => `/movie/top_rated${apiKey}&language=en-US&page=1`,
   upcoming: () => `/movie/upcoming${apiKey}&language=en-US&page=1`,
   movieInfo: (filmId: string) => `movie/${filmId}${apiKey}&language=en-US`,
   movieVideo: (filmId: string) =>
      `movie/${filmId}/videos${apiKey}&language=en-US`,
   search: (searchQuery: string) =>
      `/search/movie${apiKey}&query=${searchQuery}`,
};

export const fetchPopularFilms = async () => {
   await new Promise((res) => setTimeout(res, 500));
   return axios
      .get<FilmList>(paramOptions.popular())
      .then((res) => res.data.results);
};

export const fetchTopRatedFilms = async () => {
   await new Promise((res) => setTimeout(res, 500));
   return axios
      .get<FilmList>(paramOptions.top_rated())
      .then((res) => res.data.results);
};

export const fetchUpcoming = async () => {
   await new Promise((res) => setTimeout(res, 500));
   return axios
      .get<FilmList>(paramOptions.upcoming())
      .then((res) => res.data.results);
};

export const fetchFilm = async (filmId: string) => {
   await new Promise((res) => setTimeout(res, 500));
   const post = await axios
      .get<FilmInfoType>(paramOptions.movieInfo(filmId))
      .then((res) => res.data)
      .catch((err) => {
         if (err.status === 404) {
            throw new FilmNotFoundError(`Film with id "${filmId}" not found!`);
         }
         throw err;
      });

   return post;
};
export const fetchFilmVideo = async (filmId: string) => {
   await new Promise((res) => setTimeout(res, 500));
   const post = await axios
      .get<FilmVideoList>(paramOptions.movieVideo(filmId))
      .then((res) => res.data)
      .catch((err) => {
         if (err.status === 404) {
            throw new FilmNotFoundError(`Film with id "${filmId}" not found!`);
         }
         throw err;
      });

   return post;
};

export const searchFilm = async (searchQuery: string) => {
   await new Promise((res) => setTimeout(res, 500));
   return axios
      .get<FilmList>(paramOptions.search(searchQuery))
      .then((res) => res.data.results);
};
