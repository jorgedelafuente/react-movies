import './nav-icon-button.styles.css';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type NavIconButtonProps = Omit<
   ButtonHTMLAttributes<HTMLButtonElement>,
   'aria-label' | 'children' | 'className' | 'type'
> & {
   /** Accessible name. The button has no visible text, so it is also the tooltip. */
   label: string;
   children: ReactNode;
};

/**
 * Round icon-only control for the navbar's utility corner (theme, account).
 * One recipe so every icon there shares the same hit area, hover lift and
 * focus ring. Glyphs are drawn in `currentColor`, so the button owns the
 * colour and each icon only supplies its shape (see the stylesheet).
 */
const NavIconButton = ({ label, children, ...rest }: NavIconButtonProps) => (
   <button
      type="button"
      className="nav-icon-button"
      aria-label={label}
      title={label}
      {...rest}
   >
      {children}
   </button>
);

export default NavIconButton;
