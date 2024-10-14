import { ReactNode } from 'react';
import { THEME_OPTIONS } from '@/types/theme.types';
import { useTheme } from '@/utils/hooks/useTheme';

const Container = ({ children }: { children: ReactNode }) => {
   const theme = useTheme((state) => state.theme);
   return (
      <div
         className={`${theme === THEME_OPTIONS.DARK ? THEME_OPTIONS.DARK : null} bg-neutral flex min-h-screen flex-col text-center`}
      >
         {children}
      </div>
   );
};

export default Container;
