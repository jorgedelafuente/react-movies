import { useRef, useEffect } from 'react';

/**
 * usePrevious.
 *
 * A hook that fetches from the paramOptions object which contain the api fetching options.
 *
 * @param {string} value The value that will be compared.
 */

function usePrevious(value) {
   // The ref object is a generic container whose current property is mutable ...
   // ... and can hold any value, similar to an instance property on a class
   const ref = useRef();
   // Store current value in ref
   useEffect(() => {
      if (ref.current) ref.current = value;
   }, [value]); // Only re-run if value changes
   // Return previous value (happens before update in useEffect above)
   return ref.current;
}
export { usePrevious };
