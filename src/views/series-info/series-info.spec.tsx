import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import {
   MOCK_FILM_TRAILER,
   MOCK_SERIES_CREDITS,
   MOCK_SERIES_INFO,
} from '@/tests/__mocks__/mocks';
import { FilmCreditsSchema } from '@/types/films.schemas';
import { SeriesInfoSchema } from '@/types/series.schemas';

import SeriesInfo from './series-info.view';

const renderView = (
   props: Partial<React.ComponentProps<typeof SeriesInfo>> = {}
) => {
   const queryClient = new QueryClient();
   const result = render(
      <QueryClientProvider client={queryClient}>
         <SeriesInfo
            seriesInfo={SeriesInfoSchema.parse(MOCK_SERIES_INFO)}
            seriesTrailer={MOCK_FILM_TRAILER}
            seriesCredits={FilmCreditsSchema.parse(MOCK_SERIES_CREDITS)}
            {...props}
         />
      </QueryClientProvider>
   );
   return { ...result, queryClient };
};

describe('Series Info Component', () => {
   it('renders the series name in the sticky title', () => {
      const { queryClient } = renderView();
      expect(screen.getByTestId('series-info-title')).toHaveTextContent(
         'Game of Thrones'
      );
      queryClient.clear();
   });

   it('shows TV specific facts: seasons, episodes, episode length, network', () => {
      const { queryClient } = renderView();

      expect(screen.getByText(/seasons:/i).parentElement).toHaveTextContent(
         'Seasons: 8'
      );
      expect(screen.getByText(/episodes:/i).parentElement).toHaveTextContent(
         'Episodes: 73'
      );
      expect(
         screen.getByText(/episode length:/i).parentElement
      ).toHaveTextContent('60 minutes');
      expect(screen.getByText(/network:/i).parentElement).toHaveTextContent(
         'HBO'
      );
      queryClient.clear();
   });

   it('lists creators and the IMDB link from appended external ids', () => {
      const { queryClient } = renderView();

      expect(screen.getByText(/created by:/i).parentElement).toHaveTextContent(
         'David Benioff, D. B. Weiss'
      );
      expect(screen.getByRole('link', { name: 'IMDB' })).toHaveAttribute(
         'href',
         'https://www.imdb.com/title/tt0944947'
      );
      queryClient.clear();
   });

   it('renders one row per season with its episode count', () => {
      const { queryClient } = renderView();

      expect(screen.getByText('Season 1')).toBeInTheDocument();
      expect(screen.getByText('Season 8')).toBeInTheDocument();
      expect(screen.getByText(/10 episodes/)).toBeInTheDocument();
      expect(screen.getByText(/6 episodes/)).toBeInTheDocument();
      queryClient.clear();
   });

   it('renders the top cast with their characters', () => {
      const { queryClient } = renderView();

      expect(screen.getByText('Emilia Clarke')).toBeInTheDocument();
      expect(screen.getByText('Daenerys Targaryen')).toBeInTheDocument();
      queryClient.clear();
   });

   it('hides the seasons section when the payload has none', () => {
      const { seasons, ...withoutSeasons } = MOCK_SERIES_INFO;
      void seasons;
      const { queryClient } = renderView({
         seriesInfo: SeriesInfoSchema.parse(withoutSeasons),
      });

      expect(
         screen.queryByRole('heading', { name: 'Seasons' })
      ).not.toBeInTheDocument();
      queryClient.clear();
   });
});
