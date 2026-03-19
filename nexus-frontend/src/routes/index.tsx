import NotFound from "@/pages/NotFound";
import { createBrowserRouter } from "react-router";
import { AuthRoutes } from "./AuthRoutes";
import { appRoutes } from "./AppRoutes";
import SharedBrain from "@/pages/SharedBrain";
import LandingPage from "@/pages/LandingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "auth",
        children: AuthRoutes,
      },
      {
        path: "app",
        children: appRoutes,
      },
      {
        path: "share/:shareLink",
        element: <SharedBrain />,
      },
    ],
  },
]);
