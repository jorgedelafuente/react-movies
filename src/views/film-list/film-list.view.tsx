import CardGrid from '@/components/atoms/card-grid/card-grid.component';
import FilmCard from '@/components/atoms/film-card/film-card.component';
import ViewToggle from '@/components/atoms/view-toggle/view-toggle.component';
import FilmTable from '@/components/film-table/film-table.component';
import FlexContainer from '@/components/layout/container/flex-container.component';
import type { FilmInfoType } from '@/types/films.types';
import { LIST_VIEWS } from '@/types/list-view.types';
import { useListView } from '@/utils/hooks/useListView';

type FilmListProps = {
   list: FilmInfoType[];
};

const FilmList = ({ list }: FilmListProps) => {
   const view = useListView((state) => state.view);
   const setView = useListView((state) => state.setView);
   const cards = list.map((item) => (
      <div key={`${item.media_type}-${item.id}`}>
         <FilmCard
            id={item.id}
            media_type={item.media_type}
            title={item.title}
            poster_path={item.poster_path}
            overview={item.overview}
            release_date={item.release_date}
         />
      </div>
   ));

   return (
      <FlexContainer>
         <div className="flex justify-center">
            <ViewToggle value={view} onChange={setView} />
         </div>

         {view === LIST_VIEWS.TABLE ? (
            <FilmTable list={list} />
         ) : (
            <CardGrid>{cards}</CardGrid>
         )}
      </FlexContainer>
   );
};

export default FilmList;
