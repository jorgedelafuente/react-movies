import { ChangeEvent, useState } from 'react';

const SearchInput = () => {
   const [inputValue, setInputValue] = useState<number | string>('');

   const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
   };
   return (
      <>
         <input
            className="rounded-sm border-2 border-solid border-slate-200"
            type="search"
            id="search-input"
            value={inputValue}
            name="search-input"
            placeholder="Search"
            onChange={handleOnChange}
         />
         <div className="">{inputValue}</div>
      </>
   );
};

export default SearchInput;
