import type { DarkModeStateTypes } from '@/types/theme.types';
import { THEME_OPTIONS } from '@/types/theme.types';
import { create } from 'zustand';

export const useTheme = create<DarkModeStateTypes>((set) => ({
   theme: THEME_OPTIONS.DARK,
   toggleTheme: (val) => set(() => ({ theme: val })),
}));
