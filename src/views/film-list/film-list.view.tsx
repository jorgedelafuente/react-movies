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
    * Render only the toggle-and-cards column, for a page that already has a
    * themed root of its own (Discover renders inside `Container`). By default
    * the list is wrapped in `FlexContainer`, the list routes' page root, which
    * brings `min-h-screen`, the page padding and the theme class.
    */
   embedded?: boolean;
};

const FilmList = ({ list, embedded = false }: FilmListProps) => {
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

   const column = (
      <>
         <div className="flex justify-center">
            <ViewToggle value={view} onChange={setView} />
         </div>

         {view === LIST_VIEWS.TABLE ? (
            <FilmTable list={list} />
         ) : (
            <CardGrid>{cards}</CardGrid>
         )}
      </>
   );

   if (embedded) {
      // Same horizontal padding as FlexContainer so the grid lines up with the
      // list pages; vertical rhythm is the host page's to decide.
      return (
         <div className="flex w-full flex-col gap-4 px-4 sm:gap-6 sm:px-6 lg:px-10">
            {column}
         </div>
      );
   }

   return <FlexContainer>{column}</FlexContainer>;
};

export default FilmList;
