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
      >
         <span className="text-copy hover:text-sky-500">{text}</span>
      </Link>
   );
};

export default NavLink;
