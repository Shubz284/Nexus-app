import NotFound from "@/pages/NotFound";
import { createBrowserRouter, Navigate } from "react-router";
import { AuthRoutes } from "./AuthRoutes";
import { appRoutes } from "./AppRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/signup" replace />,
      },
      {
        path: "auth",
        children: AuthRoutes,
      },
      {
        path:"app",
        children:appRoutes
      }
    ],
  },
]);
