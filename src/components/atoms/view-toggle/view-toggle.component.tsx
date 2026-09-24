import './view-toggle.styles.css';

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
            {LIST_VIEW_LABELS[view]}
         </ToggleButton>
      ))}
   </ToggleButtonGroup>
);

export default ViewToggle;
