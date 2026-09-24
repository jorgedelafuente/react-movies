import { ReactNode } from 'react';

import { THEME_OPTIONS } from '@/types/theme.types';
import { useTheme } from '@/utils/hooks/useTheme';

/**
 * Themed page root for the list routes. It owns the `dark` class, so every
 * descendant (toolbar, card grid, table) resolves the same colour tokens.
 *
 * Vertical padding matches the column gap at every breakpoint, so the first
 * child (the view toggle) sits exactly halfway between the navbar and the
 * first row of cards.
 */
const FlexContainer = ({ children }: { children: ReactNode }) => {
   const theme = useTheme((state) => state.theme);
   return (
      <div
         className={`${theme === THEME_OPTIONS.DARK ? THEME_OPTIONS.DARK : ''} flex min-h-screen justify-center bg-neutral bg-primary-background-color p-4 sm:p-6 lg:px-10 lg:py-6`}
      >
         <div className="flex w-full max-w-4xl flex-col gap-4 sm:gap-6">
            {children}
         </div>
      </div>
   );
};

export default FlexContainer;
