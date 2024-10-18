import { screen, act } from '@testing-library/react';
import {
   RouterProvider,
   createRouter,
   createRootRoute,
} from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';

import { renderWithQueryContext } from '@/tests/test-utils';
import NavLink from './navlink.component';

const rootRoute = createRootRoute();
const queryClient = new QueryClient();

export const router = createRouter({
   routeTree: rootRoute,
   context: {
      queryClient,
   },
});

describe('Navlink Component', async () => {
   it('should render a Navlink Component', async () => {
      const element = () => <NavLink path="/" text="custom" key={1} />;
      await act(async () => {
         renderWithQueryContext(
            <RouterProvider router={router as any} defaultComponent={element} />
         );
      });
      expect(screen.getByText(/custom/i)).toBeInTheDocument();
   });
});