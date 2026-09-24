import './film-card.styles.css';

import Card from '@/components/atoms/card/card.component';
import FavoriteButton from '@/components/atoms/favorite-button/favorite-button.component';
import MediaLink from '@/components/atoms/link/media-link.component';
import MediaImage from '@/components/atoms/media-image/media-image.component';
import type { MediaType } from '@/types/media.types';
import { DEFAULT_POSTER_ASPECT, type PosterAspect } from '@/utils/posterAspect';

/**
 * One class per ratio, spelled out so Tailwind's compiler sees each of them.
 * The skeleton receives the same class, so a missing poster keeps the slot.
 */
const POSTER_ASPECT_CLASS: Record<PosterAspect, string> = {
   '2/3': 'aspect-[2/3]',
   '3/4': 'aspect-[3/4]',
   '1/1': 'aspect-square',
};

interface FilmCardProps {
   id: number;
   media_type: MediaType;
   title: string;
   poster_path: string | null;
   overview?: string;
   release_date: string;
   showFavorite?: boolean;
   /** Crop for the poster; the home masonry varies it by position (see `masonryAspect`). */
   aspect?: PosterAspect;
}

const FilmCard = ({
   id,
   media_type,
   title,
   poster_path,
   overview,
   release_date,
   showFavorite = true,
   aspect = DEFAULT_POSTER_ASPECT,
}: FilmCardProps) => {
   return (
      <Card>
         <MediaImage
            path={poster_path}
            alt={title}
            className={`${POSTER_ASPECT_CLASS[aspect]} w-full rounded-md object-cover object-center`}
         />
         <div className="content">
            <MediaLink
               id={id}
               mediaType={media_type}
               className="film-card__link"
            >
               <h2 className="mb-2 text-center text-base font-semibold leading-tight sm:text-lg">
                  {title}
               </h2>
               {overview && (
                  <p className="line-clamp-4 text-center text-xs leading-snug text-white/85 sm:line-clamp-6 sm:text-sm">
                     {overview}
                  </p>
               )}
            </MediaLink>
            {showFavorite && (
               <FavoriteButton
                  filmId={id}
                  mediaType={media_type}
                  filmTitle={title}
                  filmPosterPath={poster_path}
                  filmReleaseDate={release_date}
                  className="film-card__favorite mt-3"
               />
            )}
         </div>
      </Card>
   );
};

export default FilmCard;
