import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

import Button from '@/components/atoms/button/button.component';
import Modal from '@/components/atoms/modal/modal.component';
import { baseImagePathGallery, baseImagePathPoster } from '@/services/config';
import { mediaImagesQueryOptions } from '@/services/images/imagesQueryOptions';
import type { MediaType } from '@/types/media.types';

type ImageGalleryProps = {
   mediaType: MediaType;
   id: number;
   /** Film or series title, used to describe each image to screen readers. */
   title: string;
};

/**
 * Backdrop gallery for the detail pages. Fetches its own data with a
 * non-suspending query so the page renders immediately and the section
 * fills in; it renders nothing while loading, on error, or with no artwork.
 */
const ImageGallery = ({ mediaType, id, title }: ImageGalleryProps) => {
   const { data } = useQuery(mediaImagesQueryOptions(mediaType, id));
   const [openIndex, setOpenIndex] = useState<number | null>(null);

   const backdrops = data?.backdrops ?? [];
   const count = backdrops.length;

   const close = useCallback(() => setOpenIndex(null), []);

   const step = useCallback(
      (delta: number) =>
         setOpenIndex((current) =>
            current === null ? current : (current + delta + count) % count
         ),
      [count]
   );

   useEffect(() => {
      if (openIndex === null) {
         return;
      }

      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.key === 'ArrowRight') step(1);
         if (event.key === 'ArrowLeft') step(-1);
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [openIndex, step]);

   if (count === 0) {
      return null;
   }

   const describe = (index: number) =>
      `${title} backdrop ${index + 1} of ${count}`;
   const selected = openIndex === null ? null : backdrops[openIndex];

   return (
      <section
         className="text-content mt-4 gap-4 rounded-lg p-5 text-copy sm:p-8"
         aria-labelledby="image-gallery-heading"
      >
         <h2 id="image-gallery-heading" className="text-display-md">
            Gallery
         </h2>

         <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {backdrops.map((image, index) => (
               <li key={image.file_path}>
                  <button
                     type="button"
                     onClick={() => setOpenIndex(index)}
                     className="block w-full overflow-hidden rounded-md transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                     <img
                        className="aspect-video w-full object-cover"
                        loading="lazy"
                        src={`${baseImagePathGallery}${image.file_path}`}
                        width={image.width}
                        height={image.height}
                        alt={describe(index)}
                     />
                  </button>
               </li>
            ))}
         </ul>

         {/* The modal caps its width at max-w-md; a responsive variant outranks
             that base utility, so this widens it from the sm breakpoint up. */}
         <Modal
            isOpen={selected !== null}
            onClose={close}
            title={title}
            className="sm:max-w-5xl"
         >
            {selected && openIndex !== null && (
               <figure className="flex flex-col items-center gap-3">
                  <img
                     className="max-h-[75vh] w-auto max-w-full rounded-md"
                     src={`${baseImagePathPoster}${selected.file_path}`}
                     alt={describe(openIndex)}
                  />
                  <figcaption className="text-sm tabular-nums text-copy/70">
                     {openIndex + 1} / {count}
                  </figcaption>
               </figure>
            )}

            {count > 1 && (
               <div className="mt-4 flex justify-center gap-3">
                  <Button
                     variant="secondary"
                     className="px-4"
                     onClick={() => step(-1)}
                  >
                     Previous
                  </Button>
                  <Button
                     variant="secondary"
                     className="px-4"
                     onClick={() => step(1)}
                  >
                     Next
                  </Button>
               </div>
            )}
         </Modal>
      </section>
   );
};

export default ImageGallery;
