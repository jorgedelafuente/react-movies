import { QueryClient } from '@tanstack/react-query';
import {
   createRootRoute,
   createRouter,
   RouterProvider,
} from '@tanstack/react-router';
import { act, screen } from '@testing-library/react';

import { MOCK_SERIES_CREDITS } from '@/tests/__mocks__/mocks';
import { renderWithQueryContext } from '@/tests/test-utils';
import { FilmCreditsSchema } from '@/types/films.schemas';

import CastList from './cast-list.component';

const cast = FilmCreditsSchema.parse(MOCK_SERIES_CREDITS).cast;

const renderList = async (members = cast) => {
   const router = createRouter({
      routeTree: createRootRoute(),
      context: { queryClient: new QueryClient() },
   });
   const element = () => <CastList cast={members} />;
   await act(async () => {
      renderWithQueryContext(
         <RouterProvider router={router} defaultComponent={element} />
      );
   });
};

describe('CastList', () => {
   it('links every member to their person page', async () => {
      await renderList();
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute('href', '/person/1223786');
      expect(links[1]).toHaveAttribute('href', '/person/22970');
   });

   it('shows the name and character inside the link', async () => {
      await renderList();
      const link = screen.getByRole('link', { name: /Peter Dinklage/ });
      expect(link).toHaveTextContent('Tyrion Lannister');
   });

   it('uses a placeholder when the member has no photo', async () => {
      await renderList();
      // Emilia has a profile image, Peter does not. Photos are decorative
      // (alt="") because the link text already carries the name.
      expect(document.querySelectorAll('img')).toHaveLength(1);
      expect(
         screen
            .getByRole('link', { name: /Peter Dinklage/ })
            .querySelector('img')
      ).toBeNull();
   });

   it('renders nothing for an empty cast', async () => {
      await renderList([]);
      expect(screen.queryAllByRole('link')).toHaveLength(0);
   });
});
