import { MOCK_MEDIA_IMAGES } from '@/tests/__mocks__/mocks';

import {
   GALLERY_BACKDROP_LIMIT,
   MediaImagesSchema,
   pickGalleryBackdrops,
} from './images.schemas';

describe('images schemas', () => {
   it('parses the TMDB images payload, keeping textless (null) languages', () => {
      const images = MediaImagesSchema.parse(MOCK_MEDIA_IMAGES);

      expect(images.id).toBe(533535);
      expect(images.backdrops).toHaveLength(3);
      expect(images.posters).toHaveLength(1);
      expect(images.backdrops[0].iso_639_1).toBeNull();
   });

   it('rejects a payload missing the backdrops list', () => {
      expect(() =>
         MediaImagesSchema.parse({ id: 1, posters: [] })
      ).toThrowError();
   });

   describe('pickGalleryBackdrops', () => {
      const { backdrops } = MediaImagesSchema.parse(MOCK_MEDIA_IMAGES);

      it('orders by vote average, then vote count', () => {
         const picked = pickGalleryBackdrops(backdrops);

         expect(picked.map((b) => b.file_path)).toEqual([
            '/backdrop-top.jpg',
            '/backdrop-mid.jpg',
            '/backdrop-low.jpg',
         ]);
      });

      it('does not mutate the input array', () => {
         const before = backdrops.map((b) => b.file_path);
         pickGalleryBackdrops(backdrops);

         expect(backdrops.map((b) => b.file_path)).toEqual(before);
      });

      it('caps the result at the gallery limit', () => {
         const many = Array.from(
            { length: GALLERY_BACKDROP_LIMIT + 5 },
            (_, i) => ({
               ...backdrops[0],
               file_path: `/b-${i}.jpg`,
            })
         );

         expect(pickGalleryBackdrops(many)).toHaveLength(
            GALLERY_BACKDROP_LIMIT
         );
         expect(pickGalleryBackdrops(many, 2)).toHaveLength(2);
      });
   });
});
