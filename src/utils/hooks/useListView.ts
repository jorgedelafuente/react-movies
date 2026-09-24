import { create } from 'zustand';

import { LIST_VIEWS, type ListViewState } from '@/types/list-view.types';

/**
 * Cards-or-table layout for the film and series list pages. Kept in a store
 * rather than component state so the choice survives navigating between list
 * routes; like `useTheme` it resets on reload.
 */
export const useListView = create<ListViewState>((set) => ({
   view: LIST_VIEWS.CARDS,
   setView: (view) => set(() => ({ view })),
}));
