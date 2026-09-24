import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import Button from '@/components/atoms/button/button.component';
import { mediaReviewsQueryOptions } from '@/services/reviews/reviewsQueryOptions';
import type { MediaType } from '@/types/media.types';

import ReviewCard from './review-card.component';

/** Reviews shown before the "show more" button; the rest stay one click away. */
const INITIAL_VISIBLE = 5;

type ReviewListProps = {
   mediaType: MediaType;
   id: number;
};

/**
 * User reviews for the detail pages. Fetches its own data with a
 * non-suspending query so the page renders immediately and the section
 * fills in; it renders nothing while loading, on error, or with no reviews.
 */
const ReviewList = ({ mediaType, id }: ReviewListProps) => {
   const { data } = useQuery(mediaReviewsQueryOptions(mediaType, id));
   const [showAll, setShowAll] = useState(false);

   const reviews = data?.results ?? [];

   if (reviews.length === 0) {
      return null;
   }

   const visible = showAll ? reviews : reviews.slice(0, INITIAL_VISIBLE);
   const hiddenCount = reviews.length - visible.length;

   return (
      <section
         className="text-content mt-4 gap-4 rounded-lg p-5 text-copy sm:p-8"
         aria-labelledby="review-list-heading"
      >
         <h2 id="review-list-heading" className="text-display-md">
            Reviews{' '}
            <span className="text-base font-normal tabular-nums text-copy/70">
               ({reviews.length})
            </span>
         </h2>

         <ul className="flex flex-col gap-4">
            {visible.map((review) => (
               <ReviewCard key={review.id} review={review} />
            ))}
         </ul>

         {hiddenCount > 0 && (
            <div className="flex justify-center">
               <Button
                  variant="secondary"
                  className="px-4"
                  onClick={() => setShowAll(true)}
               >
                  Show {hiddenCount} more{' '}
                  {hiddenCount === 1 ? 'review' : 'reviews'}
               </Button>
            </div>
         )}
      </section>
   );
};

export default ReviewList;
