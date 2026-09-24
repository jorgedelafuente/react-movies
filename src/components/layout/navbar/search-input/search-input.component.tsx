import './search-input.styles.css';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { type Key, useEffect, useState } from 'react';
import {
   Button,
   ComboBox,
   Input,
   Label,
   ListBox,
   ListBoxItem,
   Popover,
} from 'react-aria-components';

import Spinner from '@/components/atoms/spinner/spinner.component';
import { searchFilm } from '@/services/films/films';
import type { FilmInfoType } from '@/types/films.types';
import { THEME_OPTIONS } from '@/types/theme.types';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { useTheme } from '@/utils/hooks/useTheme';
import { sanitizeInput } from '@/utils/sanitizeInput';

const SearchInput = () => {
   const [inputValue, setInputValue] = useState('');
   const [portalContainer, setPortalContainer] =
      useState<HTMLDivElement | null>(null);
   const theme = useTheme((state) => state.theme);
   const navigate = useNavigate();
   const queryClient = useQueryClient();
   const debouncedValue = useDebounce(inputValue, 400);

   const {
      mutate,
      isPending,
      data: searchResults,
   } = useMutation({
      mutationFn: (query: string) => searchFilm(query),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['searchFilm'] });
      },
   });

   useEffect(() => {
      if (debouncedValue) {
         mutate(debouncedValue);
      }
      // mutate is stable across renders (TanStack Query guarantee)
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [debouncedValue]);

   const handleInputChange = (value: string) => {
      setInputValue(sanitizeInput(value));
   };

   const handleSelectionChange = (key: Key | null) => {
      if (key == null) {
         return;
      }
      navigate({ to: '/film/$filmId', params: { filmId: String(key) } });
      setInputValue('');
   };

   const items = debouncedValue ? (searchResults ?? []) : [];

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
         <Label className="search-combobox__label">Search films</Label>
         <div className="search-combobox__field">
            <Input
               id="search-input"
               className="search-combobox__input"
               placeholder="🔍 Search"
            />
            {isPending && (
               <div className="search-combobox__spinner">
                  <Spinner />
               </div>
            )}
            {inputValue && (
               <Button
                  className="search-combobox__clear"
                  aria-label="Clear search"
                  onPress={() => setInputValue('')}
               >
                  ✕
               </Button>
            )}
         </div>
         <Popover
            className="search-combobox__popover"
            UNSTABLE_portalContainer={portalContainer ?? undefined}
         >
            <ListBox<FilmInfoType>
               className="search-combobox__list"
               renderEmptyState={() =>
                  debouncedValue && !isPending ? (
                     <div className="search-combobox__empty">
                        No films found for &quot;{debouncedValue}&quot;
                     </div>
                  ) : null
               }
            >
               {(item) => (
                  <ListBoxItem
                     id={item.id}
                     textValue={item.title}
                     className="search-combobox__item"
                  >
                     <span className="search-combobox__item-title">
                        {item.title}
                     </span>
                     {item.release_date && (
                        <span className="search-combobox__item-year">
                           {item.release_date.slice(0, 4)}
                        </span>
                     )}
                  </ListBoxItem>
               )}
            </ListBox>
         </Popover>
      </ComboBox>
   );
};

export default SearchInput;
