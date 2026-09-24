import { expect, test } from '@playwright/test';

import {
   MOCK_FILM_LIST,
   MOCK_SERIES_CREDITS,
   MOCK_SERIES_INFO,
   MOCK_SERIES_LIST,
   MOCK_SERIES_RECOMMENDATIONS,
} from '../__mocks__/mocks';

const EMPTY_VIDEOS = { id: 1399, results: [] };

const mockSeriesDetail = async (page: import('@playwright/test').Page) => {
   // `/tv/1399?api_key=...` — the detail payload with appended external_ids
   await page.route(/\/tv\/1399\?/, async (route) => {
      await route.fulfill({ json: MOCK_SERIES_INFO });
   });
   await page.route(/\/tv\/1399\/videos/, async (route) => {
      await route.fulfill({ json: EMPTY_VIDEOS });
   });
   await page.route(/\/tv\/1399\/credits/, async (route) => {
      await route.fulfill({ json: MOCK_SERIES_CREDITS });
   });
   await page.route(/\/tv\/1399\/recommendations/, async (route) => {
      await route.fulfill({ json: MOCK_SERIES_RECOMMENDATIONS });
   });
};

test.describe('Series', () => {
   test('lists popular series at /series/popular', async ({ page }) => {
      await page.route('**/tv/popular*', async (route) => {
         await route.fulfill({ json: MOCK_SERIES_LIST });
      });

      await page.goto('./series/popular');

      await expect(
         page.getByRole('heading', { name: 'Game of Thrones' })
      ).toBeVisible();
      await expect(
         page.getByRole('heading', { name: 'Breaking Bad' })
      ).toBeVisible();
   });

   test('lists top rated and on the air series', async ({ page }) => {
      await page.route('**/tv/top_rated*', async (route) => {
         await route.fulfill({ json: MOCK_SERIES_LIST });
      });
      await page.route('**/tv/on_the_air*', async (route) => {
         await route.fulfill({ json: MOCK_SERIES_LIST });
      });

      await page.goto('./series/top-rated');
      await expect(
         page.getByRole('heading', { name: 'Game of Thrones' })
      ).toBeVisible();

      await page.goto('./series/on-the-air');
      await expect(
         page.getByRole('heading', { name: 'Breaking Bad' })
      ).toBeVisible();
   });

   test('navigates from the Series group in the navbar', async ({ page }) => {
      await page.route('**/movie/popular*', async (route) => {
         await route.fulfill({ json: MOCK_FILM_LIST });
      });
      await page.route('**/tv/popular*', async (route) => {
         await route.fulfill({ json: MOCK_SERIES_LIST });
      });

      await page.goto('./');
      await page
         .getByRole('group', { name: 'Series' })
         .getByRole('link', { name: 'Popular' })
         .click();

      await expect(page).toHaveURL(/\/series\/popular$/);
      await expect(
         page.getByRole('heading', { name: 'Game of Thrones' })
      ).toBeVisible();
   });

   test('series cards link to the TV detail route, not the film route', async ({
      page,
   }) => {
      await page.route('**/tv/popular*', async (route) => {
         await route.fulfill({ json: MOCK_SERIES_LIST });
      });
      await mockSeriesDetail(page);

      await page.goto('./series/popular');
      await page.getByRole('heading', { name: 'Game of Thrones' }).click();

      await expect(page).toHaveURL(/\/tv\/1399$/);
      await expect(page.getByTestId('series-info-title')).toHaveText(
         'Game of Thrones'
      );
   });

   test('renders TV specific details on /tv/:seriesId', async ({ page }) => {
      await mockSeriesDetail(page);

      await page.goto('./tv/1399');

      await expect(page.getByTestId('series-info-title')).toHaveText(
         'Game of Thrones'
      );
      await expect(page.getByText('Winter is coming.')).toBeVisible();
      // Labels are <strong> tags; the value lives in the parent row.
      await expect(page.getByText(/Seasons:/).locator('..')).toContainText(
         'Seasons: 8'
      );
      await expect(page.getByText(/Network:/).locator('..')).toContainText(
         'HBO'
      );
      await expect(page.getByText(/Created by:/).locator('..')).toContainText(
         'David Benioff'
      );
      await expect(
         page.getByRole('heading', { name: 'Seasons' })
      ).toBeVisible();
      await expect(page.getByText('Season 1')).toBeVisible();
      await expect(page.getByRole('link', { name: 'IMDB' })).toHaveAttribute(
         'href',
         'https://www.imdb.com/title/tt0944947'
      );
      await expect(
         page.getByRole('heading', { name: 'Breaking Bad' })
      ).toBeVisible();
   });
});
