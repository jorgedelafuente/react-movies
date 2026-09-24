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
}

const FilmCard = ({
   id,
   media_type,
   title,
   poster_path,
   overview,
   release_date,
   showFavorite = true,
}: FilmCardProps) => {
   return (
      <MediaLink id={id} mediaType={media_type} className="w-full text-inherit">
         <Card>
            <img
               loading="lazy"
               className="aspect-[1/1.5] w-full rounded-md object-cover object-center"
               src={`${baseImagePath}${poster_path}`}
               alt={title}
            />
            <div className="content">
               <h2>{title}</h2>
               {overview}
               {showFavorite && (
                  <FavoriteButton
                     filmId={id}
                     mediaType={media_type}
                     filmTitle={title}
                     filmPosterPath={poster_path}
                     filmReleaseDate={release_date}
                     className="mt-3"
                  />
               )}
            </div>
         </Card>
      </MediaLink>
   );
};

export default FilmCard;
