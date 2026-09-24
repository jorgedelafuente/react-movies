import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { configureAxe } from 'vitest-axe';

import { searchMedia } from '@/services/search/search';
import { MOCK_MULTI_SEARCH } from '@/tests/__mocks__/mocks';
import { renderWithQueryContext } from '@/tests/test-utils';
import { MultiSearchSchema } from '@/types/search.schemas';

import SearchInput from './search-input.component';

const navigate = vi.fn();
vi.mock('@tanstack/react-router', async (importOriginal) => ({
   ...(await importOriginal<typeof import('@tanstack/react-router')>()),
   useNavigate: () => navigate,
}));

vi.mock('@/services/search/search', () => ({
   searchMedia: vi.fn(),
}));

const results = MultiSearchSchema.parse(MOCK_MULTI_SEARCH).results;

const axe = configureAxe({
   rules: {
      // jsdom does not fully implement pseudo-element styles used by this rule.
      'color-contrast': { enabled: false },
   },
});

// The input is debounced by 400 ms before it searches. Match by name: the
// empty-state placeholder is also rendered with role="option".
const findOptions = () =>
   screen.findAllByRole('option', { name: /severance/i }, { timeout: 2000 });

describe('Search Input', () => {
   beforeEach(() => {
      vi.mocked(searchMedia).mockResolvedValue(results);
      renderWithQueryContext(<SearchInput />);
   });
   afterEach(() => {
      cleanup();
      vi.clearAllMocks();
   });

   it('search input should start with empty default state', () => {
      const { textContent } = screen.getByRole('combobox');
      expect(textContent).toBe('');
   });

   it('search input value changes correctly', () => {
      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: 'user input' } });
      expect(input).toHaveValue('user input');
   });

   it('has no accessibility violations on initial render', async () => {
      const { container } = renderWithQueryContext(<SearchInput />);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
   });

   it('search input does not accept backticks', async () => {
      const input = screen.getByRole('combobox');
      await userEvent.type(input, '`te`st`');
      await waitFor(() => {
         expect(input).toHaveValue('test');
      });
   });

   it('lists films and series together, each tagged with its type and year', async () => {
      await userEvent.type(screen.getByRole('combobox'), 'sev');
      const options = await findOptions();

      expect(searchMedia).toHaveBeenCalledWith('sev');
      expect(options).toHaveLength(2);
      expect(options[0]).toHaveTextContent('Severance');
      expect(options[0]).toHaveTextContent('Series');
      expect(options[0]).toHaveTextContent('2022');
      expect(options[1]).toHaveTextContent('Film');
      expect(options[1]).toHaveTextContent('2006');
   });

   it('opens a series result on the TV detail route', async () => {
      await userEvent.type(screen.getByRole('combobox'), 'sev');
      const [series] = await findOptions();
      await userEvent.click(series);

      expect(navigate).toHaveBeenCalledWith({
         to: '/tv/$seriesId',
         params: { seriesId: '95396' },
      });
      expect(screen.getByRole('combobox')).toHaveValue('');
   });

   it('opens a film result on the film detail route', async () => {
      await userEvent.type(screen.getByRole('combobox'), 'sev');
      const [, film] = await findOptions();
      await userEvent.click(film);

      expect(navigate).toHaveBeenCalledWith({
         to: '/film/$filmId',
         params: { filmId: '5072' },
      });
   });

   it('flags the root as open while results show, which drives the page scrim', async () => {
      const root = screen.getByRole('combobox').closest('.search-combobox');
      expect(root).not.toHaveAttribute('data-open');

      await userEvent.type(screen.getByRole('combobox'), 'sev');
      await findOptions();
      expect(root).toHaveAttribute('data-open', 'true');

      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(root).not.toHaveAttribute('data-open'));
   });

   it('tells the visitor when nothing matches', async () => {
      vi.mocked(searchMedia).mockResolvedValue([]);
      await userEvent.type(screen.getByRole('combobox'), 'zzz');

      expect(
         await screen.findByText(
            /no films or series found for "zzz"/i,
            {},
            { timeout: 2000 }
         )
      ).toBeInTheDocument();
   });

   it('does not search when only spaces have been typed', async () => {
      await userEvent.type(screen.getByRole('combobox'), '   ');
      // Outlast the 400 ms debounce to prove nothing fires afterwards either.
      await new Promise((resolve) => setTimeout(resolve, 600));

      expect(searchMedia).not.toHaveBeenCalled();
   });

   it('sends the trimmed query', async () => {
      await userEvent.type(screen.getByRole('combobox'), ' sev ');
      await findOptions();

      expect(searchMedia).toHaveBeenCalledWith('sev');
   });

   it('empties the list as soon as the search is cleared', async () => {
      await userEvent.type(screen.getByRole('combobox'), 'sev');
      await findOptions();
      // While the popover is open react-aria hides the rest of the page from
      // the accessibility tree, so the button is found by label, not role.
      await userEvent.click(screen.getByLabelText(/clear search/i));

      expect(screen.getByRole('combobox')).toHaveValue('');
      expect(
         screen.queryAllByRole('option', { name: /severance/i })
      ).toHaveLength(0);
   });

   it('shows a small poster, the rating and the overview on each row', async () => {
      await userEvent.type(screen.getByRole('combobox'), 'sev');
      const [series] = await findOptions();

      const poster = series.querySelector('img');
      expect(poster).toHaveAttribute(
         'src',
         'https://image.tmdb.org/t/p/w92//pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg'
      );
      expect(series).toHaveTextContent('8.4');
      expect(series).toHaveTextContent(/Mark leads a team of office workers/);
   });
});
