import { DISCOVER_SORTS } from '@/types/discover.schemas';
import { MEDIA_TYPES } from '@/types/media.types';

import { buildDiscoverQuery } from './discover';

const params = (query: string) => new URLSearchParams(query);

describe('buildDiscoverQuery', () => {
   const base = {
      type: MEDIA_TYPES.MOVIE,
      sort: DISCOVER_SORTS.POPULAR,
      page: 1,
   } as const;

   it('always sends language, adult filter and page', () => {
      const q = params(buildDiscoverQuery(base));
      expect(q.get('language')).toBe('en-US');
      expect(q.get('include_adult')).toBe('false');
      expect(q.get('page')).toBe('1');
      expect(q.get('sort_by')).toBe('popularity.desc');
   });

   it('maps genre and uses the movie year field for movies', () => {
      const q = params(buildDiscoverQuery({ ...base, genre: 28, year: 1999 }));
      expect(q.get('with_genres')).toBe('28');
      expect(q.get('primary_release_year')).toBe('1999');
      expect(q.has('first_air_date_year')).toBe(false);
   });

   it('uses the TV year field for series', () => {
      const q = params(
         buildDiscoverQuery({ ...base, type: MEDIA_TYPES.TV, year: 2008 })
      );
      expect(q.get('first_air_date_year')).toBe('2008');
      expect(q.has('primary_release_year')).toBe(false);
   });

   it('adds a vote floor when sorting by rating', () => {
      const q = params(
         buildDiscoverQuery({ ...base, sort: DISCOVER_SORTS.RATING })
      );
      expect(q.get('sort_by')).toBe('vote_average.desc');
      expect(Number(q.get('vote_count.gte'))).toBeGreaterThan(0);
   });

   it('excludes unreleased titles when sorting by newest', () => {
      const today = new Date().toISOString().slice(0, 10);
      const movie = params(
         buildDiscoverQuery({ ...base, sort: DISCOVER_SORTS.NEWEST })
      );
      expect(movie.get('sort_by')).toBe('primary_release_date.desc');
      expect(movie.get('primary_release_date.lte')).toBe(today);

      const tv = params(
         buildDiscoverQuery({
            ...base,
            type: MEDIA_TYPES.TV,
            sort: DISCOVER_SORTS.NEWEST,
         })
      );
      expect(tv.get('sort_by')).toBe('first_air_date.desc');
      expect(tv.get('first_air_date.lte')).toBe(today);
   });

   it('sorts by revenue when asked', () => {
      const q = params(
         buildDiscoverQuery({ ...base, sort: DISCOVER_SORTS.REVENUE })
      );
      expect(q.get('sort_by')).toBe('revenue.desc');
   });
});
