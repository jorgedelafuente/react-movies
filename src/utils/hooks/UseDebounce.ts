import { useEffect, useState } from 'react';

const DEFAULT_DEBOUNCED_TIME = 300;

/**
 * Debounced value.
 *
 * Creates a debounced value, every time the value passed as parameter changes.
 *
 * @param {object} value Reference to the observable value.
 * @param {number} delay Elapsed time to fire value change.
 */

export const useDebounce = (
   value: string | number,
   delay = DEFAULT_DEBOUNCED_TIME
) => {
   const [debouncedValue, setDebouncedValue] = useState(value);

   useEffect(() => {
      const timeoutHandler = setTimeout(() => {
         setDebouncedValue(value);
      }, delay);

      return () => clearTimeout(timeoutHandler);
   }, [value, delay]);

   return debouncedValue;
};
