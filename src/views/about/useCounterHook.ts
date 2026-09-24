import { useState } from 'react';

export const useCounterHook = (initialCountValue = 0) => {
   const [count, setCount] = useState<number>(initialCountValue);
   const increment = () => setCount((prevCount) => prevCount + 1);
   const decrement = () => setCount((prevCount) => prevCount - 1);

   return {
      count,
      decrement,
      increment,
   };
};
