import './sortable-header.styles.css';

import { Button } from 'react-aria-components';

type SortDirection = 'asc' | 'desc' | false;

const ARIA_SORT = {
   asc: 'ascending',
   desc: 'descending',
   none: 'none',
} as const;

const SORT_ICON = {
   asc: '▲',
   desc: '▼',
   none: '⇅',
} as const;

type SortableHeaderProps = {
   children: React.ReactNode;
   sorted: SortDirection;
   onSort: () => void;
   className?: string;
   buttonClassName?: string;
};

/**
 * A `<th>` whose sort control is a real button, so sorting is reachable by
 * keyboard and the current direction is exposed to assistive tech via
 * `aria-sort` (a plain `onClick` on the `<th>` gives neither).
 */
const SortableHeader = ({
   children,
   sorted,
   onSort,
   className,
   buttonClassName,
}: SortableHeaderProps) => {
   const state = sorted || 'none';

   return (
      <th aria-sort={ARIA_SORT[state]} className={className}>
         <Button
            className={`sortable-header__button ${buttonClassName ?? ''}`.trim()}
            onPress={onSort}
         >
            {children}
            <span aria-hidden="true" className="sortable-header__icon">
               {' '}
               {SORT_ICON[state]}
            </span>
         </Button>
      </th>
   );
};

export default SortableHeader;
