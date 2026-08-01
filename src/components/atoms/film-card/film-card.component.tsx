import { Link } from '@tanstack/react-router';

import Card from '@/components/atoms/card/card.component';
import FavoriteButton from '@/components/atoms/favorite-button/favorite-button.component';
import { baseImagePath } from '@/services/config';

interface FilmCardProps {
   id: number;
   title: string;
   poster_path: string | null;
   overview?: string;
   release_date: string;
   showFavorite?: boolean;
}

const FilmCard = ({
   id,
   title,
   poster_path,
   overview,
   release_date,
   showFavorite = true,
}: FilmCardProps) => {
   return (
      <Link
         to="/film/$filmId"
         params={{ filmId: String(id) }}
         className="w-full text-inherit"
      >
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
                     filmTitle={title}
                     filmPosterPath={poster_path}
                     filmReleaseDate={release_date}
                     className="mt-3"
                  />
               )}
            </div>
         </Card>
      </Link>
   );
};

export default FilmCard;
