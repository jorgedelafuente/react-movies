import {
   MOCK_SERIES_INFO,
   MOCK_SERIES_LIST,
   MOCK_SERIES_RECOMMENDATIONS,
} from '@/tests/mocks/series.mocks';

import { MEDIA_TYPES } from './media.types';
import {
   SeriesInfoSchema,
   SeriesListSchema,
   SeriesRecommendationsSchema,
   toMediaItem,
} from './series.schemas';

describe('series schemas', () => {
   describe('toMediaItem', () => {
      it('maps TV field names onto the film shape and tags the media type', () => {
         const item = toMediaItem(
            SeriesListSchema.shape.results.element.in.parse(
               MOCK_SERIES_LIST.results[0]
            )
         );

         expect(item).toMatchObject({
            id: 1399,
            media_type: MEDIA_TYPES.TV,
            title: 'Game of Thrones',
            original_title: 'Game of Thrones',
            release_date: '2011-04-17',
            poster_path: '/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
            vote_average: 8.456,
            popularity: 1242.503,
         });
      });

      it('falls back to an empty release date when a series has not aired', () => {
         const parsed = SeriesListSchema.parse(MOCK_SERIES_LIST);
         const unaired = parsed.results.find((s) => s.id === 999001);

         expect(unaired?.release_date).toBe('');
         expect(unaired?.title).toBe('Unaired Pilot');
      });
   });

   describe('SeriesListSchema', () => {
      it('normalises every result so FilmList can render them', () => {
         const parsed = SeriesListSchema.parse(MOCK_SERIES_LIST);

         expect(parsed.results).toHaveLength(3);
         parsed.results.forEach((item) => {
            expect(item.media_type).toBe(MEDIA_TYPES.TV);
            expect(typeof item.title).toBe('string');
            expect(typeof item.release_date).toBe('string');
         });
      });
   });

   describe('SeriesInfoSchema', () => {
      it('parses the TV detail payload including appended external ids', () => {
         const info = SeriesInfoSchema.parse(MOCK_SERIES_INFO);

         expect(info.name).toBe('Game of Thrones');
         expect(info.number_of_seasons).toBe(8);
         expect(info.number_of_episodes).toBe(73);
         expect(info.episode_run_time).toEqual([60]);
         expect(info.created_by?.map((c) => c.name)).toEqual([
            'David Benioff',
            'D. B. Weiss',
         ]);
         expect(info.networks?.[0]?.name).toBe('HBO');
         expect(info.seasons).toHaveLength(3);
         expect(info.external_ids?.imdb_id).toBe('tt0944947');
      });

      it('tolerates a payload without external ids or seasons', () => {
         const { external_ids, seasons, ...rest } = MOCK_SERIES_INFO;
         void external_ids;
         void seasons;

         const info = SeriesInfoSchema.parse(rest);

         expect(info.external_ids).toBeUndefined();
         expect(info.seasons).toBeUndefined();
      });
   });

   describe('SeriesRecommendationsSchema', () => {
      it('normalises recommendations to the film recommendation shape', () => {
         const parsed = SeriesRecommendationsSchema.parse(
            MOCK_SERIES_RECOMMENDATIONS
         );

         expect(parsed.results[0]).toEqual({
            id: 1396,
            media_type: MEDIA_TYPES.TV,
            title: 'Breaking Bad',
            poster_path: '/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
            release_date: '2008-01-20',
            vote_average: 8.921,
         });
      });
   });
});
