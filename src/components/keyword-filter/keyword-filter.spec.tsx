import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { configureAxe } from 'vitest-axe';

import { searchKeywords } from '@/services/search/search';
import { MOCK_KEYWORDS } from '@/tests/__mocks__/mocks';
import { renderWithQueryContext } from '@/tests/test-utils';
import { KeywordSearchSchema } from '@/types/search.schemas';

import KeywordFilter from './keyword-filter.component';

vi.mock('@/services/search/search', () => ({
   searchKeywords: vi.fn(),
}));

const keywords = KeywordSearchSchema.parse(MOCK_KEYWORDS).results;
const timeTravel = { id: 4379, name: 'time travel' };

const axe = configureAxe({
   rules: { 'color-contrast': { enabled: false } },
});

const renderFilter = (selected?: typeof timeTravel) => {
   const onSelect = vi.fn();
   const view = renderWithQueryContext(
      <KeywordFilter selected={selected} onSelect={onSelect} />
   );
   return { onSelect, ...view };
};

// Typing is debounced by 300 ms before it searches. Match by name and wait
// for the full count: the empty-state placeholder is also rendered with
// role="option".
const findOptions = (count: number, name = /time/) =>
   waitFor(
      () => {
         const options = screen.getAllByRole('option', { name });
         expect(options).toHaveLength(count);
         return options;
      },
      { timeout: 2000 }
   );

const settle = () => new Promise((resolve) => setTimeout(resolve, 400));

describe('KeywordFilter', () => {
   beforeEach(() => {
      vi.mocked(searchKeywords).mockResolvedValue(keywords);
   });
   afterEach(() => {
      vi.clearAllMocks();
   });

   it('starts empty with an accessible label', async () => {
      const { container } = renderFilter();
      expect(screen.getByRole('combobox', { name: 'Keyword' })).toHaveValue('');
      expect(
         screen.queryByRole('button', { name: 'Clear keyword' })
      ).toBeNull();
      expect(await axe(container)).toHaveNoViolations();
   });

   it('suggests keywords once two characters are typed and reports the pick', async () => {
      const { onSelect } = renderFilter();
      const user = userEvent.setup();

      await user.type(screen.getByRole('combobox'), 'time');
      const options = await findOptions(3);
      expect(searchKeywords).toHaveBeenCalledWith('time');
      expect(options.map((o) => o.textContent)).toEqual([
         'time trial',
         'time travel',
         'time-traveling gang',
      ]);

      await user.click(options[1]);
      expect(onSelect).toHaveBeenCalledWith(timeTravel);
      expect(screen.getByRole('combobox')).toHaveValue('time travel');
   });

   it('marks the current keyword as selected when it is among the matches', async () => {
      renderFilter(timeTravel);
      const user = userEvent.setup();
      await user.clear(screen.getByRole('combobox'));
      await user.type(screen.getByRole('combobox'), 'time');

      const options = await findOptions(3);
      expect(options[1]).toHaveTextContent('time travel');
      expect(options[1]).toHaveAttribute('aria-selected', 'true');
   });

   it('puts the current keyword back when the field is left without a pick', async () => {
      const { onSelect } = renderFilter(timeTravel);
      const user = userEvent.setup();
      await user.clear(screen.getByRole('combobox'));
      await user.type(screen.getByRole('combobox'), 'hei');
      await user.tab();

      expect(screen.getByRole('combobox')).toHaveValue('time travel');
      expect(onSelect).not.toHaveBeenCalled();
   });

   it('clears stray text when the field is left with nothing selected', async () => {
      const { onSelect } = renderFilter();
      const user = userEvent.setup();
      await user.type(screen.getByRole('combobox'), 'hei');
      await user.tab();

      expect(screen.getByRole('combobox')).toHaveValue('');
      expect(onSelect).not.toHaveBeenCalled();
   });

   it('does not search on a single character', async () => {
      renderFilter();
      await userEvent.type(screen.getByRole('combobox'), 't');
      await settle();
      expect(searchKeywords).not.toHaveBeenCalled();
   });

   it('shows the selected keyword without searching for it again', async () => {
      renderFilter(timeTravel);
      expect(screen.getByRole('combobox')).toHaveValue('time travel');
      await settle();
      expect(searchKeywords).not.toHaveBeenCalled();
   });

   it('clears the keyword with the clear button', async () => {
      const { onSelect } = renderFilter(timeTravel);
      await userEvent.click(
         screen.getByRole('button', { name: 'Clear keyword' })
      );
      expect(onSelect).toHaveBeenCalledWith(undefined);
      expect(screen.getByRole('combobox')).toHaveValue('');
   });

   it('strips unsafe characters from what is typed', async () => {
      renderFilter();
      await userEvent.type(screen.getByRole('combobox'), 'he`ist');
      expect(screen.getByRole('combobox')).toHaveValue('heist');
   });

   it('tells the visitor when no keyword matches', async () => {
      vi.mocked(searchKeywords).mockResolvedValue([]);
      renderFilter();
      await userEvent.type(screen.getByRole('combobox'), 'zzzz');
      expect(
         await screen.findByText(
            /no keywords match "zzzz"/i,
            {},
            { timeout: 2000 }
         )
      ).toBeInTheDocument();
   });
});
