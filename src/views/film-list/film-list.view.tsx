import './film-list.styles.css';

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
    * wide screens) row rhythm; other list routes keep the fixed grid.
    */
   cardLayout?: 'grid' | 'masonry' | 'rhythm';
};

const FilmList = ({ list, cardLayout = 'grid' }: FilmListProps) => {
   const view = useListView((state) => state.view);
   const setView = useListView((state) => state.setView);
   const hasNaturalAspect = cardLayout !== 'grid';
   const gridClassName =
      cardLayout === 'masonry'
         ? 'film-list__masonry'
         : cardLayout === 'rhythm'
           ? 'film-list__rhythm'
           : 'grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-8';

   return (
      <FlexContainer>
         <div className="flex justify-center">
            <ViewToggle value={view} onChange={setView} />
         </div>

         {view === LIST_VIEWS.TABLE ? (
            <FilmTable list={list} />
         ) : (
            <div className={gridClassName}>
               {list.map((item) => (
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
               ))}
            </div>
         )}
      </FlexContainer>
   );
};

export default FilmList;
