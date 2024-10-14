import { ReactNode } from 'react';
import { THEME_OPTIONS } from '@/types/theme.types';
import { useTheme } from '@/utils/hooks/useTheme';

const FlexContainer = ({ children }: { children: ReactNode }) => {
   const theme = useTheme((state) => state.theme);
   return (
      <div
         className={`${theme === THEME_OPTIONS.DARK ? 'dark' : null} bg-neutral flex min-h-screen flex-row flex-wrap justify-center gap-6 bg-primary-background-color p-6`}
      >
         {children}
      </div>
   );
};

export default FlexContainer;
