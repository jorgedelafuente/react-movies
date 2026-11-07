export const FAVORITE_STATUSES = {
   SAVED: 'saved',
   WATCH_NEXT: 'watch_next',
   WATCHED: 'watched',
} as const;

export type FavoriteStatus =
   (typeof FAVORITE_STATUSES)[keyof typeof FAVORITE_STATUSES];

export const FAVORITE_STATUS_LABELS: Record<FavoriteStatus, string> = {
   [FAVORITE_STATUSES.SAVED]: 'Saved',
   [FAVORITE_STATUSES.WATCH_NEXT]: 'Watchlist',
   [FAVORITE_STATUSES.WATCHED]: 'Seen',
};

/** Tab order on `/favorites`, after the All tab. */
export const FAVORITE_STATUS_ORDER: readonly FavoriteStatus[] = [
   FAVORITE_STATUSES.SAVED,
   FAVORITE_STATUSES.WATCH_NEXT,
   FAVORITE_STATUSES.WATCHED,
];
