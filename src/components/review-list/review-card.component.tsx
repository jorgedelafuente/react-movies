import { useLayoutEffect, useRef, useState } from 'react';

import MediaImage from '@/components/atoms/media-image/media-image.component';
import type { ReviewType } from '@/types/reviews.schemas';
import { resolveAvatarUrl } from '@/utils/avatarUrl';
import { stripMarkdown } from '@/utils/stripMarkdown';

/**
 * Reviews longer than this (or with many paragraphs) start clamped. Whether
 * the clamp actually hides anything depends on the viewport, so the toggle is
 * only shown once the paragraph is measured to overflow.
 */
const LONG_REVIEW_CHARS = 320;
const LONG_REVIEW_BREAKS = 4;

const formatDate = (iso: string) => {
   const date = new Date(iso);
   return Number.isNaN(date.getTime())
      ? ''
      : date.toLocaleDateString('en-GB', {
           day: '2-digit',
           month: 'short',
           year: 'numeric',
        });
};

const isLongReview = (content: string) =>
   content.length > LONG_REVIEW_CHARS ||
   (content.match(/\n/g)?.length ?? 0) >= LONG_REVIEW_BREAKS;

const ReviewCard = ({ review }: { review: ReviewType }) => {
   const [expanded, setExpanded] = useState(false);

   const { author, author_details, created_at, url } = review;
   const content = stripMarkdown(review.content);
   const displayName = author_details.name.trim() || author;
   const avatarUrl = resolveAvatarUrl(author_details.avatar_path);
   const rating = author_details.rating;
   const clampable = isLongReview(content);

   const contentRef = useRef<HTMLParagraphElement>(null);
   const [overflows, setOverflows] = useState(clampable);

   useLayoutEffect(() => {
      const element = contentRef.current;

      if (!element || !clampable || expanded) {
         return;
      }

      const measure = () => {
         // Elements without layout (hidden, jsdom) report 0; keep the heuristic.
         if (element.clientHeight === 0) {
            return;
         }
         setOverflows(element.scrollHeight > element.clientHeight + 1);
      };

      measure();

      if (typeof ResizeObserver === 'undefined') {
         return;
      }

      const observer = new ResizeObserver(measure);
      observer.observe(element);
      return () => observer.disconnect();
   }, [clampable, expanded]);

   const showToggle = clampable && (expanded || overflows);

   const authorId = `review-${review.id}-author`;
   const contentId = `review-${review.id}-content`;

   return (
      <li>
         <article
            aria-labelledby={authorId}
            className="rounded-lg border border-bold/40 bg-neutral/40 p-4 text-left"
         >
            <header className="flex items-center gap-3">
               {avatarUrl ? (
                  // resolveAvatarUrl already produced a full URL (TMDB or
                  // Gravatar), so the base path is empty here.
                  <MediaImage
                     path={avatarUrl}
                     basePath=""
                     alt=""
                     variant="person"
                     className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
               ) : (
                  <span
                     aria-hidden="true"
                     className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-subtle font-display text-lg font-semibold"
                  >
                     {displayName.charAt(0).toUpperCase()}
                  </span>
               )}

               <div className="min-w-0 flex-1">
                  <p
                     id={authorId}
                     className="truncate font-display font-semibold leading-tight"
                  >
                     {displayName}
                  </p>
                  <p className="text-xs tabular-nums text-copy/70">
                     <time dateTime={created_at}>{formatDate(created_at)}</time>
                  </p>
               </div>

               {rating !== null && (
                  <p className="shrink-0 rounded-full bg-subtle px-2 py-1 text-sm tabular-nums">
                     <span aria-hidden="true">★ </span>
                     <span className="sr-only">Rated </span>
                     {rating}/10
                  </p>
               )}
            </header>

            <p
               id={contentId}
               ref={contentRef}
               className={`mt-3 whitespace-pre-line leading-relaxed ${
                  clampable && !expanded ? 'line-clamp-4' : ''
               }`.trim()}
            >
               {content}
            </p>

            <footer className="mt-3 flex flex-wrap items-center gap-4 text-sm">
               {showToggle && (
                  <button
                     type="button"
                     aria-expanded={expanded}
                     aria-controls={contentId}
                     onClick={() => setExpanded((value) => !value)}
                     className="underline hover:text-copy/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                     {expanded ? 'Show less' : 'Read more'}
                  </button>
               )}
               <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-copy underline"
               >
                  Read on TMDB
                  <span className="sr-only"> (review by {displayName})</span>
               </a>
            </footer>
         </article>
      </li>
   );
};

export default ReviewCard;
