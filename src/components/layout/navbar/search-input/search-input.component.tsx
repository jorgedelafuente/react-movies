import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ChangeEvent, useEffect,useState } from 'react';

import { Input } from '@/components/atoms/input/input.component';
import Spinner from '@/components/atoms/spinner/spinner.component';
import { searchFilm } from '@/services/films/films';
import type { FilmInfoType } from '@/types/films.types';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { sanitizeInput } from '@/utils/sanitizeInput';

const SearchInput = () => {
   const [inputValue, setInputValue] = useState<string>('');
   const queryClient = useQueryClient();
   const debouncedValue = useDebounce(inputValue, 400);

   const {
      mutate,
      isPending,
      data: searchInputList,
   } = useMutation({
      mutationFn: (debouncedValue: string) =>
         searchFilm(String(debouncedValue)),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['searchFilm'] });
      },
   });

   const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
      const sanitizedValue = sanitizeInput(e.target.value);
      setInputValue(sanitizedValue);
   };

   useEffect(() => {
      if (debouncedValue) {
         mutate(debouncedValue as string);
      }
   }, [debouncedValue]);

   const resetSearchQuery = () => {
      setInputValue('');
   };

   return (
      <div>
         <Input
            inputValue={inputValue}
            handleOnChange={handleOnChange}
            tabIndex={0}
            type="search"
            id="search-input"
            placeholder="Search"
         />

         {inputValue && debouncedValue ? (
            <ol className="absolute w-48 rounded-b-sm border-bold bg-neutral pb-1 pl-2 pt-1 text-copy">
               {isPending && debouncedValue && <Spinner />}

               {debouncedValue &&
                  searchInputList?.map((item: FilmInfoType) => (
                     <li className="" key={item.id} onClick={resetSearchQuery}>
                        <Link to={`/film/${item.id}`}>
                           <span className="text-sm text-copy hover:underline">
                              * {item.title}
                           </span>
                        </Link>
                     </li>
                  ))}
            </ol>
         ) : null}
      </div>
   );
};

export default SearchInput;
