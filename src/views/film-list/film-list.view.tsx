import { Link } from '@tanstack/react-router';

import FlexContainer from '@/components/layout/container/flex-container.component';
import Card from '@/components/atoms/card/card.component';
import type { FilmInfoType } from '@/types/films.types';
import { baseImagePath } from '@/services/config';

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
                     </div>
                  </Card>
               </Link>
            );
         })}
      </FlexContainer>
   );
};

export default FilmList;
