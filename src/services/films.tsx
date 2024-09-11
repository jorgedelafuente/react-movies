import axios from 'redaxios';

export type FilmList = { results: FilmType[] };
export type FilmType = { title: string; id: number };

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

export const fetchFilm = async (postId: string) => {
  console.info(`Fetching post with id ${postId}...`);
  await new Promise((res) => setTimeout(res, 500));
  const post = await axios
    .get<FilmType>(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    .then((res) => res.data)
    .catch((err) => {
      if (err.status === 404) {
        throw new FilmNotFoundError(`Post with id "${postId}" not found!`);
      }
      throw err;
    });

  return post;
};
