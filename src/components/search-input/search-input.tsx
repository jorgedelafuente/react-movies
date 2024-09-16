import { ChangeEvent, useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { searchFilm } from '@/services/films/films';
import { useDebounce } from '@/utils/hooks/UseDebounce';
import type { FilmInfoType } from '@/types/films.types';
import Spinner from '../spinner/Spinner/spinner.component';

const SearchInput = () => {
   const [inputValue, setInputValue] = useState<number | string>('');
   const queryClient = useQueryClient();
   const debouncedValue = useDebounce(inputValue, 400);

   const mutation = useMutation({
      mutationFn: (debouncedValue: string) =>
         searchFilm(String(debouncedValue)),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['searchFilm'] });
      },
   });
   console.log('TCL: SearchInput -> mutation', mutation);

   const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
   };

   useEffect(() => {
      mutation.mutate(debouncedValue as string);
   }, [debouncedValue]);

   const resetSearchQuery = () => {
      setInputValue('');
   };

   return (
      <>
         <input
            className="w-48 border-2 border-solid border-slate-200 bg-black"
            type="search"
            id="search-input"
            value={inputValue}
            name="search-input"
            placeholder="Search"
            onChange={handleOnChange}
         />

         <ol className="absolute w-48 rounded-b-sm border-slate-200 bg-black pb-1 pl-2 pt-1">
            {mutation.isPending && debouncedValue && <Spinner />}

            {mutation.data?.map((item: FilmInfoType) => (
               <li className="" key={item.id} onClick={resetSearchQuery}>
                  <Link to={`/film/${item.id}`}>
                     <span className="text-sm text-slate-100 hover:underline">
                        * {item.title}
                     </span>
                  </Link>
               </li>
            ))}
         </ol>
      </>
   );
};

export default SearchInput;
