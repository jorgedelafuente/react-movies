import './keyword-filter.styles.css';

import { useQuery } from '@tanstack/react-query';
import { type Key, useState } from 'react';
import {
   ComboBox,
   Input,
   Label,
   ListBox,
   ListBoxItem,
   Popover,
} from 'react-aria-components';

import { FIELD_CONTROL } from '@/components/atoms/select/select.component';
import { EYEBROW } from '@/components/atoms/stat/stat.component';
import { keywordSearchQueryOptions } from '@/services/search/searchQueryOptions';
import type { KeywordType } from '@/types/search.schemas';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { sanitizeInput } from '@/utils/sanitizeInput';

/** TMDB keyword search is noisy on a single letter. */
const MIN_QUERY_LENGTH = 2;

type KeywordFilterProps = {
   /**
    * The keyword currently applied, already resolved to a name. Remount the
    * component (`key={selected?.id}`) when it changes from outside so the
    * text field starts from the new name.
    */
   selected?: KeywordType;
   onSelect: (keyword: KeywordType | undefined) => void;
   className?: string;
};

/**
 * Typeahead over TMDB keywords ("heist", "time travel", "based on a novel")
 * for the discover filters. Picks an id; the parent puts it in the URL.
 */
const KeywordFilter = ({
   selected,
   onSelect,
   className = '',
}: KeywordFilterProps) => {
   const [inputValue, setInputValue] = useState(selected?.name ?? '');
   const [portalContainer, setPortalContainer] =
      useState<HTMLDivElement | null>(null);
   const query = useDebounce(inputValue, 300);
   // Don't search for the name that is already selected on mount.
   const canSearch =
      query.length >= MIN_QUERY_LENGTH && query !== selected?.name;

   // No `keepPreviousData` here: a stale list would let Enter pick a keyword
   // from the previous query, and that pick goes straight into the URL.
   const { data: suggestions, isFetching } = useQuery({
      ...keywordSearchQueryOptions(query),
      enabled: canSearch,
   });

   const items = canSearch ? (suggestions ?? []) : [];

   const handleSelectionChange = (key: Key | null) => {
      const keyword = items.find((k) => k.id === key);
      if (keyword && keyword.id !== selected?.id) {
         setInputValue(keyword.name);
         onSelect(keyword);
         return;
      }
      // With both the text and the selection controlled, react-aria does not
      // reset the text itself when the field loses focus without a pick: it
      // re-sends the current key (or null) and leaves the text to us.
      setInputValue(selected?.name ?? '');
   };

   const clear = () => {
      setInputValue('');
      onSelect(undefined);
   };

   return (
      <ComboBox<KeywordType>
         ref={setPortalContainer}
         className={`keyword-filter flex flex-col gap-1.5 text-left ${className}`.trim()}
         inputValue={inputValue}
         onInputChange={(value) => setInputValue(sanitizeInput(value))}
         items={items}
         selectedKey={selected?.id ?? null}
         onSelectionChange={handleSelectionChange}
         defaultFilter={() => true}
         allowsEmptyCollection
      >
         <Label className={EYEBROW}>Keyword</Label>
         <div className="relative flex items-center">
            <Input
               className={`${FIELD_CONTROL} pr-10 placeholder:text-copy/50`}
               placeholder="Any keyword"
            />
            {inputValue && (
               // A plain button: a react-aria Button inside ComboBox becomes
               // the popover trigger and takes the field's label as its name.
               <button
                  type="button"
                  className="absolute right-1.5 grid h-7 w-7 place-items-center rounded-full text-copy/60 hover:bg-subtle hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                  aria-label="Clear keyword"
                  onClick={clear}
               >
                  ✕
               </button>
            )}
         </div>
         <Popover
            className="keyword-filter__popover"
            UNSTABLE_portalContainer={portalContainer ?? undefined}
         >
            <ListBox<KeywordType>
               className="keyword-filter__list"
               renderEmptyState={() =>
                  canSearch && !isFetching ? (
                     <div className="keyword-filter__empty">
                        No keywords match &quot;{query}&quot;
                     </div>
                  ) : null
               }
            >
               {(item) => (
                  <ListBoxItem
                     id={item.id}
                     textValue={item.name}
                     className="keyword-filter__item"
                  >
                     {item.name}
                  </ListBoxItem>
               )}
            </ListBox>
         </Popover>
      </ComboBox>
   );
};

export default KeywordFilter;
