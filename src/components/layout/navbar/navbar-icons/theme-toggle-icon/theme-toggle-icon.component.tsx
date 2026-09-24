import './theme-toggle-icon.styles.css';

import { useEffect } from 'react';

import { THEME_OPTIONS } from '@/types/theme.types';
import { useTheme } from '@/utils/hooks/useTheme';

import NavIconButton from '../nav-icon-button/nav-icon-button.component';

/**
 * Sun / moon switch. The glyph shows the mode a click would move to (a sun in
 * dark mode), and the two glyphs are always mounted so the swap can rotate
 * and cross-fade instead of popping.
 */
const ThemeToggleIcon = ({ tabIndex }: { tabIndex?: number }) => {
   const theme = useTheme((state) => state.theme);
   const toggleTheme = useTheme((state) => state.toggleTheme);

   useEffect(() => {
      const prefersDarkMode = globalThis.matchMedia(
         '(prefers-color-scheme: dark)'
      );
      toggleTheme(THEME_OPTIONS.DARK);
      prefersDarkMode.addEventListener('change', () => {
         toggleTheme(THEME_OPTIONS.DARK);
      });
   }, [toggleTheme]);

   const isDarkMode = theme === THEME_OPTIONS.DARK;

   const toggleDarkMode = () => {
      toggleTheme(isDarkMode ? THEME_OPTIONS.LIGHT : THEME_OPTIONS.DARK);
   };

   return (
      <NavIconButton
         label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
         onClick={toggleDarkMode}
         tabIndex={tabIndex}
         data-theme={theme}
      >
         <SunGlyph />
         <MoonGlyph />
      </NavIconButton>
   );
};

export default ThemeToggleIcon;

const SunGlyph = () => (
   <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="nav-icon-button__icon theme-toggle__glyph theme-toggle__glyph--sun"
   >
      <circle cx="12" cy="12" r="3.5" className="nav-icon-button__tint" />
      <path d="M12 3v1.75M12 19.25V21M3 12h1.75M19.25 12H21M5.64 5.64l1.24 1.24M17.12 17.12l1.24 1.24M5.64 18.36l1.24-1.24M17.12 6.88l1.24-1.24" />
   </svg>
);

const MoonGlyph = () => (
   <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="nav-icon-button__icon theme-toggle__glyph theme-toggle__glyph--moon"
   >
      <path
         d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z"
         className="nav-icon-button__tint"
      />
      <path d="M18 2.5v3M16.5 4h3" />
   </svg>
);
