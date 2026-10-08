import './favorite-button.styles.css';

import { useEffect, useState } from 'react';

import { MEDIA_TYPES, type MediaType } from '@/types/media.types';
import { useAuth } from '@/utils/hooks/useAuth';
import { useFavorites } from '@/utils/hooks/useFavorites';

/**
 * Eight particles alternating between two shapes and two colors (accent,
 * rebeccapurple) so the burst reads as varied confetti rather than a single
 * uniform ping. The particle animation runs for `--motion-duration-celebrate`
 * (favorite-button.styles.css, defined in global.css); `BURST_DURATION_MS`
 * below must keep matching that token so the celebration layer unmounts
 * only once every child has finished.
 */
const BURST_PARTICLES = Array.from({ length: 8 }, (_, i) => ({
   angle: i * 45,
   purple: i % 2 === 1,
   diamond: i % 3 === 0,
}));
const BURST_DURATION_MS = 600;

/**
 * Visible surface for the heart when it sits beside the score ring on a
 * detail page; the same outline as the genre badges, so the two read as one
 * family. Pass it through `className`. The circular hit area and padding
 * come from the button's own base styles, not from this variant.
 */
export const FAVORITE_ROUND =
   'border border-copy/15 bg-neutral-inverted/5 hover:border-accent';

type FavoriteButtonProps = {
   filmId: number;
   mediaType?: MediaType;
   filmTitle?: string;
   filmPosterPath?: string | null;
   filmReleaseDate?: string;
   className?: string;
};

const FavoriteButton = ({
   filmId,
   mediaType = MEDIA_TYPES.MOVIE,
   filmTitle = '',
   filmPosterPath = null,
   filmReleaseDate = '',
   className = '',
}: FavoriteButtonProps) => {
   const user = useAuth((s) => s.user);
   const { isFavorited, toggle, isPending } = useFavorites();
   const [celebrate, setCelebrate] = useState(false);

   useEffect(() => {
      if (!celebrate) return;
      const timeout = setTimeout(() => setCelebrate(false), BURST_DURATION_MS);
      return () => clearTimeout(timeout);
   }, [celebrate]);

   if (!user) return null;

   const favorited = isFavorited(filmId, mediaType);

   const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const wasFavorited = favorited;
      toggle(
         { filmId, mediaType, filmTitle, filmPosterPath, filmReleaseDate },
         {
            onSuccess: () => {
               if (!wasFavorited) setCelebrate(true);
            },
         }
      );
   };

   return (
      <button
         type="button"
         onClick={handleClick}
         disabled={isPending}
         aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
         className={`favorite-button relative inline-flex cursor-pointer items-center justify-center rounded-full p-2.5 transition-colors hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-default disabled:opacity-50 ${favorited ? 'favorite-button--active' : ''} ${className}`.trim()}
      >
         {celebrate && (
            <span aria-hidden="true" className="favorite-button__burst">
               <span className="favorite-button__ring" />
               {BURST_PARTICLES.map(({ angle, purple, diamond }) => (
                  <span
                     key={angle}
                     style={{ '--angle': `${angle}deg` } as React.CSSProperties}
                     className={`favorite-button__particle ${
                        purple ? 'favorite-button__particle--purple' : ''
                     } ${diamond ? 'favorite-button__particle--diamond' : ''}`.trim()}
                  />
               ))}
            </span>
         )}
         <HeartIcon filled={favorited} />
      </button>
   );
};

export default FavoriteButton;

const HeartIcon = ({ filled }: { filled: boolean }) => (
   <svg
      viewBox="0 0 24 24"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="favorite-button__icon h-7 w-7"
   >
      <path
         d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
         className={`favorite-button__icon-path stroke-accent transition-colors duration-200 ${
            filled ? 'fill-accent' : 'fill-accent/20'
         }`}
      />
   </svg>
);
