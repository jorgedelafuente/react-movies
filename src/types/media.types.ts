export const MEDIA_TYPES = {
   MOVIE: 'movie',
   TV: 'tv',
} as const;

export type MediaType = (typeof MEDIA_TYPES)[keyof typeof MEDIA_TYPES];

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
   [MEDIA_TYPES.MOVIE]: 'Film',
   [MEDIA_TYPES.TV]: 'Series',
};
