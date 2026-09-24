import './search-input.styles.css';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { type Key, useState } from 'react';
import {
   ComboBox,
   Input,
   Label,
   ListBox,
   ListBoxItem,
   Popover,
} from 'react-aria-components';

import MediaImage from '@/components/atoms/media-image/media-image.component';
import Spinner from '@/components/atoms/spinner/spinner.component';
import { baseImagePathThumb } from '@/services/config';
import { mediaSearchQueryOptions } from '@/services/search/searchQueryOptions';
import type { FilmInfoType } from '@/types/films.types';
import { MEDIA_TYPE_LABELS, MEDIA_TYPES } from '@/types/media.types';
import { THEME_OPTIONS } from '@/types/theme.types';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { useTheme } from '@/utils/hooks/useTheme';
import { sanitizeInput } from '@/utils/sanitizeInput';

/** Movie and TV ids overlap, so list keys must carry the media type. */
const itemKey = (item: FilmInfoType) => `${item.media_type}:${item.id}`;

/** "8.4" for a rated title; nothing for unreleased or unrated ones. */
const formatRating = (item: FilmInfoType) =>
   item.vote_average && item.vote_count ? item.vote_average.toFixed(1) : null;

const SearchInput = () => {
   const [inputValue, setInputValue] = useState('');
   const [portalContainer, setPortalContainer] =
      useState<HTMLDivElement | null>(null);
   const theme = useTheme((state) => state.theme);
   const navigate = useNavigate();
   const debouncedValue = useDebounce(inputValue, 400);

   // The sanitiser keeps spaces, so trim before deciding whether to search:
   // a lone space must not fire a request.
   const typed = inputValue.trim();
   const query = debouncedValue.trim();

   const { data: searchResults, isFetching } = useQuery({
      ...mediaSearchQueryOptions(query),
      enabled: query !== '',
      // Keep the last list on screen while the next keystroke's results load.
      placeholderData: keepPreviousData,
   });

   // Gate on the live input as well as the debounced one so the clear button
   // empties the list at once instead of after the debounce.
   const showResults = typed !== '' && query !== '';
   const items = showResults ? (searchResults ?? []) : [];

   const handleInputChange = (value: string) => {
      setInputValue(sanitizeInput(value));
   };

   const handleSelectionChange = (key: Key | null) => {
      const item = items.find((candidate) => itemKey(candidate) === key);
      if (!item) return;

      if (item.media_type === MEDIA_TYPES.TV) {
         navigate({
            to: '/tv/$seriesId',
            params: { seriesId: String(item.id) },
         });
      } else {
         navigate({ to: '/film/$filmId', params: { filmId: String(item.id) } });
      }
      setInputValue('');
   };

   const renderEmptyState = () => {
      if (typed === '') {
         return (
            <div className="search-combobox__empty">
               Search films and series by title
            </div>
         );
      }
      if (query !== typed || isFetching) {
         return <div className="search-combobox__empty">Searching…</div>;
      }
      return (
         <div className="search-combobox__empty">
            No films or series found for &quot;{query}&quot;
         </div>
      );
   };

   return (
      <ComboBox<FilmInfoType>
         ref={setPortalContainer}
         className={`search-combobox ${theme === THEME_OPTIONS.DARK ? 'dark' : ''}`.trim()}
         inputValue={inputValue}
         onInputChange={handleInputChange}
         items={items}
         defaultFilter={() => true}
         allowsEmptyCollection
         onSelectionChange={handleSelectionChange}
      >
         <Label className="search-combobox__label">
            Search films and series
         </Label>
         <div className="search-combobox__field">
            <svg
               aria-hidden="true"
               viewBox="0 0 24 24"
               className="search-combobox__icon"
               fill="none"
               stroke="currentColor"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
            >
               <circle cx="11" cy="11" r="7" />
               <path d="m20 20-3.5-3.5" />
            </svg>
            <Input
               id="search-input"
               className="search-combobox__input"
               placeholder="Search films and series"
            />
            {isFetching && (
               <div className="search-combobox__spinner">
                  <Spinner />
               </div>
            )}
            {inputValue && (
               // A plain button: a react-aria Button inside ComboBox becomes
               // the popover trigger and takes the field's label as its name.
               <button
                  type="button"
                  className="search-combobox__clear"
                  aria-label="Clear search"
                  onClick={() => setInputValue('')}
               >
                  ✕
               </button>
            )}
         </div>
         <Popover
            className="search-combobox__popover"
            UNSTABLE_portalContainer={portalContainer ?? undefined}
            // The popover is portalled into the positioned root above, so
            // react-aria's default 12px boundary padding would shift it
            // sideways off the field. Zero it and keep a small gap below.
            containerPadding={0}
            offset={6}
            // Centre under the field: from `lg` the panel is wider than it.
            placement="bottom"
         >
            <ListBox<FilmInfoType>
               className="search-combobox__list"
               renderEmptyState={renderEmptyState}
            >
               {(item) => {
                  const year = item.release_date?.slice(0, 4);
                  const rating = formatRating(item);

                  return (
                     <ListBoxItem
                        id={itemKey(item)}
                        textValue={item.title}
                        className="search-combobox__item"
                     >
                        <MediaImage
                           path={item.poster_path}
                           alt=""
                           className="search-combobox__item-poster"
                           basePath={baseImagePathThumb}
                        />
                        <span className="search-combobox__item-body">
                           <span className="search-combobox__item-title">
                              {item.title}
                           </span>
                           <span className="search-combobox__item-meta">
                              <span className="search-combobox__item-type">
                                 {MEDIA_TYPE_LABELS[item.media_type]}
                              </span>
                              {year && (
                                 <span className="search-combobox__item-year">
                                    {year}
                                 </span>
                              )}
                              {rating && (
                                 <span className="search-combobox__item-rating">
                                    <span aria-hidden="true">★</span> {rating}
                                 </span>
                              )}
                           </span>
                           {item.overview && (
                              <span className="search-combobox__item-overview">
                                 {item.overview}
                              </span>
                           )}
                        </span>
                     </ListBoxItem>
                  );
               }}
            </ListBox>
         </Popover>
      </ComboBox>
   );
};

export default SearchInput;
