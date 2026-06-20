import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Home</div>
  },
  {
    path: "details/:id",
    element: <div>Details</div>
  },
  {
    path: "cart",
    element: <div>Cart</div>
  },
  {
    path: "*",
    element: <div>Not Found</div>
  }
]);