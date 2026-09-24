import type { ButtonHTMLAttributes } from 'react';

const BASE =
   'inline-flex items-center gap-2 rounded-full border border-solid px-3.5 py-1.5 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

const SELECTED = 'border-accent bg-accent/10 text-accent';
const IDLE = 'border-copy/30 text-copy hover:border-accent hover:text-accent';

const chipClass = (selected: boolean, className: string) =>
   `${BASE} ${selected ? SELECTED : IDLE} ${className}`.trim();

type ChipProps = Omit<
   ButtonHTMLAttributes<HTMLButtonElement>,
   'className' | 'type'
> & {
   /**
    * Toggle state, exposed as `aria-pressed`. Leave it out for a chip that
    * triggers an action instead (a disclosure button carrying `aria-expanded`).
    */
   selected?: boolean;
   className?: string;
};

/**
 * Pill button for a segmented choice, such as the discover Films / Series
 * switch. Selected chips fill with the accent at low alpha; idle ones are a
 * quiet outline that turns accent on hover. For a two-way layout switch use
 * `ViewToggle`, which is a proper radiogroup.
 */
const Chip = ({ selected, className = '', children, ...rest }: ChipProps) => (
   <button
      type="button"
      aria-pressed={selected}
      className={chipClass(selected ?? false, className)}
      {...rest}
   >
      {children}
   </button>
);

export default Chip;
