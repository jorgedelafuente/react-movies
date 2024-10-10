import { useState } from 'react';

const Counter = ({ countValue = 0 }) => {
   const [count, setCount] = useState<number>(countValue);
   const increment = () => setCount((prevCount) => prevCount + 1);
   const decrement = () => setCount((prevCount) => prevCount - 1);
   return (
      <div className="flex-col border p-4 text-center">
         <div>
            If you enjoyed this app please give us a thumbs up : Current count:
            <span>{count}</span>
         </div>

         <div>
            <button onClick={decrement}>👎 Decrement</button>
         </div>
         <div>
            <button onClick={increment}>👍 Increment</button>
         </div>
      </div>
   );
};

export default Counter;
