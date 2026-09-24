import './card-grid.styles.css';

import type { ReactNode } from 'react';

type CardGridProps = {
   children: ReactNode;
   /** Spacing utilities for the grid itself, e.g. `mt-6`. */
   className?: string;
};

/**
 * The fixed 2 / 3 / 4-column card grid shared by the list pages, the
 * recommendation panels and the person credits. A short last row is centred;
 * the stylesheet explains why that needs flexbox rather than CSS grid.
 */
const CardGrid = ({ children, className = '' }: CardGridProps) => (
   <div className={`card-grid ${className}`.trim()}>{children}</div>
);

export default CardGrid;
