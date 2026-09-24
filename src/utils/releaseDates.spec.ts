import { MOCK_RELEASE_DATES } from '@/tests/mocks/films.mocks';

import {
   flattenReleaseDates,
   getPreferredRegion,
   pickCertification,
   regionName,
   releaseTypeLabel,
} from './releaseDates';

const results = MOCK_RELEASE_DATES.results;

describe('releaseDates helpers', () => {
   describe('getPreferredRegion', () => {
      it('extracts the region from a locale tag', () => {
         expect(getPreferredRegion('es-ES')).toBe('ES');
         expect(getPreferredRegion('en-GB')).toBe('GB');
      });

      it('falls back to US when the locale has no region or is invalid', () => {
         expect(getPreferredRegion('en')).toBe('US');
         expect(getPreferredRegion('not a locale!!')).toBe('US');
         expect(getPreferredRegion(undefined)).toBe('US');
      });
   });

   describe('pickCertification', () => {
      it('prefers the given region', () => {
         expect(pickCertification(results, 'ES')).toEqual({
            region: 'ES',
            rating: '16',
         });
      });

      it('falls back to US when the preferred region has no rating', () => {
         // FR exists but its certification is empty
         expect(pickCertification(results, 'FR')).toEqual({
            region: 'US',
            rating: 'R',
         });
      });

      it('skips empty certifications within a country', () => {
         // US has an uncertified premiere before the rated theatrical release
         expect(pickCertification(results, 'US')?.rating).toBe('R');
      });

      it('returns undefined when nothing is rated', () => {
         expect(pickCertification([], 'US')).toBeUndefined();
         expect(pickCertification(undefined)).toBeUndefined();
         expect(
            pickCertification(
               [{ iso_3166_1: 'FR', release_dates: results[3].release_dates }],
               'US'
            )
         ).toBeUndefined();
      });
   });

   describe('flattenReleaseDates', () => {
      it('puts the preferred region first, then countries alphabetically', () => {
         const rows = flattenReleaseDates(results, 'ES');
         const order = [...new Set(rows.map((r) => r.region))];
         // 'United Kingdom' sorts before 'United States'
         expect(order).toEqual(['ES', 'FR', 'GB', 'US']);
         expect(rows[1].country).toBe('France');
      });

      it('orders releases within a country by date', () => {
         const us = flattenReleaseDates(results, 'US').filter(
            (r) => r.region === 'US'
         );
         expect(us.map((r) => r.type)).toEqual([1, 3, 4]);
      });

      it('returns an empty list for missing input', () => {
         expect(flattenReleaseDates(undefined)).toEqual([]);
      });
   });

   it('labels TMDB release type codes and tolerates unknown ones', () => {
      expect(releaseTypeLabel(3)).toBe('Theatrical');
      expect(releaseTypeLabel(4)).toBe('Digital');
      expect(releaseTypeLabel(99)).toBe('Release');
   });

   it('resolves region names and falls back to the code', () => {
      expect(regionName('GB')).toBe('United Kingdom');
      // malformed codes throw inside Intl and fall back to the raw value
      expect(regionName('not-a-region')).toBe('not-a-region');
   });
});
