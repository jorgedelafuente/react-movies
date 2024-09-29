import { ReactNode } from 'react';

const Container = ({ children }: { children: ReactNode }) => {
   return (
      <div className="bg-primary-background-color flex flex-row flex-wrap justify-center gap-6 p-6 sm:p-4 md:p-10 lg:p-10">
         {children}
      </div>
   );
};

export default Container;
