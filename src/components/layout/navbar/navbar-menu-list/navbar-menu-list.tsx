import NavLink from '@/components/atoms/link/navlink.component';

const NavbarMenuList = () => {
   return (
      <div>
         <NavLink path="/popular" text="Popular" />
         <span className="text-copy p-1">|</span>
         <NavLink path="/top-rated" text="Top Rated" />
         <span className="text-copy p-1">|</span>
         <NavLink path="/upcoming" text="Upcoming" />
      </div>
   );
};
export default NavbarMenuList;
