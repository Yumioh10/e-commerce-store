import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

// Root route definition
export const RootRoute = createRootRoute({
  component: () => {
    <>
      <div>
        <Link to="/" className="[&.active]:font-bold">Home</Link>
        <Link to="/products" className="[&.active]:font-bold">
          Products
        </Link>
        <Link to="/productDetail" className="[&.active]:font-bold">
          Product Detail
        </Link>
        <Link to="/cart" className="[&.active]:font-bold">
          Cart
        </Link>
        <Link to="/Checkout" className="[&.active]:font-bold">
          CheckOut
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  }
});