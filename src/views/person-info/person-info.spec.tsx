import { QueryClient } from '@tanstack/react-query';
import {
   createRootRoute,
   createRouter,
   RouterProvider,
} from '@tanstack/react-router';
import { act, fireEvent, screen } from '@testing-library/react';

import { MOCK_PERSON_INFO } from '@/tests/__mocks__/mocks';
import { renderWithQueryContext } from '@/tests/test-utils';
import { MEDIA_TYPES } from '@/types/media.types';
import { PersonInfoSchema } from '@/types/people.schemas';
import type { PersonInfoType } from '@/types/people.types';
import { dedupeCredits } from '@/utils/dedupeCredits';

import PersonInfo from './person-info.view';

const person = PersonInfoSchema.parse(MOCK_PERSON_INFO);

const renderView = async (override: PersonInfoType = person) => {
   const router = createRouter({
      routeTree: createRootRoute(),
      context: { queryClient: new QueryClient() },
   });
   const element = () => <PersonInfo person={override} />;
   await act(async () => {
      renderWithQueryContext(
         <RouterProvider router={router} defaultComponent={element} />
      );
   });
};

describe('dedupeCredits', () => {
   it('collapses repeated titles and joins their roles', () => {
      const result = dedupeCredits(
         person.combined_credits!.cast,
         (c) => c.character
      );
      const got = result.find((c) => c.id === 1399);
      expect(result.filter((c) => c.id === 1399)).toHaveLength(1);
      expect(got?.roles).toEqual(['Daenerys Targaryen', 'Self']);
   });

   it('orders newest first and puts undated titles last', () => {
      const result = dedupeCredits(
         person.combined_credits!.cast,
         (c) => c.character
      );
      expect(result.map((c) => c.title)).toEqual([
         'Solo: A Star Wars Story',
         'Game of Thrones',
         'Unreleased Drama',
      ]);
   });
});

describe('Person Info Component', () => {
   it('renders the name, department and birth details with age', async () => {
      await renderView();
      expect(screen.getByTestId('person-info-title')).toHaveTextContent(
         'Emilia Clarke'
      );
      expect(
         screen.getByRole('heading', { level: 1, name: 'Emilia Clarke' })
      ).toBeInTheDocument();
      expect(screen.getByText('Acting')).toBeInTheDocument();
      const born = screen.getByText('Born').parentElement;
      expect(born).toHaveTextContent('23 October 1986');
      expect(born).toHaveTextContent(/\(age \d+\)/);
      expect(screen.getByText('Birthplace').parentElement).toHaveTextContent(
         'London, England, UK'
      );
   });

   it('links to IMDb using the name id', async () => {
      await renderView();
      expect(screen.getByRole('link', { name: 'IMDb' })).toHaveAttribute(
         'href',
         'https://www.imdb.com/name/nm3592338'
      );
   });

   it('shows one card per title with the character, linking by media type', async () => {
      await renderView();
      const got = screen.getByRole('link', { name: /Game of Thrones/ });
      expect(got).toHaveAttribute('href', '/tv/1399');
      expect(got).toHaveTextContent('as Daenerys Targaryen / Self');

      expect(
         screen.getByRole('link', { name: /Solo: A Star Wars/ })
      ).toHaveAttribute('href', '/film/348350');
      expect(
         screen.getByRole('heading', { name: /Known for/ })
      ).toHaveTextContent('(3)');
   });

   it('lists crew credits with the job', async () => {
      await renderView();
      expect(screen.getByRole('heading', { name: /Crew/ })).toBeInTheDocument();
      expect(
         screen.getByRole('link', { name: /Behind the Throne/ })
      ).toHaveTextContent('Executive Producer');
   });

   it('collapses long credit lists behind a show-all toggle', async () => {
      const many = Array.from({ length: 30 }, (_, i) => ({
         id: 1000 + i,
         media_type: MEDIA_TYPES.MOVIE,
         title: `Film ${i}`,
         poster_path: null,
         release_date: `19${String(50 + i).padStart(2, '0')}-01-01`,
         character: 'Someone',
      }));
      await renderView({
         ...person,
         combined_credits: { cast: many, crew: [] },
      });

      expect(screen.getAllByRole('link', { name: /Film \d+/ })).toHaveLength(
         24
      );
      fireEvent.click(screen.getByRole('button', { name: 'Show all 30' }));
      expect(screen.getAllByRole('link', { name: /Film \d+/ })).toHaveLength(
         30
      );
   });

   it('shows a death date and final age when present', async () => {
      await renderView({ ...person, deathday: '2020-06-01' });
      const died = screen.getByText('Died').parentElement;
      expect(died).toHaveTextContent('01 June 2020');
      expect(died).toHaveTextContent('(aged 33)');
      expect(screen.getByText('Born').parentElement).not.toHaveTextContent(
         /age \d+/
      );
   });
});
