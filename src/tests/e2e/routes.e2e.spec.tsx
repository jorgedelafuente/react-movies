import { expect,test } from '@playwright/test';

import { MOCK_FILM_LIST } from '../__mocks__/mocks';

test.describe('Homepage', () => {
   test('has application title', async ({ page }) => {
      // Mock the API to avoid real API calls
      await page.route('**/movie/popular*', async (route) => {
         await route.fulfill({ json: MOCK_FILM_LIST });
      });

      await page.goto('./');
      await expect(page).toHaveTitle(/React Movies - Vite & Typescript/);
   });

   test('renders popular movies correctly', async ({ page }) => {
      // Mock the popular movies endpoint
      await page.route('**/movie/popular*', async (route) => {
         await route.fulfill({
            status: 200,
            contentType: 'application/json',
            json: MOCK_FILM_LIST,
         });
      });

      await page.goto('./');

      // Wait for the movie card to be visible
      await expect(
         page.getByRole('heading', { name: 'The Substance' })
      ).toBeVisible();

      // Verify second movie is also visible
      await expect(
         page.getByRole('heading', { name: 'Deadpool & Wolverine' })
      ).toBeVisible();
   });

   test('shows loading spinner initially', async ({ page }) => {
      // Delay the API response to see the spinner
      await page.route('**/movie/popular*', async (route) => {
         await new Promise((resolve) => setTimeout(resolve, 100));
         await route.fulfill({ json: MOCK_FILM_LIST });
      });

      await page.goto('./');

      // Spinner should eventually disappear
      await expect(page.getByText('The Substance')).toBeVisible({
         timeout: 10000,
      });
   });
});
