import { QueryClient } from '@tanstack/react-query';
import {
   createRootRoute,
   createRouter,
   RouterProvider,
} from '@tanstack/react-router';
import { act, screen } from '@testing-library/react';

import { renderWithQueryContext } from '@/tests/test-utils';
import { MEDIA_TYPES } from '@/types/media.types';

import MediaLink from './media-link.component';

const rootRoute = createRootRoute();
const queryClient = new QueryClient();

const router = createRouter({
   routeTree: rootRoute,
   context: {
      queryClient,
   },
});

const renderLink = async (element: () => React.JSX.Element) => {
   await act(async () => {
      renderWithQueryContext(
         <RouterProvider router={router} defaultComponent={element} />
      );
   });
};

// TMDB movie and TV ids overlap, so the same id must resolve to a different
// route depending on the media type.
const SHARED_ID = 1399;

describe('MediaLink Component', () => {
   it('links a series to the TV detail route', async () => {
      await renderLink(() => (
         <MediaLink id={SHARED_ID} mediaType={MEDIA_TYPES.TV}>
            Game of Thrones
         </MediaLink>
      ));

      expect(
         screen.getByRole('link', { name: 'Game of Thrones' })
      ).toHaveAttribute('href', '/tv/1399');
   });

   it('links a film with the same id to the film detail route', async () => {
      await renderLink(() => (
         <MediaLink id={SHARED_ID} mediaType={MEDIA_TYPES.MOVIE}>
            Some Film
         </MediaLink>
      ));

      expect(screen.getByRole('link', { name: 'Some Film' })).toHaveAttribute(
         'href',
         '/film/1399'
      );
   });
});
