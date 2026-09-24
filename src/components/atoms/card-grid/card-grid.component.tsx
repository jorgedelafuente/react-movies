import './card-grid.styles.css';

import type { ReactNode } from 'react';

type CardGridProps = {
   children: ReactNode;
   /** Spacing utilities for the grid itself, e.g. `mt-6`. */
   className?: string;
};

/**
 * The card grid shared by the list pages, the recommendation panels and the
 * person credits. It fits as many columns as the `--card-min` floor allows
 * and stretches them to fill the row; the stylesheet explains the trade-offs.
 */
const CardGrid = ({ children, className = '' }: CardGridProps) => (
   <div className={`card-grid ${className}`.trim()}>{children}</div>
);

export default CardGrid;
