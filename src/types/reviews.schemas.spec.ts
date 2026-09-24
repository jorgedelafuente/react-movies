import { MOCK_REVIEWS } from '@/tests/mocks/reviews.mocks';

import { ReviewListSchema, sortReviewsNewestFirst } from './reviews.schemas';

describe('reviews schemas', () => {
   it('parses the TMDB reviews payload, keeping null avatars and ratings', () => {
      const list = ReviewListSchema.parse(MOCK_REVIEWS);

      expect(list.total_results).toBe(3);
      expect(list.results).toHaveLength(3);
      expect(list.results[1].author_details.rating).toBeNull();
      expect(list.results[2].author_details.avatar_path).toBeNull();
   });

   it('rejects a review without an author', () => {
      const broken = {
         ...MOCK_REVIEWS,
         results: [{ ...MOCK_REVIEWS.results[0], author: undefined }],
      };

      expect(() => ReviewListSchema.parse(broken)).toThrowError();
   });

   describe('sortReviewsNewestFirst', () => {
      const { results } = ReviewListSchema.parse(MOCK_REVIEWS);

      it('orders by created_at descending', () => {
         expect(sortReviewsNewestFirst(results).map((r) => r.id)).toEqual([
            'review-newest',
            'review-long',
            'review-oldest',
         ]);
      });

      it('does not mutate the input array', () => {
         const before = results.map((r) => r.id);
         sortReviewsNewestFirst(results);

         expect(results.map((r) => r.id)).toEqual(before);
      });
   });
});
