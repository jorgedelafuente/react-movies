export enum THEME_OPTIONS {
   DARK = 'dark',
   LIGHT = 'light',
}

export type DarkModeStateTypes = {
   theme: THEME_OPTIONS;
   toggleTheme: (param: THEME_OPTIONS) => void;
};
