import type { ReactNode, SelectHTMLAttributes } from 'react';

import { EYEBROW } from '@/components/atoms/stat/stat.component';

/**
 * Box shared by every filter control: the discover selects and the keyword
 * combobox input. One pixel of `bold` border on a `neutral` fill, the same
 * language as the navbar search field, so it lifts off a `bg-subtle` panel in
 * both themes. `h-10` keeps every control the same height, which is what lets
 * a wrapping filter row align on its bottom edge.
 */
export const FIELD_CONTROL =
   'h-10 w-full rounded-md border border-solid border-bold/40 bg-neutral px-3 text-sm text-copy shadow-sm hover:border-bold/70 focus-visible:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

type SelectProps = Omit<
   SelectHTMLAttributes<HTMLSelectElement>,
   'className' | 'id'
> & {
   id: string;
   label: string;
   /** Classes for the wrapper, typically a width from `sm` up. */
   className?: string;
   /** The `<option>`s. */
   children: ReactNode;
};

/**
 * A labelled native `<select>` in the filter-control recipe: an `EYEBROW`
 * label over the control, left-aligned. The browser's arrow is replaced with
 * a chevron that follows the text colour, so the control looks the same in
 * every browser and theme.
 */
const Select = ({
   id,
   label,
   className = '',
   children,
   ...rest
}: SelectProps) => (
   <div className={`flex flex-col gap-1.5 text-left ${className}`.trim()}>
      <label htmlFor={id} className={EYEBROW}>
         {label}
      </label>
      <div className="relative">
         <select
            id={id}
            className={`${FIELD_CONTROL} appearance-none pr-9`}
            {...rest}
         >
            {children}
         </select>
         <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-current text-copy/60"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
         >
            <path d="m4 6 4 4 4-4" />
         </svg>
      </div>
   </div>
);

export default Select;
