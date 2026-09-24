import { useState } from 'react';

import Button from '@/components/atoms/button/button.component';
import Chip from '@/components/atoms/chip/chip.component';
import Select from '@/components/atoms/select/select.component';
import { EYEBROW } from '@/components/atoms/stat/stat.component';
import WaveDivider from '@/components/atoms/wave-divider/wave-divider.component';
import KeywordFilter from '@/components/keyword-filter/keyword-filter.component';
import Container from '@/components/layout/container/container.component';
import {
   DISCOVER_MAX_PAGE,
   DISCOVER_MIN_YEAR,
   DISCOVER_SORT_LABELS,
   DISCOVER_SORTS,
   type DiscoverPage,
   type DiscoverParams,
   type DiscoverSearch,
   type DiscoverSort,
   MOVIE_ONLY_SORTS,
   STREAMING_PROVIDERS,
} from '@/types/discover.schemas';
import type { GenreType } from '@/types/films.schemas';
import {
   MEDIA_TYPE_PLURAL_LABELS,
   MEDIA_TYPES,
   type MediaType,
} from '@/types/media.types';
import type { KeywordType } from '@/types/search.schemas';
import FilmList from '@/views/film-list/film-list.view';

const YEARS = Array.from(
   { length: new Date().getFullYear() + 1 - DISCOVER_MIN_YEAR + 1 },
   (_, i) => new Date().getFullYear() + 1 - i
);

// The filters sit on a `bg-subtle` panel, the same surface as the ViewToggle
// track and the search field, so it reads in both themes. It hugs its content
// from `sm` up and spans the column on phones, where the fields stack. It is
// `relative` for the wave hanging from its top edge, and the extra top padding
// is what keeps the labels clear of it.
const formClass =
   'relative mx-auto mt-4 w-full flex-col gap-4 rounded-lg border border-copy/10 bg-subtle/70 px-5 pb-5 pt-10 text-left sm:w-fit sm:max-w-full sm:flex-row sm:flex-wrap sm:items-end sm:justify-center sm:gap-x-5 sm:px-7 sm:pb-6';

type DiscoverViewProps = {
   params: DiscoverParams;
   genres: GenreType[];
   /** `params.keyword` resolved to a name, when set. */
   keyword?: KeywordType;
   page: DiscoverPage;
   /** Partial search update; the route merges it into the URL. */
   onChange: (patch: DiscoverSearch) => void;
};

const DiscoverView = ({
   params,
   genres,
   keyword,
   page,
   onChange,
}: DiscoverViewProps) => {
   // Phones start with the filters collapsed behind a disclosure button; from
   // `sm` up the form is always visible and this state has no effect.
   const [filtersOpen, setFiltersOpen] = useState(false);
   const activeFilters =
      Number(params.genre !== undefined) +
      Number(params.keyword !== undefined) +
      Number(params.provider !== undefined) +
      Number(params.year !== undefined) +
      Number(params.sort !== DISCOVER_SORTS.POPULAR);

   const totalPages = Math.min(page.total_pages, DISCOVER_MAX_PAGE);
   const sorts = (Object.values(DISCOVER_SORTS) as DiscoverSort[]).filter(
      (sort) => params.type === MEDIA_TYPES.MOVIE || !MOVIE_ONLY_SORTS.has(sort)
   );

   const setType = (type: MediaType) => {
      if (type === params.type) return;
      // Genre ids differ between the movie and TV lists, so drop the filter.
      onChange({ type, genre: undefined, page: 1 });
   };

   const numberOrUndefined = (value: string) =>
      value === '' ? undefined : Number(value);

   // The select hands back a string; map it to the typed id or clear the filter.
   const providerOrUndefined = (value: string) =>
      STREAMING_PROVIDERS.find((p) => String(p.id) === value)?.id;

   return (
      <Container>
         <div className="mx-auto w-full px-4 py-6 text-copy sm:px-6 lg:px-10">
            <h1 className="text-display-lg">Discover</h1>

            <Chip
               className="mt-4 sm:hidden"
               aria-expanded={filtersOpen}
               aria-controls="discover-filters"
               onClick={() => setFiltersOpen((open) => !open)}
            >
               {filtersOpen ? 'Hide filters' : 'Show filters'}
               {activeFilters > 0 && (
                  <span className="rounded-full bg-accent/10 px-1.5 text-xs tabular-nums text-accent">
                     {activeFilters}
                     <span className="sr-only"> active</span>
                  </span>
               )}
               <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className={`h-3 w-3 fill-none stroke-current transition-transform ${
                     filtersOpen ? 'rotate-180' : ''
                  }`}
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
               >
                  <path d="m3 6 5 5 5-5" />
               </svg>
            </Chip>

            <form
               id="discover-filters"
               className={`${formClass} ${filtersOpen ? 'flex' : 'hidden sm:flex'}`}
               onSubmit={(e) => e.preventDefault()}
               aria-label="Discover filters"
            >
               <WaveDivider className="rounded-t-lg text-copy/25" />

               <fieldset className="flex flex-col">
                  <legend className={`${EYEBROW} mb-1.5`}>Type</legend>
                  {/* Same height as the controls, so the row aligns on its bottom edge. */}
                  <div className="flex h-10 items-center gap-2">
                     {(Object.values(MEDIA_TYPES) as MediaType[]).map(
                        (type) => (
                           <Chip
                              key={type}
                              selected={params.type === type}
                              onClick={() => setType(type)}
                           >
                              {MEDIA_TYPE_PLURAL_LABELS[type]}
                           </Chip>
                        )
                     )}
                  </div>
               </fieldset>

               <Select
                  id="discover-genre"
                  label="Genre"
                  className="sm:w-48"
                  value={params.genre ?? ''}
                  onChange={(e) =>
                     onChange({
                        genre: numberOrUndefined(e.target.value),
                        page: 1,
                     })
                  }
               >
                  <option value="">All genres</option>
                  {genres.map((g) => (
                     <option key={g.id} value={g.id}>
                        {g.name}
                     </option>
                  ))}
               </Select>

               <KeywordFilter
                  // Remount on change so the text starts from the new name.
                  key={keyword?.id ?? 'none'}
                  className="sm:w-48"
                  selected={keyword}
                  onSelect={(next) => onChange({ keyword: next?.id, page: 1 })}
               />

               <Select
                  id="discover-provider"
                  label="Streaming on"
                  className="sm:w-40"
                  value={params.provider ?? ''}
                  onChange={(e) =>
                     onChange({
                        provider: providerOrUndefined(e.target.value),
                        page: 1,
                     })
                  }
               >
                  <option value="">Any service</option>
                  {STREAMING_PROVIDERS.map((p) => (
                     <option key={p.id} value={p.id}>
                        {p.name}
                     </option>
                  ))}
               </Select>

               <Select
                  id="discover-sort"
                  label="Sort by"
                  className="sm:w-44"
                  value={params.sort}
                  onChange={(e) =>
                     onChange({
                        sort: e.target.value as DiscoverSort,
                        page: 1,
                     })
                  }
               >
                  {sorts.map((sort) => (
                     <option key={sort} value={sort}>
                        {DISCOVER_SORT_LABELS[sort]}
                     </option>
                  ))}
               </Select>

               <Select
                  id="discover-year"
                  label="Year"
                  className="sm:w-32"
                  value={params.year ?? ''}
                  onChange={(e) =>
                     onChange({
                        year: numberOrUndefined(e.target.value),
                        page: 1,
                     })
                  }
               >
                  <option value="">Any year</option>
                  {YEARS.map((year) => (
                     <option key={year} value={year}>
                        {year}
                     </option>
                  ))}
               </Select>
            </form>
         </div>

         {page.results.length === 0 ? (
            <p className="px-4 py-10 text-copy/70">
               Nothing matches those filters. Try a different genre, keyword,
               year or streaming service.
            </p>
         ) : (
            <FilmList list={page.results} embedded />
         )}

         {/*
           Result count and page position sit with the pager, not under the
           filters. `mt-auto` pins the footer to the bottom of the viewport when
           the results are short (the Container is a min-h-screen flex column).
           The footer is a full-width band with a faint wave along each edge;
           the inner padding keeps the text clear of both.
         */}
         <footer className="mt-auto w-full pt-6 sm:pt-8">
            <div className="relative flex w-full flex-col items-center gap-3 px-4 py-10">
               <WaveDivider className="text-copy/15" />
               <WaveDivider edge="bottom" className="text-copy/15" />
               <p className="text-sm tabular-nums text-copy/70" role="status">
                  {page.total_results.toLocaleString()} result
                  {page.total_results === 1 ? '' : 's'}
                  {totalPages > 0 && (
                     <>
                        <span className="mx-1 opacity-50">·</span>
                        page {params.page} of {totalPages.toLocaleString()}
                     </>
                  )}
               </p>
               {totalPages > 1 && (
                  <nav
                     aria-label="Pagination"
                     className="flex w-full max-w-xs gap-3"
                  >
                     <Button
                        variant="secondary"
                        disabled={params.page <= 1}
                        onClick={() => onChange({ page: params.page - 1 })}
                     >
                        Previous
                     </Button>
                     <Button
                        variant="primary"
                        disabled={params.page >= totalPages}
                        onClick={() => onChange({ page: params.page + 1 })}
                     >
                        Next
                     </Button>
                  </nav>
               )}
            </div>
         </footer>
      </Container>
   );
};

export default DiscoverView;
