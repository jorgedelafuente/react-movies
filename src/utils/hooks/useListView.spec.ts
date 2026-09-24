import { beforeEach, describe, expect, it } from 'vitest';

import { LIST_VIEWS } from '@/types/list-view.types';

import { useListView } from './useListView';

beforeEach(() => {
   useListView.setState({ view: LIST_VIEWS.CARDS });
});

describe('useListView', () => {
   it('defaults to the cards view', () => {
      expect(useListView.getState().view).toBe(LIST_VIEWS.CARDS);
   });

   it('switches to the table view', () => {
      useListView.getState().setView(LIST_VIEWS.TABLE);
      expect(useListView.getState().view).toBe(LIST_VIEWS.TABLE);
   });

   it('switches back to the cards view', () => {
      useListView.getState().setView(LIST_VIEWS.TABLE);
      useListView.getState().setView(LIST_VIEWS.CARDS);
      expect(useListView.getState().view).toBe(LIST_VIEWS.CARDS);
   });
});
