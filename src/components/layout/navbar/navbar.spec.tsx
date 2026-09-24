import { QueryClient } from '@tanstack/react-query';
import {
   createRootRoute,
   createRouter,
   RouterProvider,
} from '@tanstack/react-router';
import { act, cleanup, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithQueryContext } from '@/tests/test-utils';

import Navbar, { NAVBAR_HEIGHT_VAR } from './navbar.component';

const rootRoute = createRootRoute();
const queryClient = new QueryClient();

const router = createRouter({
   routeTree: rootRoute,
   context: {
      queryClient,
   },
});

const renderNavbar = async () => {
   await act(async () => {
      renderWithQueryContext(
         <RouterProvider router={router} defaultComponent={Navbar} />
      );
   });
};

const openMenu = async (label: string) => {
   const user = userEvent.setup();
   await user.click(screen.getByRole('button', { name: `${label} menu` }));
   return user;
};

describe('Navbar Component', () => {
   it('lists Discover, Films and Series in that order, with Discover at the home route', async () => {
      await renderNavbar();

      const browse = within(screen.getByRole('navigation', { name: 'Browse' }));
      const discover = browse.getByRole('link', { name: 'Discover' });
      const films = browse.getByRole('button', { name: 'Films menu' });
      const series = browse.getByRole('button', { name: 'Series menu' });

      expect(discover).toHaveAttribute('href', '/');
      expect(
         discover.compareDocumentPosition(films) &
            Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
      expect(
         films.compareDocumentPosition(series) &
            Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
   });

   it('opens the Series menu with links to the series list routes', async () => {
      await renderNavbar();
      await openMenu('Series');

      const items = within(screen.getByRole('menu'));
      expect(
         items.getByRole('menuitem', { name: 'Popular' })
      ).toBeInTheDocument();
      expect(
         items.getByRole('menuitem', { name: 'Top Rated' })
      ).toBeInTheDocument();
      expect(
         items.getByRole('menuitem', { name: 'On The Air' })
      ).toBeInTheDocument();
   });

   it('opens the Films menu with links to the film list routes', async () => {
      await renderNavbar();
      await openMenu('Films');

      const items = within(screen.getByRole('menu'));
      expect(
         items.getByRole('menuitem', { name: 'Popular' })
      ).toBeInTheDocument();
      expect(
         items.getByRole('menuitem', { name: 'Top Rated' })
      ).toBeInTheDocument();
      expect(
         items.getByRole('menuitem', { name: 'Upcoming' })
      ).toBeInTheDocument();
   });

   it('publishes its rendered height for the sticky page title', async () => {
      // jsdom has no ResizeObserver. Stand one in that records what each
      // instance observes; react-aria's combobox creates one too, so the test
      // picks the observer watching the navbar rather than assuming it is alone.
      type FakeObserver = {
         callback: ResizeObserverCallback;
         targets: Element[];
      };
      const observers: FakeObserver[] = [];
      vi.stubGlobal(
         'ResizeObserver',
         class {
            targets: Element[] = [];
            constructor(public callback: ResizeObserverCallback) {
               observers.push(this);
            }
            observe = (target: Element) => {
               this.targets.push(target);
            };
            unobserve = vi.fn();
            disconnect = vi.fn();
         }
      );

      await renderNavbar();
      const bar = document.querySelector('.navbar');
      const observer = observers.find((o) => bar && o.targets.includes(bar));
      expect(observer).toBeDefined();

      act(() => {
         observer?.callback(
            [
               {
                  borderBoxSize: [{ blockSize: 114, inlineSize: 1280 }],
               } as unknown as ResizeObserverEntry,
            ],
            observer as unknown as ResizeObserver
         );
      });
      expect(
         document.documentElement.style.getPropertyValue(NAVBAR_HEIGHT_VAR)
      ).toBe('114px');

      cleanup();
      expect(
         document.documentElement.style.getPropertyValue(NAVBAR_HEIGHT_VAR)
      ).toBe('');
      vi.unstubAllGlobals();
   });

   it('navigates to the selected route when a Films menu item is chosen', async () => {
      await renderNavbar();
      const user = await openMenu('Films');

      await user.click(screen.getByRole('menuitem', { name: 'Upcoming' }));

      expect(router.state.location.pathname).toBe('/upcoming');
   });
});
