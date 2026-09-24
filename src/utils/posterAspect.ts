/**
 * Poster crops for `FilmCard`.
 *
 * TMDB posters are all within a few pixels of 2:3, so a masonry that keeps
 * each poster's natural height has nothing to stagger: columns just drift out
 * of alignment by a few pixels per card and the page reads as broken rather
 * than as masonry. The home masonry instead crops every poster to one of three
 * fixed ratios chosen by position, so heights fall into three clean sizes and
 * the stagger is deliberate. Every other layout uses the plain 2:3 poster.
 */
export const POSTER_ASPECTS = ['2/3', '3/4', '1/1'] as const;
export type PosterAspect = (typeof POSTER_ASPECTS)[number];

export const DEFAULT_POSTER_ASPECT: PosterAspect = '2/3';

/**
 * Seven-card cycle, mostly 2:3 with one 3:4 and one 1:1 spaced so that two
 * shorter cards never sit next to each other in a column. Seven does not
 * divide TMDB's page size of 20, so consecutive pages do not repeat the same
 * column pattern.
 */
const MASONRY_CYCLE: readonly PosterAspect[] = [
   '2/3',
   '3/4',
   '2/3',
   '1/1',
   '2/3',
   '2/3',
   '3/4',
];

/** The crop for the card at `index` in a masonry list. */
export const masonryAspect = (index: number): PosterAspect =>
   MASONRY_CYCLE[index % MASONRY_CYCLE.length];
