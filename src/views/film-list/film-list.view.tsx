import './film-list.styles.css';

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
   /**
    * Home uses a masonry card grid, Discover uses a 3-4-3 (4-5-4 on very
    * wide screens) row rhythm; other list routes render the shared
    * `CardGrid` (fixed 2 / 3 / 4 columns, short last row centred).
    */
   cardLayout?: 'grid' | 'masonry' | 'rhythm';
};

const FilmList = ({ list, cardLayout = 'grid' }: FilmListProps) => {
   const view = useListView((state) => state.view);
   const setView = useListView((state) => state.setView);
   const hasNaturalAspect = cardLayout !== 'grid';

   const cards = list.map((item) => (
      <div key={`${item.media_type}-${item.id}`}>
         <FilmCard
            id={item.id}
            media_type={item.media_type}
            title={item.title}
            poster_path={item.poster_path}
            overview={item.overview}
            release_date={item.release_date}
            masonry={hasNaturalAspect}
         />
      </div>
   ));

   const renderCards = () => {
      if (cardLayout === 'grid') return <CardGrid>{cards}</CardGrid>;
      return (
         <div
            className={
               cardLayout === 'masonry'
                  ? 'film-list__masonry'
                  : 'film-list__rhythm'
            }
         >
            {cards}
         </div>
      );
   };

   return (
      <FlexContainer>
         <div className="flex justify-center">
            <ViewToggle value={view} onChange={setView} />
         </div>

         {view === LIST_VIEWS.TABLE ? <FilmTable list={list} /> : renderCards()}
      </FlexContainer>
   );
};

export default FilmList;
