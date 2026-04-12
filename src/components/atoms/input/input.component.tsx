export const Input = ({
   inputValue,
   handleOnChange,
}: {
   inputValue: string;
   handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
   return (
      <input
         className="placeholder-text-copy w-48 border-2 border-solid border-secondary-background-color bg-neutral px-2 text-copy"
         type="search"
         id="search-input"
         value={inputValue}
         name="search-input"
         placeholder="Search"
         onChange={handleOnChange}
      />
   );
};
