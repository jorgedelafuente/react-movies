import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        Navbar
        <hr />
        <div>
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>
          <br />
          <Link to="/favorites" className="[&.active]:font-bold">
            favorites
          </Link>
        </div>
      </div>
      <hr />
      {/* TODO : navbar with search */}
      {/* TODO : navbar with wishlist */}
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route!!</p>
        <Link to="/">Start Over</Link>
      </div>
    );
  },
});
