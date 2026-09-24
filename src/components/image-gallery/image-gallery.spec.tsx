import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

vi.mock('@/services/images/images', () => ({
   fetchMediaImages: vi.fn(),
}));

import { fetchMediaImages } from '@/services/images/images';
import { MOCK_MEDIA_IMAGES } from '@/tests/__mocks__/mocks';
import { renderWithQueryContext } from '@/tests/test-utils';
import {
   MediaImagesSchema,
   pickGalleryBackdrops,
} from '@/types/images.schemas';
import { MEDIA_TYPES } from '@/types/media.types';

import ImageGallery from './image-gallery.component';

const TITLE = 'Deadpool & Wolverine';

/** What the real fetcher resolves with: parsed and already ordered. */
const parsed = MediaImagesSchema.parse(MOCK_MEDIA_IMAGES);
const FETCHED = {
   ...parsed,
   backdrops: pickGalleryBackdrops(parsed.backdrops),
};

const mockedFetch = vi.mocked(fetchMediaImages);

const renderGallery = () =>
   renderWithQueryContext(
      <ImageGallery mediaType={MEDIA_TYPES.MOVIE} id={533535} title={TITLE} />
   );

const openDialog = () => document.querySelector('dialog[open]');

describe('ImageGallery', () => {
   beforeEach(() => {
      mockedFetch.mockReset();
   });

   it('asks the service for the given media type and id', async () => {
      mockedFetch.mockResolvedValue(FETCHED);
      renderGallery();

      await screen.findByRole('heading', { name: 'Gallery' });
      expect(mockedFetch).toHaveBeenCalledWith(MEDIA_TYPES.MOVIE, 533535);
   });

   it('renders one tile per backdrop, best voted first', async () => {
      mockedFetch.mockResolvedValue(FETCHED);
      renderGallery();

      const tiles = await screen.findAllByRole('button', {
         name: /backdrop \d of 3/,
      });
      expect(tiles).toHaveLength(3);

      const firstImage = tiles[0].querySelector('img');
      expect(firstImage).toHaveAttribute(
         'src',
         expect.stringContaining('/w780//backdrop-top.jpg')
      );
      expect(firstImage).toHaveAttribute('loading', 'lazy');
   });

   it('keeps a tile in place with a skeleton when its backdrop fails to load', async () => {
      mockedFetch.mockResolvedValue(FETCHED);
      renderGallery();

      const tiles = await screen.findAllByRole('button', {
         name: /backdrop \d of 3/,
      });
      fireEvent.error(tiles[0].querySelector('img') as HTMLImageElement);

      expect(tiles[0].querySelector('img')).toBeNull();
      expect(within(tiles[0]).getByTestId('media-image-skeleton')).toHaveClass(
         'aspect-video'
      );
      // The tile is still announced by name, so it stays usable.
      expect(tiles[0]).toHaveAccessibleName(`${TITLE} backdrop 1 of 3`);
   });

   it('renders nothing when the title has no backdrops', async () => {
      mockedFetch.mockResolvedValue({ ...FETCHED, backdrops: [] });
      const { container } = renderGallery();

      await waitFor(() => expect(mockedFetch).toHaveBeenCalled());
      expect(container).toBeEmptyDOMElement();
   });

   it('renders nothing when the request fails', async () => {
      mockedFetch.mockRejectedValue(new Error('TMDB down'));
      const { container } = renderGallery();

      await waitFor(() => expect(mockedFetch).toHaveBeenCalled());
      expect(container).toBeEmptyDOMElement();
      expect(screen.queryByRole('heading', { name: 'Gallery' })).toBeNull();
   });

   it('opens the clicked backdrop in a lightbox with a position counter', async () => {
      const user = userEvent.setup();
      mockedFetch.mockResolvedValue(FETCHED);
      renderGallery();

      const tiles = await screen.findAllByRole('button', {
         name: /backdrop \d of 3/,
      });
      expect(openDialog()).toBeNull();

      await user.click(tiles[1]);

      const dialog = openDialog();
      expect(dialog).not.toBeNull();
      expect(dialog).toHaveTextContent('2 / 3');
      expect(
         dialog?.querySelector(`img[alt="${TITLE} backdrop 2 of 3"]`)
      ).toHaveAttribute(
         'src',
         expect.stringContaining('/w1280//backdrop-mid.jpg')
      );
   });

   it('steps through images with the buttons and arrow keys, wrapping around', async () => {
      const user = userEvent.setup();
      mockedFetch.mockResolvedValue(FETCHED);
      renderGallery();

      const tiles = await screen.findAllByRole('button', {
         name: /backdrop \d of 3/,
      });
      await user.click(tiles[2]);
      expect(openDialog()).toHaveTextContent('3 / 3');

      await user.click(screen.getByRole('button', { name: 'Next' }));
      expect(openDialog()).toHaveTextContent('1 / 3');

      await user.click(screen.getByRole('button', { name: 'Previous' }));
      expect(openDialog()).toHaveTextContent('3 / 3');

      await user.keyboard('{ArrowLeft}');
      expect(openDialog()).toHaveTextContent('2 / 3');

      await user.keyboard('{ArrowRight}');
      expect(openDialog()).toHaveTextContent('3 / 3');
   });

   it('closes the lightbox from its close button', async () => {
      const user = userEvent.setup();
      mockedFetch.mockResolvedValue(FETCHED);
      renderGallery();

      const tiles = await screen.findAllByRole('button', {
         name: /backdrop \d of 3/,
      });
      await user.click(tiles[0]);
      expect(openDialog()).not.toBeNull();

      await user.click(screen.getByRole('button', { name: 'Close modal' }));
      expect(openDialog()).toBeNull();
   });

   it('has no accessibility violations once loaded', async () => {
      mockedFetch.mockResolvedValue(FETCHED);
      const { container } = renderGallery();

      await screen.findByRole('heading', { name: 'Gallery' });
      // jsdom has no layout or canvas, so contrast cannot be measured here.
      const results = await axe(container, {
         rules: { 'color-contrast': { enabled: false } },
      });
      expect(results).toHaveNoViolations();
   });
});
