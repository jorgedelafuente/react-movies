import { useState } from 'react';

import { baseImagePath } from '@/services/config';

type MediaImageProps = {
   /** TMDB image path such as "/abc.jpg"; null when TMDB has no artwork. */
   path: string | null | undefined;
   /** Empty string when the image is decorative and a caption already names it. */
   alt: string;
   /** Shared by the image and its skeleton so size, ratio and radius match. */
   className?: string;
   /**
    * Added to the skeleton only. Use it for an aspect ratio when the image
    * itself sizes from its natural dimensions, otherwise the skeleton has
    * no height.
    */
   fallbackClassName?: string;
   /** Which glyph the skeleton shows: a framed picture (default) or a person silhouette. */
   variant?: 'picture' | 'person';
   loading?: 'lazy' | 'eager';
};

const GLYPHS = {
   picture: (
      <>
         <rect x="3" y="5" width="18" height="14" rx="2" />
         <circle cx="8.5" cy="10" r="1.5" />
         <path d="m21 16-5-5-9 9" />
      </>
   ),
   person: (
      <>
         <circle cx="12" cy="8" r="4" />
         <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
      </>
   ),
} as const;

/**
 * A TMDB image that never shows the browser's broken-image icon. When there is
 * nothing to render, either because TMDB has no artwork (`path` is null) or the
 * request failed, a skeleton block takes the image's place. It is drawn with
 * the `subtle` and `copy` tokens, so it follows light and dark mode with the
 * rest of the page. Posters and stills get a framed-picture glyph; portraits
 * and avatars pass `variant="person"` for a silhouette.
 */
const MediaImage = ({
   path,
   alt,
   className = '',
   fallbackClassName = '',
   variant = 'picture',
   loading = 'lazy',
}: MediaImageProps) => {
   // Remember which path failed rather than a plain boolean: if the same
   // mounted component receives a new path it gets a fresh attempt.
   const [failedPath, setFailedPath] = useState<string | null>(null);
   const showSkeleton = !path || failedPath === path;

   if (showSkeleton) {
      const decorative = alt === '';
      return (
         <div
            role={decorative ? undefined : 'img'}
            aria-label={decorative ? undefined : alt}
            aria-hidden={decorative ? true : undefined}
            data-testid="media-image-skeleton"
            className={`flex items-center justify-center bg-subtle text-copy/30 ${className} ${fallbackClassName}`.trim()}
         >
            <svg
               viewBox="0 0 24 24"
               aria-hidden="true"
               className="h-auto w-1/3 max-w-12 fill-none stroke-current"
               strokeWidth="1.5"
               strokeLinecap="round"
               strokeLinejoin="round"
            >
               {GLYPHS[variant]}
            </svg>
         </div>
      );
   }

   return (
      // onError is a load event, not a user interaction; the rule's default
      // handler list just happens to include it.
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      <img
         loading={loading}
         src={`${baseImagePath}${path}`}
         alt={alt}
         className={className || undefined}
         onError={() => setFailedPath(path)}
      />
   );
};

export default MediaImage;
