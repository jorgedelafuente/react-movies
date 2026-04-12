import NavLink from '@/components/atoms/link/navlink.component';

const NavbarMenuList = () => {
   return (
      <div>
         <NavLink path="/popular" text="Popular" tabIndex={1} />
         <span className="p-1 text-copy">|</span>
         <NavLink path="/top-rated" text="Top Rated" tabIndex={2} />
         <span className="p-1 text-copy">|</span>
         <NavLink path="/upcoming" text="Upcoming" tabIndex={3} />
      </div>
   );
};
export default NavbarMenuList;
