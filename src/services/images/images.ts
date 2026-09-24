import axios from 'redaxios';

import { tmdbBaseUrl } from '@/services/config';
import {
   MediaImagesSchema,
   pickGalleryBackdrops,
} from '@/types/images.schemas';
import type { MediaType } from '@/types/media.types';

const apiKey = import.meta.env.VITE_APIKEY;
axios.defaults.baseURL = tmdbBaseUrl;

/**
 * `/movie/{id}/images` and `/tv/{id}/images` return the same shape, so a
 * single fetcher keyed by media type serves both detail pages.
 *
 * `include_image_language=en,null` keeps English and textless artwork and
 * drops backdrops with titles burned in for other languages.
 */
const imagesPath = (mediaType: MediaType, id: number) =>
   `/${mediaType}/${id}/images${apiKey}&include_image_language=en,null`;

export const fetchMediaImages = async (mediaType: MediaType, id: number) => {
   return axios.get(imagesPath(mediaType, id)).then((res) => {
      const images = MediaImagesSchema.parse(res.data);
      return { ...images, backdrops: pickGalleryBackdrops(images.backdrops) };
   });
};
