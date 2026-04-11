export const THEME_OPTIONS = {
   DARK: 'dark',
   LIGHT: 'light',
} as const;

export type THEME_OPTIONS = (typeof THEME_OPTIONS)[keyof typeof THEME_OPTIONS];

export type DarkModeStateTypes = {
   theme: THEME_OPTIONS;
   toggleTheme: (param: THEME_OPTIONS) => void;
};
