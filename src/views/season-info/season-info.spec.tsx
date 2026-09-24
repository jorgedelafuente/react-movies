import { QueryClient } from '@tanstack/react-query';
import {
   createRootRoute,
   createRouter,
   RouterProvider,
} from '@tanstack/react-router';
import { act, screen } from '@testing-library/react';

import { MOCK_SEASON_DETAIL, MOCK_SERIES_INFO } from '@/tests/__mocks__/mocks';
import { renderWithQueryContext } from '@/tests/test-utils';
import { SeasonDetailSchema, SeriesInfoSchema } from '@/types/series.schemas';

import SeasonInfo from './season-info.view';

const seriesInfo = SeriesInfoSchema.parse(MOCK_SERIES_INFO);
const season = SeasonDetailSchema.parse(MOCK_SEASON_DETAIL);

const renderView = async (
   props: Partial<React.ComponentProps<typeof SeasonInfo>> = {}
) => {
   const router = createRouter({
      routeTree: createRootRoute(),
      context: { queryClient: new QueryClient() },
   });
   const element = () => (
      <SeasonInfo seriesInfo={seriesInfo} season={season} {...props} />
   );
   await act(async () => {
      renderWithQueryContext(
         <RouterProvider router={router} defaultComponent={element} />
      );
   });
};

describe('Season Info Component', () => {
   it('titles the page with the series and season name', async () => {
      await renderView();
      expect(screen.getByTestId('season-info-title')).toHaveTextContent(
         'Game of Thrones · Season 1'
      );
      expect(
         screen.getByRole('heading', { level: 1, name: 'Season 1' })
      ).toBeInTheDocument();
   });

   it('links back to the series page', async () => {
      await renderView();
      expect(
         screen.getByRole('link', { name: /Game of Thrones/ })
      ).toHaveAttribute('href', '/tv/1399');
   });

   it('offers every other season and marks the current one', async () => {
      await renderView();
      const nav = screen.getByRole('navigation', { name: 'Seasons' });
      const links = nav.querySelectorAll('a');
      expect(links).toHaveLength(3);
      expect(screen.getByRole('link', { name: 'Season 8' })).toHaveAttribute(
         'href',
         '/tv/1399/season/8'
      );
      expect(screen.getByRole('link', { name: 'Season 1' })).toHaveAttribute(
         'aria-current',
         'page'
      );
   });

   it('lists one row per episode with number, name, date, runtime and rating', async () => {
      await renderView();
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(3);

      expect(items[0]).toHaveTextContent('1.');
      expect(items[0]).toHaveTextContent('Winter Is Coming');
      expect(items[0]).toHaveTextContent('17 Apr 2011');
      expect(items[0]).toHaveTextContent('62 min');
      expect(items[0]).toHaveTextContent('★ 8.1');
   });

   it('shows TBA and hides runtime and rating for an unaired episode', async () => {
      await renderView();
      const unaired = screen.getAllByRole('listitem')[2];
      expect(unaired).toHaveTextContent('Lord Snow');
      expect(unaired).toHaveTextContent('TBA');
      expect(unaired).not.toHaveTextContent('min');
      expect(
         unaired.querySelector('[data-testid="episode-rating"]')
      ).toBeNull();
   });

   it('says so when a season has no episodes yet', async () => {
      await renderView({ season: { ...season, episodes: [] } });
      expect(screen.getByText(/no episodes listed yet/i)).toBeInTheDocument();
   });
});
