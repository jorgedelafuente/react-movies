export const Input = ({
   inputValue,
   handleOnChange,
   tabIndex,
   type = 'text',
   label,
   error,
   placeholder,
   id = 'input',
   name,
}: {
   inputValue: string;
   handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   tabIndex?: number;
   type?: React.HTMLInputTypeAttribute;
   label?: string;
   error?: string;
   placeholder?: string;
   id?: string;
   name?: string;
}) => {
   return (
      <div className="flex w-full flex-col gap-1">
         {label && (
            <label htmlFor={id} className="text-sm text-copy">
               {label}
            </label>
         )}
         <input
            className={`placeholder-text-copy w-full border-2 border-solid bg-neutral px-2 py-1 text-copy ${
               error
                  ? 'border-red-500'
                  : 'border-secondary-background-color'
            }`}
            type={type}
            id={id}
            value={inputValue}
            name={name ?? id}
            placeholder={placeholder}
            onChange={handleOnChange}
            tabIndex={tabIndex}
         />
         {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
   );
};
