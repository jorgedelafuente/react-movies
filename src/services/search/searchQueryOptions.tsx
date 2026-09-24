import { queryOptions } from '@tanstack/react-query';

import { fetchKeyword, searchKeywords, searchMedia } from './search';

const FIVE_MINUTES = 5 * 60 * 1000;

/** Navbar typeahead; a short stale time stops back-and-forth typing from refetching. */
export const mediaSearchQueryOptions = (query: string) =>
   queryOptions({
      queryKey: ['search', 'multi', query],
      queryFn: () => searchMedia(query),
      staleTime: FIVE_MINUTES,
   });

/** Keyword names never change, so suggestions and lookups are kept for the session. */
export const keywordSearchQueryOptions = (query: string) =>
   queryOptions({
      queryKey: ['search', 'keyword', query],
      queryFn: () => searchKeywords(query),
      staleTime: Infinity,
   });

export const keywordQueryOptions = (keywordId: number) =>
   queryOptions({
      queryKey: ['keyword', keywordId],
      queryFn: () => fetchKeyword(keywordId),
      staleTime: Infinity,
   });
