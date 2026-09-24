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

import {
   MOCK_FILM_CREDITS,
   MOCK_FILM_INFO,
   MOCK_FILM_TRAILER,
   MOCK_RELEASE_DATES,
} from '@/tests/__mocks__/mocks';
import { renderWithQueryContext } from '@/tests/test-utils';
import { FilmCreditsSchema, FilmInfoSchema } from '@/types/films.schemas';

import FilmInfo from './film-info.view';

const FILM_WITH_RELEASE_DATES = FilmInfoSchema.parse({
   ...MOCK_FILM_INFO,
   release_dates: { results: MOCK_RELEASE_DATES.results },
});

/**
 * Cast members and recommendation cards render router Links, so every test
 * mounts the view inside a minimal RouterProvider.
 */
const renderView = async (
   props: Partial<React.ComponentProps<typeof FilmInfo>> = {}
) => {
   const router = createRouter({
      routeTree: createRootRoute(),
      context: { queryClient: new QueryClient() },
   });
   const element = () => (
      <FilmInfo
         filmInfo={FILM_WITH_RELEASE_DATES}
         filmTrailer={MOCK_FILM_TRAILER}
         filmCredits={FilmCreditsSchema.parse(MOCK_FILM_CREDITS)}
         {...props}
      />
   );
   await act(async () => {
      renderWithQueryContext(
         <RouterProvider router={router} defaultComponent={element} />
      );
   });
};

describe('Film Info Component', () => {
   it('renders the film title in the sticky heading', async () => {
      await renderView();
      expect(screen.getByTestId('film-info-title')).toHaveTextContent(
         'Deadpool & Wolverine'
      );
   });

   it('shows the age rating for the preferred region in the title meta strip', async () => {
      // jsdom reports navigator.language as en-US, so the US rating wins.
      await renderView();

      const badge = screen.getByTestId('certification-badge');
      expect(badge).toHaveTextContent('R');
      expect(badge).toHaveTextContent('US');
      expect(badge).toHaveAttribute('title', 'Age rating in US');
   });

   it('lists every release with its country, type and certification', async () => {
      await renderView();

      const details = screen.getByText('Release dates').closest('details');
      expect(details).not.toBeNull();
      expect(details).toHaveTextContent('(6)');

      const rows = within(details as HTMLElement).getAllByRole('listitem');
      expect(rows).toHaveLength(6);
      // Preferred region (US) comes first, then the rest alphabetically.
      expect(rows[0]).toHaveTextContent('United States');
      expect(rows[0]).toHaveTextContent('Premiere');
      expect(rows[1]).toHaveTextContent('Theatrical');
      expect(rows[1]).toHaveTextContent('R');
      expect(rows[3]).toHaveTextContent('France');
      expect(rows[4]).toHaveTextContent('Spain');
      expect(rows[4]).toHaveTextContent('16');
      expect(rows[5]).toHaveTextContent('United Kingdom');
      expect(rows[5]).toHaveTextContent('15');
   });

   it('omits the rating badge and release list when TMDB has no release data', async () => {
      await renderView({ filmInfo: FilmInfoSchema.parse(MOCK_FILM_INFO) });

      expect(
         screen.queryByTestId('certification-badge')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Release dates')).not.toBeInTheDocument();
   });

   it('links each cast member to their person page', async () => {
      await renderView();

      const ryan = screen.getByRole('link', { name: /Ryan Reynolds/ });
      expect(ryan).toHaveAttribute('href', '/person/10859');
      expect(ryan).toHaveTextContent('Wade Wilson / Deadpool');

      const hugh = screen.getByRole('link', { name: /Hugh Jackman/ });
      expect(hugh).toHaveAttribute('href', '/person/6968');
   });

   it('names the director and writers from the crew list', async () => {
      await renderView();

      expect(screen.getByText(/^director$/i).parentElement).toHaveTextContent(
         'Shawn Levy'
      );
      expect(screen.getByText(/^writers$/i).parentElement).toHaveTextContent(
         'Rhett Reese'
      );
   });
});
