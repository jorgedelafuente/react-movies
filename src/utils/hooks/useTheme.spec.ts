import { beforeEach, describe, expect, it } from 'vitest';

import { THEME_OPTIONS } from '@/types/theme.types';

import { useTheme } from './useTheme';

beforeEach(() => {
   useTheme.setState({ theme: THEME_OPTIONS.DARK });
});

describe('useTheme', () => {
   it('defaults to dark theme', () => {
      expect(useTheme.getState().theme).toBe(THEME_OPTIONS.DARK);
   });

   it('toggles to light theme', () => {
      useTheme.getState().toggleTheme(THEME_OPTIONS.LIGHT);
      expect(useTheme.getState().theme).toBe(THEME_OPTIONS.LIGHT);
   });

   it('toggles back to dark theme', () => {
      useTheme.getState().toggleTheme(THEME_OPTIONS.LIGHT);
      useTheme.getState().toggleTheme(THEME_OPTIONS.DARK);
      expect(useTheme.getState().theme).toBe(THEME_OPTIONS.DARK);
   });
});
