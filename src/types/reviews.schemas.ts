import { z } from 'zod';

export const ReviewAuthorDetailsSchema = z.object({
   name: z.string(),
   username: z.string(),
   /**
    * Either a TMDB profile path (`/abc.jpg`) or, for older accounts, a full
    * Gravatar URL with a stray leading slash (`/https://...`). `null` when the
    * reviewer has no avatar. Resolve with `resolveAvatarUrl` before rendering.
    */
   avatar_path: z.string().nullable(),
   /** Reviewer's own score out of 10; many reviews carry no rating. */
   rating: z.number().nullable(),
});

/** One entry from TMDB's `/movie/{id}/reviews` or `/tv/{id}/reviews`. */
export const ReviewSchema = z.object({
   id: z.string(),
   author: z.string(),
   author_details: ReviewAuthorDetailsSchema,
   /** Plain text with paragraph breaks; occasionally contains raw markdown. */
   content: z.string(),
   created_at: z.string(),
   updated_at: z.string(),
   /** Public page for the full review on themoviedb.org. */
   url: z.string(),
});

/** Movies and series share this shape, so one schema serves both. */
export const ReviewListSchema = z.object({
   id: z.number(),
   page: z.number(),
   results: z.array(ReviewSchema),
   total_pages: z.number(),
   total_results: z.number(),
});

/** Orders reviews newest first; TMDB returns them oldest first. */
export const sortReviewsNewestFirst = (
   reviews: z.infer<typeof ReviewSchema>[]
) =>
   [...reviews].sort(
      (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
   );
