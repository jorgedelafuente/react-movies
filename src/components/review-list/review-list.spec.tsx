import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

vi.mock('@/services/reviews/reviews', () => ({
   fetchMediaReviews: vi.fn(),
}));

import { baseImagePathAvatar } from '@/services/config';
import { fetchMediaReviews } from '@/services/reviews/reviews';
import { MOCK_REVIEWS } from '@/tests/__mocks__/mocks';
import { renderWithQueryContext } from '@/tests/test-utils';
import { MEDIA_TYPES } from '@/types/media.types';
import {
   ReviewListSchema,
   sortReviewsNewestFirst,
} from '@/types/reviews.schemas';

import ReviewList from './review-list.component';

/** What the real fetcher resolves with: parsed and newest first. */
const parsed = ReviewListSchema.parse(MOCK_REVIEWS);
const FETCHED = { ...parsed, results: sortReviewsNewestFirst(parsed.results) };

const mockedFetch = vi.mocked(fetchMediaReviews);

const renderReviews = () =>
   renderWithQueryContext(
      <ReviewList mediaType={MEDIA_TYPES.MOVIE} id={533535} />
   );

const findArticles = () => screen.findAllByRole('article');

describe('ReviewList', () => {
   beforeEach(() => {
      mockedFetch.mockReset();
   });

   it('asks the service for the given media type and id', async () => {
      mockedFetch.mockResolvedValue(FETCHED);
      renderReviews();

      await screen.findByRole('heading', { name: /Reviews/ });
      expect(mockedFetch).toHaveBeenCalledWith(MEDIA_TYPES.MOVIE, 533535);
   });

   it('renders a count and one article per review, newest first', async () => {
      mockedFetch.mockResolvedValue(FETCHED);
      renderReviews();

      const articles = await findArticles();
      expect(articles).toHaveLength(3);
      expect(
         screen.getByRole('heading', { name: 'Reviews (3)' })
      ).toBeVisible();

      expect(articles[0]).toHaveAccessibleName('New Comer');
      expect(articles[1]).toHaveAccessibleName('Cinema Serf');
      expect(articles[2]).toHaveAccessibleName('oldtimer');
   });

   it('resolves every avatar format and falls back to an initial', async () => {
      mockedFetch.mockResolvedValue(FETCHED);
      renderReviews();

      const [newest, long, oldest] = await findArticles();

      expect(within(newest).queryByRole('img')).toBeNull();
      expect(newest).toHaveTextContent(/^N/);

      expect(within(long).getByRole('presentation')).toHaveAttribute(
         'src',
         `${baseImagePathAvatar}yz2HPme8NPLne0mM8tBnZ5ZWJzf.jpg`
      );
      expect(within(oldest).getByRole('presentation')).toHaveAttribute(
         'src',
         'https://secure.gravatar.com/avatar/0123456789abcdef0123456789abcdef.jpg'
      );
   });

   it('swaps a broken avatar for a decorative silhouette', async () => {
      mockedFetch.mockResolvedValue(FETCHED);
      renderReviews();

      const [, , oldest] = await findArticles();
      fireEvent.error(within(oldest).getByRole('presentation'));

      expect(within(oldest).queryByRole('presentation')).toBeNull();
      const skeleton = within(oldest).getByTestId('media-image-skeleton');
      expect(skeleton).toHaveAttribute('aria-hidden', 'true');
      expect(skeleton).toHaveClass('rounded-full');
   });

   it('shows a rating badge only when the reviewer gave one', async () => {
      mockedFetch.mockResolvedValue(FETCHED);
      renderReviews();

      const [newest, long] = await findArticles();

      // The badge reads "★ Rated 9.5/10" to assistive tech; the star is hidden.
      const badge = within(newest).getByText(/\/10$/);
      expect(badge).toHaveTextContent('Rated 9.5/10');
      expect(within(badge).getByText('★', { exact: false })).toHaveAttribute(
         'aria-hidden',
         'true'
      );
      expect(within(long).queryByText(/\/10$/)).toBeNull();
   });

   it('clamps long reviews behind a Read more toggle and leaves short ones alone', async () => {
      const user = userEvent.setup();
      mockedFetch.mockResolvedValue(FETCHED);
      renderReviews();

      const [newest, long] = await findArticles();

      expect(within(newest).queryByRole('button')).toBeNull();

      const toggle = within(long).getByRole('button', { name: 'Read more' });
      const body = document.getElementById(
         toggle.getAttribute('aria-controls') ?? ''
      );
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(body).toHaveClass('line-clamp-4');

      await user.click(toggle);

      expect(toggle).toHaveAttribute('aria-expanded', 'true');
      expect(toggle).toHaveTextContent('Show less');
      expect(body).not.toHaveClass('line-clamp-4');
   });

   it('links each review to its TMDB page in a new tab', async () => {
      mockedFetch.mockResolvedValue(FETCHED);
      renderReviews();

      const [newest] = await findArticles();
      const link = within(newest).getByRole('link', {
         name: /Read on TMDB \(review by New Comer\)/,
      });

      expect(link).toHaveAttribute(
         'href',
         'https://www.themoviedb.org/review/review-newest'
      );
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noreferrer');
   });

   it('shows five reviews first and reveals the rest on demand', async () => {
      const user = userEvent.setup();
      const many = Array.from({ length: 7 }, (_, i) => ({
         ...FETCHED.results[0],
         id: `review-${i}`,
         created_at: `2024-08-0${i + 1}T00:00:00.000Z`,
      }));
      mockedFetch.mockResolvedValue({
         ...FETCHED,
         results: many,
         total_results: 7,
      });
      renderReviews();

      expect(await findArticles()).toHaveLength(5);
      const more = screen.getByRole('button', { name: 'Show 2 more reviews' });

      await user.click(more);

      expect(screen.getAllByRole('article')).toHaveLength(7);
      expect(screen.queryByRole('button', { name: /Show .* more/ })).toBeNull();
   });

   it('renders nothing when the title has no reviews', async () => {
      mockedFetch.mockResolvedValue({
         ...FETCHED,
         results: [],
         total_results: 0,
      });
      const { container } = renderReviews();

      await waitFor(() => expect(mockedFetch).toHaveBeenCalled());
      expect(container).toBeEmptyDOMElement();
   });

   it('renders nothing when the request fails', async () => {
      mockedFetch.mockRejectedValue(new Error('TMDB down'));
      const { container } = renderReviews();

      await waitFor(() => expect(mockedFetch).toHaveBeenCalled());
      expect(container).toBeEmptyDOMElement();
   });

   it('has no accessibility violations once loaded', async () => {
      mockedFetch.mockResolvedValue(FETCHED);
      const { container } = renderReviews();

      await findArticles();
      // jsdom has no layout or canvas, so contrast cannot be measured here.
      const results = await axe(container, {
         rules: { 'color-contrast': { enabled: false } },
      });
      expect(results).toHaveNoViolations();
   });
});
