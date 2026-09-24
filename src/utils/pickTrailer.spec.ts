import { describe, expect, it } from 'vitest';

import type { FilmVideoType } from '@/types/films.schemas';

import { pickTrailer, VIDEO_TYPES } from './pickTrailer';

const video = (overrides: Partial<FilmVideoType>): FilmVideoType => ({
   site: 'YouTube',
   type: VIDEO_TYPES.TRAILER,
   name: 'Trailer',
   key: 'key',
   ...overrides,
});

describe('pickTrailer', () => {
   it('returns undefined when there are no videos', () => {
      expect(pickTrailer([])).toBeUndefined();
   });

   it('ignores videos that are not trailers', () => {
      const teaser = video({ type: 'Teaser', name: 'Official Teaser' });
      const clip = video({ type: 'Clip', name: 'Opening Scene' });

      expect(pickTrailer([teaser, clip])).toBeUndefined();
   });

   it('prefers the official trailer over other trailers', () => {
      const first = video({ name: 'Trailer 1', key: 'first' });
      const official = video({
         name: VIDEO_TYPES.OFFICIAL_TRAILER,
         key: 'official',
      });

      expect(pickTrailer([first, official])).toBe(official);
   });

   it('accepts the final trailer as an official pick', () => {
      const first = video({ name: 'Trailer 1', key: 'first' });
      const final = video({ name: VIDEO_TYPES.FINAL_TRAILER, key: 'final' });

      expect(pickTrailer([first, final])).toBe(final);
   });

   it('falls back to the first trailer in API order', () => {
      const teaser = video({ type: 'Teaser', name: 'Teaser' });
      const first = video({ name: 'Trailer 1', key: 'first' });
      const second = video({ name: 'Trailer 2', key: 'second' });

      expect(pickTrailer([teaser, first, second])).toBe(first);
   });
});
