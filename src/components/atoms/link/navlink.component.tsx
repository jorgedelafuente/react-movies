import { Link } from '@tanstack/react-router';

type NavLinkProps = {
   path: string;
   text: string;
   tabIndex?: number;
};

const NavLink = ({ path, text, tabIndex }: NavLinkProps) => {
   return (
      <Link
         role="link"
         to={path}
         activeOptions={{ exact: true }}
         tabIndex={tabIndex}
         className="group relative inline-flex flex-col items-center"
      >
         <span className="font-display text-base font-medium tracking-wide text-copy hover:text-accent group-data-[status=active]:text-accent sm:text-lg">
            {text}
         </span>
         {/* Slides in under the active route with a spring overshoot instead of a flat fade. */}
         <span
            aria-hidden="true"
            className="absolute -bottom-1 h-0.5 w-full origin-center scale-x-0 rounded-full bg-accent transition-transform duration-[var(--motion-duration-base)] ease-[var(--motion-ease-spring)] group-data-[status=active]:scale-x-100"
         />
      </Link>
   );
};

export default NavLink;
