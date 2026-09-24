import type { ReactNode } from 'react';

/**
 * Small uppercase caption used above values, section names and crew roles on
 * the detail and profile pages. Add `font-sans` when applying it to a heading,
 * since headings default to the display face.
 */
export const EYEBROW =
   'text-xs font-semibold uppercase tracking-wider text-copy/60';

/**
 * One cell of a facts list: an eyebrow `<dt>` over a display-face `<dd>`.
 * Render inside a `<dl>` laid out as a grid or a wrapping flex row. Centred by
 * default; pass `className="sm:items-start"` to left-align from `sm` up.
 */
export const Stat = ({
   label,
   children,
   className = '',
}: {
   label: string;
   children: ReactNode;
   className?: string;
}) => (
   <div className={`flex flex-col items-center gap-1 ${className}`}>
      <dt className={EYEBROW}>{label}</dt>
      <dd className="font-display text-lg font-semibold tabular-nums">
         {children}
      </dd>
   </div>
);

/** Secondary line under a `Stat` value, e.g. a vote count or an age. */
export const StatNote = ({ children }: { children: ReactNode }) => (
   <span className="block font-sans text-xs font-normal text-copy/60">
      {children}
   </span>
);
