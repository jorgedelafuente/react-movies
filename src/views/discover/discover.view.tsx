import { useState } from 'react';

import Button from '@/components/atoms/button/button.component';
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
} from '@/types/discover.schemas';
import type { GenreType } from '@/types/films.types';
import {
   MEDIA_TYPE_PLURAL_LABELS,
   MEDIA_TYPES,
   type MediaType,
} from '@/types/media.types';
import FilmList from '@/views/film-list/film-list.view';

const YEARS = Array.from(
   { length: new Date().getFullYear() + 1 - DISCOVER_MIN_YEAR + 1 },
   (_, i) => new Date().getFullYear() + 1 - i
);

const selectClass =
   'w-full rounded-md border-2 border-solid border-secondary-background-color bg-neutral px-2 py-1 text-copy';
const labelClass = 'text-sm font-medium';
const formClass =
   'mt-4 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-center';

type DiscoverViewProps = {
   params: DiscoverParams;
   genres: GenreType[];
   page: DiscoverPage;
   /** Partial search update; the route merges it into the URL. */
   onChange: (patch: DiscoverSearch) => void;
};

const DiscoverView = ({
   params,
   genres,
   page,
   onChange,
}: DiscoverViewProps) => {
   // Phones start with the filters collapsed behind a disclosure button; from
   // `sm` up the form is always visible and this state has no effect.
   const [filtersOpen, setFiltersOpen] = useState(false);
   const activeFilters =
      Number(params.genre !== undefined) +
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

   return (
      <Container>
         <div className="mx-auto w-full px-4 py-6 text-copy">
            <h1 className="text-display-lg">Discover</h1>

            <button
               type="button"
               className="mt-4 inline-flex items-center gap-2 rounded-full border border-copy/30 px-3 py-1 text-sm font-medium hover:border-accent hover:text-accent sm:hidden"
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
            </button>

            <form
               id="discover-filters"
               className={`${formClass} ${filtersOpen ? 'flex' : 'hidden sm:flex'}`}
               onSubmit={(e) => e.preventDefault()}
               aria-label="Discover filters"
            >
               <fieldset className="flex gap-2">
                  <legend className="mb-1 text-sm font-medium">Type</legend>
                  {(Object.values(MEDIA_TYPES) as MediaType[]).map((type) => (
                     <button
                        key={type}
                        type="button"
                        onClick={() => setType(type)}
                        aria-pressed={params.type === type}
                        className={`rounded-full border px-3 py-1 text-sm ${
                           params.type === type
                              ? 'border-accent bg-accent/10 text-accent'
                              : 'border-copy/30 hover:border-accent hover:text-accent'
                        }`}
                     >
                        {MEDIA_TYPE_PLURAL_LABELS[type]}
                     </button>
                  ))}
               </fieldset>

               <div className="flex flex-col gap-1 sm:w-48">
                  <label htmlFor="discover-genre" className={labelClass}>
                     Genre
                  </label>
                  <select
                     id="discover-genre"
                     className={selectClass}
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
                  </select>
               </div>

               <div className="flex flex-col gap-1 sm:w-44">
                  <label htmlFor="discover-sort" className={labelClass}>
                     Sort by
                  </label>
                  <select
                     id="discover-sort"
                     className={selectClass}
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
                  </select>
               </div>

               <div className="flex flex-col gap-1 sm:w-32">
                  <label htmlFor="discover-year" className={labelClass}>
                     Year
                  </label>
                  <select
                     id="discover-year"
                     className={selectClass}
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
                  </select>
               </div>
            </form>

            <p className="mt-4 text-sm tabular-nums text-copy/70" role="status">
               {page.total_results.toLocaleString()} result
               {page.total_results === 1 ? '' : 's'}
               {totalPages > 0 && (
                  <>
                     <span className="mx-1 opacity-50">·</span>
                     page {params.page} of {totalPages.toLocaleString()}
                  </>
               )}
            </p>
         </div>

         {page.results.length === 0 ? (
            <p className="px-4 text-copy/70">
               Nothing matches those filters. Try a different genre or year.
            </p>
         ) : (
            <FilmList list={page.results} />
         )}

         {totalPages > 1 && (
            <nav
               aria-label="Pagination"
               className="mx-auto mt-6 flex w-full max-w-xs gap-3 px-4 pb-8"
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
      </Container>
   );
};

export default DiscoverView;
