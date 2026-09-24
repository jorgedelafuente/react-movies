import './navbar.styles.css';

import { useEffect, useRef } from 'react';

import NavLink from '@/components/atoms/link/navlink.component';
import WaveDivider from '@/components/atoms/wave-divider/wave-divider.component';
import { THEME_OPTIONS } from '@/types/theme.types';
import { useTheme } from '@/utils/hooks/useTheme';

import NavMenu from './nav-menu/nav-menu.component';
import LoginIcon from './navbar-icons/login-icon/login-icon.component';
import ThemeToggleIcon from './navbar-icons/theme-toggle-icon/theme-toggle-icon.component';
import SearchInput from './search-input/search-input.component';

const FILM_LINKS = [
   { path: '/popular', text: 'Popular' },
   { path: '/top-rated', text: 'Top Rated' },
   { path: '/upcoming', text: 'Upcoming' },
   { path: '/now-playing', text: 'Now Playing' },
];

const SERIES_LINKS = [
   { path: '/series/popular', text: 'Popular' },
   { path: '/series/top-rated', text: 'Top Rated' },
   { path: '/series/on-the-air', text: 'On The Air' },
];

/**
 * CSS custom property carrying the navbar's rendered height in px. The sticky
 * page title (`atoms/sticky-title`) reads it for its `top`, so it sits just
 * under the bar however many rows the bar wraps to. global.css declares the
 * 0px default; Navbar overwrites it inline on `<html>`.
 */
export const NAVBAR_HEIGHT_VAR = '--navbar-height';

const Navbar = () => {
   const theme = useTheme((state) => state.theme);
   const barRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const bar = barRef.current;
      if (!bar || typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(([entry]) => {
         const height =
            entry.borderBoxSize?.[0]?.blockSize ??
            bar.getBoundingClientRect().height;
         document.documentElement.style.setProperty(
            NAVBAR_HEIGHT_VAR,
            `${height}px`
         );
      });
      observer.observe(bar);
      return () => {
         observer.disconnect();
         document.documentElement.style.removeProperty(NAVBAR_HEIGHT_VAR);
      };
   }, []);

   return (
      <div
         ref={barRef}
         className={`${theme === THEME_OPTIONS.DARK ? 'dark' : null} navbar sticky top-0 z-10 m-auto flex flex-col items-center border-b-2 border-solid border-secondary-background-color bg-primary-background-color p-4`}
      >
         <WaveDivider />
         {/*
           One wrapping row. Up to `lg` the search takes a full-width second
           line under the links and icons; from `lg` the row stops wrapping and
           the search sits between them, so the bar is a single line.
         */}
         <div className="flex w-full flex-wrap items-start justify-between gap-2 sm:items-center lg:flex-nowrap lg:gap-6">
            <nav
               aria-label="Browse"
               className="flex items-center gap-4 sm:gap-6"
            >
               <NavLink path="/" text="Discover" />
               <NavMenu label="Films" links={FILM_LINKS} />
               <NavMenu label="Series" links={SERIES_LINKS} />
            </nav>
            <div className="order-3 flex basis-full justify-center lg:order-2 lg:min-w-0 lg:flex-1 lg:basis-0">
               <SearchInput />
            </div>
            <div className="order-2 flex items-center gap-1 lg:order-3">
               <ThemeToggleIcon tabIndex={0} />
               <LoginIcon tabIndex={0} />
            </div>
         </div>
      </div>
   );
};

export default Navbar;
