import { MOCK_KEYWORDS, MOCK_MULTI_SEARCH } from '@/tests/mocks/search.mocks';

import { MEDIA_TYPES } from './media.types';
import { KeywordSearchSchema, MultiSearchSchema } from './search.schemas';

describe('search schemas', () => {
   describe('MultiSearchSchema', () => {
      const { results } = MultiSearchSchema.parse(MOCK_MULTI_SEARCH);

      it('drops people so only films and series remain', () => {
         expect(results).toHaveLength(2);
         expect(results.map((r) => r.media_type)).toEqual([
            MEDIA_TYPES.TV,
            MEDIA_TYPES.MOVIE,
         ]);
      });

      it('normalises a series onto the film shape', () => {
         expect(results[0]).toMatchObject({
            id: 95396,
            media_type: MEDIA_TYPES.TV,
            title: 'Severance',
            release_date: '2022-02-17',
         });
      });

      it('keeps a film as is, tagged as a movie', () => {
         expect(results[1]).toMatchObject({
            id: 5072,
            media_type: MEDIA_TYPES.MOVIE,
            title: 'Severance',
            release_date: '2006-08-25',
         });
      });

      it('keeps TMDB relevance order across media types', () => {
         expect(results.map((r) => r.id)).toEqual([95396, 5072]);
      });
   });

   describe('KeywordSearchSchema', () => {
      it('parses keyword suggestions', () => {
         const { results } = KeywordSearchSchema.parse(MOCK_KEYWORDS);
         expect(results).toHaveLength(3);
         expect(results[1]).toEqual({ id: 4379, name: 'time travel' });
      });
   });
});
