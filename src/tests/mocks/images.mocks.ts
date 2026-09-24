export const MOCK_MEDIA_IMAGES = {
   id: 533535,
   backdrops: [
      {
         aspect_ratio: 1.778,
         height: 1080,
         iso_639_1: null,
         file_path: '/backdrop-mid.jpg',
         vote_average: 5.3,
         vote_count: 4,
         width: 1920,
      },
      {
         aspect_ratio: 1.778,
         height: 2160,
         iso_639_1: 'en',
         file_path: '/backdrop-top.jpg',
         vote_average: 5.8,
         vote_count: 10,
         width: 3840,
      },
      {
         aspect_ratio: 1.778,
         height: 720,
         iso_639_1: null,
         file_path: '/backdrop-low.jpg',
         vote_average: 5.3,
         vote_count: 2,
         width: 1280,
      },
   ],
   logos: [],
   posters: [
      {
         aspect_ratio: 0.667,
         height: 3000,
         iso_639_1: 'en',
         file_path: '/poster.jpg',
         vote_average: 6.1,
         vote_count: 8,
         width: 2000,
      },
   ],
};

/**
 * Shape of `/movie/{id}/reviews` and `/tv/{id}/reviews`. Oldest first, as TMDB
 * returns them. Covers all three avatar formats and a missing rating.
 */
