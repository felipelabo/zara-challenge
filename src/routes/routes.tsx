import { createBrowserRouter } from "react-router";

//layouts
import LayoutNavbar from "../pages/layout/LayoutNavbar";

//pages
import Dashboard from "../pages/Dashboard";
import Details from "../pages/Details";
import Cart from "../pages/Cart";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutNavbar />,
    children: [
      { index: true, element: <Dashboard /> },
      {
        path: "product/:id",
        element: <Details />
      },
      {
        path: "cart",
        element: <Cart />
      }
    ]
  },
  {
    path: "*",
    element: <div>Not Found</div>
  }
]);