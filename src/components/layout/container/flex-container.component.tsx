import { ReactNode } from 'react';

import { THEME_OPTIONS } from '@/types/theme.types';
import { useTheme } from '@/utils/hooks/useTheme';

const FlexContainer = ({ children }: { children: ReactNode }) => {
   const theme = useTheme((state) => state.theme);
   return (
      <div
         className={`${theme === THEME_OPTIONS.DARK ? 'dark' : null} grid min-h-screen grid-cols-2 gap-4 bg-neutral bg-primary-background-color p-4 sm:grid-cols-3 sm:gap-6 sm:p-6 lg:grid-cols-4 lg:gap-8 lg:p-10`}
      >
         {children}
      </div>
   );
};

export default FlexContainer;
