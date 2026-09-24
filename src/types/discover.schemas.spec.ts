import {
   MOCK_DISCOVER_MOVIES,
   MOCK_SERIES_LIST,
} from '@/tests/__mocks__/mocks';

import {
   DISCOVER_SORTS,
   DiscoverMoviesSchema,
   DiscoverSearchSchema,
   DiscoverSeriesSchema,
   resolveDiscoverSearch,
} from './discover.schemas';
import { MEDIA_TYPES } from './media.types';

describe('discover schemas', () => {
   describe('DiscoverSearchSchema', () => {
      it('accepts a full set of valid params', () => {
         expect(
            DiscoverSearchSchema.parse({
               type: 'tv',
               genre: 18,
               keyword: 4379,
               sort: 'rating',
               provider: 350,
               year: 2015,
               page: 3,
            })
         ).toEqual({
            type: 'tv',
            genre: 18,
            keyword: 4379,
            sort: 'rating',
            provider: 350,
            year: 2015,
            page: 3,
         });
      });

      it('drops invalid values instead of throwing so bad URLs still load', () => {
         const parsed = DiscoverSearchSchema.parse({
            type: 'podcast',
            genre: -4,
            keyword: 'heist',
            sort: 'loudest',
            provider: 'netflix',
            year: 1800,
            page: 9999,
         });
         expect(parsed).toEqual({
            type: undefined,
            genre: undefined,
            keyword: undefined,
            sort: undefined,
            provider: undefined,
            year: undefined,
            page: undefined,
         });
      });

      it('drops a provider id that is not in the curated list', () => {
         // 15 is Hulu, a real TMDB id, but US-only and not offered here
         expect(DiscoverSearchSchema.parse({ provider: 15 }).provider).toBe(
            undefined
         );
      });

      it('parses an empty search', () => {
         expect(DiscoverSearchSchema.parse({})).toEqual({});
      });
   });

   describe('resolveDiscoverSearch', () => {
      it('fills defaults: movies, most popular, page 1', () => {
         expect(resolveDiscoverSearch({})).toEqual({
            type: MEDIA_TYPES.MOVIE,
            genre: undefined,
            keyword: undefined,
            sort: DISCOVER_SORTS.POPULAR,
            provider: undefined,
            year: undefined,
            page: 1,
         });
      });

      it('passes the provider through for both media types', () => {
         expect(
            resolveDiscoverSearch({ type: 'movie', provider: 8 }).provider
         ).toBe(8);
         expect(
            resolveDiscoverSearch({ type: 'tv', provider: 8 }).provider
         ).toBe(8);
      });

      it('keeps a revenue sort for movies', () => {
         expect(
            resolveDiscoverSearch({ type: 'movie', sort: 'revenue' }).sort
         ).toBe(DISCOVER_SORTS.REVENUE);
      });

      it('replaces the movie-only revenue sort with popularity for series', () => {
         expect(
            resolveDiscoverSearch({ type: 'tv', sort: 'revenue' }).sort
         ).toBe(DISCOVER_SORTS.POPULAR);
      });
   });

   describe('response schemas', () => {
      it('parses a movie page and tags results as movies', () => {
         const page = DiscoverMoviesSchema.parse(MOCK_DISCOVER_MOVIES);
         expect(page.total_pages).toBe(812);
         expect(page.results).toHaveLength(4);
         expect(page.results[0].media_type).toBe(MEDIA_TYPES.MOVIE);
      });

      it('normalises a TV page onto the film shape', () => {
         const page = DiscoverSeriesSchema.parse({
            page: 1,
            total_pages: 1,
            total_results: 3,
            results: MOCK_SERIES_LIST.results,
         });
         expect(page.results[0]).toMatchObject({
            media_type: MEDIA_TYPES.TV,
            title: 'Game of Thrones',
            release_date: '2011-04-17',
         });
      });
   });
});
