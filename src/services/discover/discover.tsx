import axios from 'redaxios';

import { tmdbBaseUrl } from '@/services/config';
import {
   DISCOVER_SORTS,
   DiscoverMoviesSchema,
   type DiscoverPage,
   type DiscoverParams,
   DiscoverSeriesSchema,
} from '@/types/discover.schemas';
import { GenreListSchema } from '@/types/films.schemas';
import { MEDIA_TYPES, type MediaType } from '@/types/media.types';

const apiKey = import.meta.env.VITE_APIKEY;
axios.defaults.baseURL = tmdbBaseUrl;

/** Rating sorts are meaningless without a vote floor; TMDB returns 10/10 titles with 1 vote. */
const RATING_MIN_VOTES = 300;

const today = () => new Date().toISOString().slice(0, 10);

export const buildDiscoverQuery = ({
   type,
   genre,
   sort,
   year,
   page,
}: DiscoverParams): string => {
   const isMovie = type === MEDIA_TYPES.MOVIE;
   const dateField = isMovie ? 'primary_release_date' : 'first_air_date';
   const params = new URLSearchParams({
      language: 'en-US',
      include_adult: 'false',
      page: String(page),
   });

   if (genre) params.set('with_genres', String(genre));
   if (year) {
      params.set(
         isMovie ? 'primary_release_year' : 'first_air_date_year',
         String(year)
      );
   }

   switch (sort) {
      case DISCOVER_SORTS.RATING:
         params.set('sort_by', 'vote_average.desc');
         params.set('vote_count.gte', String(RATING_MIN_VOTES));
         break;
      case DISCOVER_SORTS.NEWEST:
         params.set('sort_by', `${dateField}.desc`);
         params.set(`${dateField}.lte`, today());
         break;
      case DISCOVER_SORTS.REVENUE:
         params.set('sort_by', 'revenue.desc');
         break;
      default:
         params.set('sort_by', 'popularity.desc');
   }

   return params.toString();
};

export const fetchDiscover = async (
   params: DiscoverParams
): Promise<DiscoverPage> => {
   const url = `/discover/${params.type}${apiKey}&${buildDiscoverQuery(params)}`;
   const res = await axios.get(url);
   return params.type === MEDIA_TYPES.MOVIE
      ? DiscoverMoviesSchema.parse(res.data)
      : DiscoverSeriesSchema.parse(res.data);
};

export const fetchGenres = async (type: MediaType) => {
   return axios
      .get(`/genre/${type}/list${apiKey}&language=en-US`)
      .then((res) => GenreListSchema.parse(res.data).genres);
};
