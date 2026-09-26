import type { ReactNode } from 'react';

/**
 * Pill for links that leave the app (homepage, IMDb). Opens in a new tab.
 * The colour sits on the inner span so the `group-hover` swap stays scoped
 * to the label; anchors themselves inherit colour (Tailwind preflight).
 */
export const ExternalLink = ({
   href,
   children,
}: {
   href: string;
   children: ReactNode;
}) => (
   <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group rounded-full border border-copy/30 px-4 py-1.5 text-sm font-medium transition-colors hover:border-accent"
   >
      <span className="text-copy group-hover:text-accent">
         {children} <span aria-hidden="true">↗</span>
      </span>
   </a>
);
