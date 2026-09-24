import './film-card.styles.css';

import Card from '@/components/atoms/card/card.component';
import FavoriteButton from '@/components/atoms/favorite-button/favorite-button.component';
import MediaLink from '@/components/atoms/link/media-link.component';
import { baseImagePath } from '@/services/config';
import type { MediaType } from '@/types/media.types';

interface FilmCardProps {
   id: number;
   media_type: MediaType;
   title: string;
   poster_path: string | null;
   overview?: string;
   release_date: string;
   showFavorite?: boolean;
   /** Lets the poster keep its natural aspect ratio for masonry grids instead of a uniform crop. */
   masonry?: boolean;
}

const FilmCard = ({
   id,
   media_type,
   title,
   poster_path,
   overview,
   release_date,
   showFavorite = true,
   masonry = false,
}: FilmCardProps) => {
   return (
      <Card>
         <img
            loading="lazy"
            className={
               masonry
                  ? 'w-full rounded-md'
                  : 'aspect-[1/1.5] w-full rounded-md object-cover object-center'
            }
            src={`${baseImagePath}${poster_path}`}
            alt={title}
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
