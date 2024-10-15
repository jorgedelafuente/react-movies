import NavLink from '@/components/atoms/link/navlink.component';

const NavbarMenuList = () => {
   return (
      <div>
         <NavLink path="/popular" text="Popular" />
         <span className="p-1 text-copy">|</span>
         <NavLink path="/top-rated" text="Top Rated" />
         <span className="p-1 text-copy">|</span>
         <NavLink path="/upcoming" text="Upcoming" />
      </div>
   );
};
export default NavbarMenuList;
