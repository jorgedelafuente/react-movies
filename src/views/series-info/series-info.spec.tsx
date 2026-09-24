import { QueryClient } from '@tanstack/react-query';
import {
   createRootRoute,
   createRouter,
   RouterProvider,
} from '@tanstack/react-router';
import { act, screen, within } from '@testing-library/react';

// The embedded gallery and reviews fetch on mount; keep the view test off the network.
vi.mock('@/services/images/images', () => ({
   fetchMediaImages: vi
      .fn()
      .mockResolvedValue({ id: 0, backdrops: [], posters: [] }),
}));
vi.mock('@/services/reviews/reviews', () => ({
   fetchMediaReviews: vi.fn().mockResolvedValue({
      id: 0,
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
   }),
}));

import { MOCK_FILM_TRAILER } from '@/tests/mocks/films.mocks';
import {
   MOCK_SERIES_CREDITS,
   MOCK_SERIES_INFO,
   MOCK_SERIES_RECOMMENDATIONS,
} from '@/tests/mocks/series.mocks';
import { renderWithQueryContext } from '@/tests/test-utils';
import { FilmCreditsSchema } from '@/types/films.schemas';
import {
   SeriesInfoSchema,
   SeriesRecommendationsSchema,
} from '@/types/series.schemas';

import SeriesInfo from './series-info.view';

/**
 * Seasons, cast and recommendations all render router Links, so every test
 * mounts the view inside a minimal RouterProvider.
 */
const renderView = async (
   props: Partial<React.ComponentProps<typeof SeriesInfo>> = {}
) => {
   const router = createRouter({
      routeTree: createRootRoute(),
      context: { queryClient: new QueryClient() },
   });
   const element = () => (
      <SeriesInfo
         seriesInfo={SeriesInfoSchema.parse(MOCK_SERIES_INFO)}
         seriesTrailer={MOCK_FILM_TRAILER}
         seriesCredits={FilmCreditsSchema.parse(MOCK_SERIES_CREDITS)}
         {...props}
      />
   );
   await act(async () => {
      renderWithQueryContext(
         <RouterProvider router={router} defaultComponent={element} />
      );
   });
};

describe('Series Info Component', () => {
   it('renders the series name in the sticky title', async () => {
      await renderView();
      expect(screen.getByTestId('series-info-title')).toHaveTextContent(
         'Game of Thrones'
      );
      expect(
         screen.getByRole('heading', { level: 1, name: 'Game of Thrones' })
      ).toBeInTheDocument();
   });

   it('sums up the run in the meta line: years, seasons and episodes', async () => {
      await renderView();

      const heading = screen.getByRole('heading', {
         level: 2,
         name: 'Game of Thrones',
      });
      const header = heading.closest('header');
      expect(header).toHaveTextContent('2011–2019');
      expect(header).toHaveTextContent('8 seasons');
      expect(header).toHaveTextContent('73 episodes');
   });

   it('puts the score in the ring with its vote count', async () => {
      await renderView();

      const ring = screen.getByTestId('score-ring');
      expect(within(ring).getByText('8.5')).toBeInTheDocument();
      expect(within(ring).getByText('24,680 votes')).toBeInTheDocument();
   });

   it('shows TV specific facts as eyebrow stats: episode length and network', async () => {
      await renderView();

      expect(
         screen.getByText(/^episode length$/i).parentElement
      ).toHaveTextContent('1h');
      expect(screen.getByText(/^network$/i).parentElement).toHaveTextContent(
         'HBO'
      );
      expect(screen.getByText(/^type$/i).parentElement).toHaveTextContent(
         'Scripted'
      );
   });

   it('lists creators and the IMDb link from appended external ids', async () => {
      await renderView();

      expect(screen.getByText(/^created by$/i).parentElement).toHaveTextContent(
         'David Benioff, D. B. Weiss'
      );
      expect(screen.getByRole('link', { name: 'IMDb' })).toHaveAttribute(
         'href',
         'https://www.imdb.com/title/tt0944947'
      );
   });

   it('links each season row to its season page', async () => {
      await renderView();

      expect(screen.getByRole('link', { name: /Season 1/ })).toHaveAttribute(
         'href',
         '/tv/1399/season/1'
      );
      expect(screen.getByRole('link', { name: /Season 8/ })).toHaveAttribute(
         'href',
         '/tv/1399/season/8'
      );
      expect(screen.getByText(/10 episodes/)).toBeInTheDocument();
      expect(screen.getByText(/6 episodes/)).toBeInTheDocument();
   });

   it('links each cast member to their person page', async () => {
      await renderView();

      const emilia = screen.getByRole('link', { name: /Emilia Clarke/ });
      expect(emilia).toHaveAttribute('href', '/person/1223786');
      expect(emilia).toHaveTextContent('Daenerys Targaryen');
   });

   it('hides the seasons section when the payload has none', async () => {
      const { seasons, ...withoutSeasons } = MOCK_SERIES_INFO;
      void seasons;
      await renderView({
         seriesInfo: SeriesInfoSchema.parse(withoutSeasons),
      });

      expect(
         screen.queryByRole('heading', { name: 'Seasons' })
      ).not.toBeInTheDocument();
   });

   it('renders recommendations as cards linking to the TV route', async () => {
      await renderView({
         recommendations: SeriesRecommendationsSchema.parse(
            MOCK_SERIES_RECOMMENDATIONS
         ).results,
      });

      expect(
         screen.getByRole('heading', { name: 'Recommendations' })
      ).toBeInTheDocument();
      expect(
         screen.getByRole('heading', { name: 'Breaking Bad' })
      ).toBeInTheDocument();
      expect(
         screen.getByRole('link', { name: /Breaking Bad/ })
      ).toHaveAttribute('href', '/tv/1396');
   });
});
