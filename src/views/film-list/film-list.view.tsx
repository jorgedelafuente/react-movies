import { Link } from '@tanstack/react-router';

import Card from '@/components/atoms/card/card.component';
import FavoriteButton from '@/components/atoms/favorite-button/favorite-button.component';
import FlexContainer from '@/components/layout/container/flex-container.component';
import { baseImagePath } from '@/services/config';
import type { FilmInfoType } from '@/types/films.types';

const FilmList = ({ list }: { list: FilmInfoType[] }) => {
   return (
      <FlexContainer>
         {list.map((item) => {
            return (
               <Link
                  key={item.id}
                  to="/film/$filmId"
                  params={{
                     filmId: String(item.id),
                  }}
               >
                  <Card>
                     <img
                        loading="lazy"
                        className="aspect-[1/1.5] rounded-md object-cover object-center"
                        src={`${baseImagePath}${item.poster_path}`}
                        alt={item.title}
                     />

                     <div className="content">
                        <h2>{item.title}</h2>
                        {item.overview}
                        <FavoriteButton filmId={item.id} className='mt-3' />
                     </div>
                  </Card>
               </Link>
            );
         })}
      </FlexContainer>
   );
};

export default FilmList;
