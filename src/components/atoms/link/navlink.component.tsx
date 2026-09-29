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
         className="group"
      >
         <span className="font-display text-base font-medium tracking-wide text-copy hover:text-accent group-data-[status=active]:text-accent sm:text-lg">
            {text}
         </span>
      </Link>
   );
};

export default NavLink;
