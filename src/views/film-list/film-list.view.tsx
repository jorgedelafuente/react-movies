import FilmCard from '@/components/atoms/film-card/film-card.component';
import FlexContainer from '@/components/layout/container/flex-container.component';
import type { FilmInfoType } from '@/types/films.types';

const FilmList = ({ list }: { list: FilmInfoType[] }) => {
   return (
      <FlexContainer>
         {list.map((item) => (
            <FilmCard
               key={`${item.media_type}-${item.id}`}
               id={item.id}
               media_type={item.media_type}
               title={item.title}
               poster_path={item.poster_path}
               overview={item.overview}
               release_date={item.release_date}
            />
         ))}
      </FlexContainer>
   );
};

export default FilmList;
