import './navbar.styles.css';

import { useEffect, useRef } from 'react';

import NavLink from '@/components/atoms/link/navlink.component';
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
         <div className="custom-shape-divider-top">
            <svg
               data-name="Layer 1"
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 1200 120"
               preserveAspectRatio="none"
            >
               <path
                  d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                  opacity=".25"
                  className="shape-fill"
               />
               <path
                  d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                  opacity=".15"
                  className="shape-fill"
               />
               <path
                  d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                  className="shape-fill"
               />
            </svg>
         </div>
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
               <NavMenu label="Films" links={FILM_LINKS} />
               <NavMenu label="Series" links={SERIES_LINKS} />
               <NavLink path="/discover" text="Discover" />
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
