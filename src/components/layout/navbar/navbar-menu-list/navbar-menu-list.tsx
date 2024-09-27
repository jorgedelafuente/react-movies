import NavLink from '@/components/atoms/link/navlink.component';

const NavbarMenuList = () => {
   return (
      <div>
         <NavLink path="/popular" text="Popular" /> |{' '}
         <NavLink path="/top-rated" text="Top Rated" /> |{' '}
         <NavLink path="/upcoming" text="Upcoming" />
      </div>
   );
};
export default NavbarMenuList;
