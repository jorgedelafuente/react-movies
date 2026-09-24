import './view-toggle.styles.css';

import type { ReactNode } from 'react';
import {
   type Key,
   ToggleButton,
   ToggleButtonGroup,
} from 'react-aria-components';

import {
   LIST_VIEW_LABELS,
   LIST_VIEWS,
   type ListView,
} from '@/types/list-view.types';

type ViewToggleProps = {
   value: ListView;
   onChange: (view: ListView) => void;
};

const VIEWS = Object.values(LIST_VIEWS);

const isListView = (key: Key): key is ListView =>
   VIEWS.includes(key as ListView);

/** Decorative glyphs; the button text carries the accessible name. */
const VIEW_ICONS: Record<ListView, ReactNode> = {
   [LIST_VIEWS.CARDS]: (
      <svg viewBox="0 0 16 16" aria-hidden="true" className="view-toggle__icon">
         <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.25" />
         <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.25" />
         <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.25" />
         <rect x="9" y="9" width="5.5" height="5.5" rx="1.25" />
      </svg>
   ),
   [LIST_VIEWS.TABLE]: (
      <svg viewBox="0 0 16 16" aria-hidden="true" className="view-toggle__icon">
         <rect x="1.5" y="2.25" width="13" height="2.5" rx="1.25" />
         <rect x="1.5" y="6.75" width="13" height="2.5" rx="1.25" />
         <rect x="1.5" y="11.25" width="13" height="2.5" rx="1.25" />
      </svg>
   ),
};

/**
 * Cards / table switch for the list pages. A single-selection
 * `ToggleButtonGroup` renders as a radiogroup, so the current layout is
 * announced to assistive tech and the options are reachable with arrow keys.
 */
const ViewToggle = ({ value, onChange }: ViewToggleProps) => (
   <ToggleButtonGroup
      aria-label="List layout"
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[value]}
      onSelectionChange={(keys) => {
         const [key] = keys;
         if (key !== undefined && isListView(key)) onChange(key);
      }}
      className="view-toggle"
   >
      {VIEWS.map((view) => (
         <ToggleButton key={view} id={view} className="view-toggle__button">
            {VIEW_ICONS[view]}
            {LIST_VIEW_LABELS[view]}
         </ToggleButton>
      ))}
   </ToggleButtonGroup>
);

export default ViewToggle;
