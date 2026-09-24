import './film-list.styles.css';

import CardGrid from '@/components/atoms/card-grid/card-grid.component';
import FilmCard from '@/components/atoms/film-card/film-card.component';
import ViewToggle from '@/components/atoms/view-toggle/view-toggle.component';
import FilmTable from '@/components/film-table/film-table.component';
import FlexContainer from '@/components/layout/container/flex-container.component';
import type { FilmInfoType } from '@/types/films.types';
import { LIST_VIEWS } from '@/types/list-view.types';
import { useListView } from '@/utils/hooks/useListView';
import { DEFAULT_POSTER_ASPECT, masonryAspect } from '@/utils/posterAspect';

type FilmListProps = {
   list: FilmInfoType[];
   /**
    * Home uses a masonry card grid whose poster crops cycle through three
    * fixed ratios by position (`masonryAspect`), Discover uses a 3-4-3
    * (4-5-4 on very wide screens) row rhythm; other list routes render the
    * shared `CardGrid` (as many `--card-min` columns as fit, stretched to
    * fill the row). Every layout but the masonry crops posters to 2:3.
    */
   cardLayout?: 'grid' | 'masonry' | 'rhythm';
};

const FilmList = ({ list, cardLayout = 'grid' }: FilmListProps) => {
   const view = useListView((state) => state.view);
   const setView = useListView((state) => state.setView);
   const cards = list.map((item, index) => (
      <div key={`${item.media_type}-${item.id}`}>
         <FilmCard
            id={item.id}
            media_type={item.media_type}
            title={item.title}
            poster_path={item.poster_path}
            overview={item.overview}
            release_date={item.release_date}
            aspect={
               cardLayout === 'masonry'
                  ? masonryAspect(index)
                  : DEFAULT_POSTER_ASPECT
            }
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
