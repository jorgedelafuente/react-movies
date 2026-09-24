export const LIST_VIEWS = {
   CARDS: 'cards',
   TABLE: 'table',
} as const;

export type ListView = (typeof LIST_VIEWS)[keyof typeof LIST_VIEWS];

export const LIST_VIEW_LABELS: Record<ListView, string> = {
   [LIST_VIEWS.CARDS]: 'Cards',
   [LIST_VIEWS.TABLE]: 'Table',
};

export type ListViewState = {
   view: ListView;
   setView: (view: ListView) => void;
};
