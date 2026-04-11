import { Link } from '@tanstack/react-router';

type NavLinkProps = {
   path: string;
   text: string;
};

const NavLink = ({ path, text }: NavLinkProps) => {
   return (
      <Link role="link" to={path} activeOptions={{ exact: true }}>
         <span className="text-copy hover:text-sky-500">{text}</span>
      </Link>
   );
};

export default NavLink;
