import axios from 'redaxios';

import { tmdbBaseUrl } from '@/services/config';
import {
   KeywordSchema,
   KeywordSearchSchema,
   type KeywordType,
   MultiSearchSchema,
} from '@/types/search.schemas';

const apiKey = import.meta.env.VITE_APIKEY;
axios.defaults.baseURL = tmdbBaseUrl;

const paramOptions = {
   multi: (query: string) =>
      `/search/multi${apiKey}&language=en-US&include_adult=false&page=1&query=${encodeURIComponent(query)}`,
   keyword: (query: string) =>
      `/search/keyword${apiKey}&page=1&query=${encodeURIComponent(query)}`,
   keywordById: (keywordId: number) => `/keyword/${keywordId}${apiKey}`,
};

/** Films and series matching `query`, ranked by TMDB; people are dropped. */
export const searchMedia = async (query: string) => {
   return axios
      .get(paramOptions.multi(query))
      .then((res) => MultiSearchSchema.parse(res.data).results);
};

/** Keyword suggestions for the discover typeahead. */
export const searchKeywords = async (query: string) => {
   return axios
      .get(paramOptions.keyword(query))
      .then((res) => KeywordSearchSchema.parse(res.data).results);
};

/**
 * Resolves a keyword id from the URL back to its name. Unknown ids resolve
 * to `null` rather than throwing so a stale link still renders the page.
 */
export const fetchKeyword = async (
   keywordId: number
): Promise<KeywordType | null> => {
   return axios
      .get(paramOptions.keywordById(keywordId))
      .then((res) => KeywordSchema.parse(res.data))
      .catch((err) => {
         if (err.status === 404) return null;
         throw err;
      });
};
