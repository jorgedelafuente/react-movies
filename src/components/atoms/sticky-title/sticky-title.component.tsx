import './sticky-title.styles.css';

import type { ReactNode } from 'react';

/**
 * Page title bar for the detail pages (film, series, season).
 *
 * The bar sticks just below the navbar while the page scrolls. Navbar
 * publishes its rendered height as `--navbar-height`, so the offset follows
 * the bar however many rows it wraps to, and a `z-index` keeps the title above
 * the frosted `.text-content` panels, whose `backdrop-filter` would otherwise
 * paint over a sticky element with no z-index of its own. Where the browser
 * supports scroll-driven animations and the visitor has not asked for reduced
 * motion, the bar starts as a light glass label and thickens and grows over
 * the first 200px of scroll; everywhere else it keeps the resting look.
 *
 * Renders the page's `h1` by default. Pass `as="p"` on a page whose `h1`
 * already sits in the body (the season page), so the document keeps a single
 * top-level heading.
 */
const StickyTitle = ({
   children,
   as: Tag = 'h1',
   testId,
}: {
   children: ReactNode;
   as?: 'h1' | 'p';
   /** Set on the inner span so specs can read the visible title. */
   testId?: string;
}) => (
   <Tag className="sticky-title text-balance font-display text-display-xs font-semibold text-copy">
      <span data-testid={testId}>{children}</span>
   </Tag>
);

export default StickyTitle;
