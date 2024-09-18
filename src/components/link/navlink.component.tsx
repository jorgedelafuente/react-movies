import { Link } from '@tanstack/react-router';

const NavLink = ({ path, text }: { path: string; text: string }) => {
    return (
        <Link to={path} activeOptions={{ exact: true }}>
            <span className="text-slate-50 hover:text-sky-500">{text}</span>
        </Link>
    );
};

export default NavLink;