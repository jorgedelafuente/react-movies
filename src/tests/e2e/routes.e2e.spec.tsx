import { test, expect } from '@playwright/test';
import { MOCK_FILM_LIST } from '../__mocks__/mocks';

const mockFilmsList = {
   results: [MOCK_FILM_LIST.results[0], MOCK_FILM_LIST.results[1]],
};

test('Homepage has application title', async ({ page }) => {
   await page.goto('./');
   await page.screenshot({ path: 'screenshot0.png' });
   await expect(page).toHaveTitle(/React Movies - Vite & Typescript/);
});

test('Homepage Renders Content Correct', async ({ page }) => {
   await page.route('*/**/movie/*', async (route) => {
      await route.fulfill({ json: mockFilmsList });
   });
   await page.goto('./');
   await expect(page.getByText('The Substance')).toBeVisible();
});
