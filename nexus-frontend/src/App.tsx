
import GlobalErrorBoundary from "@/components/GlobalErrorBoundry";
import { Toaster } from "sonner";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index";

const App = () => {

  return(
    <>
    <GlobalErrorBoundary>
      <Toaster />
      <RouterProvider router={router}/>
    </GlobalErrorBoundary>
    </>
  )


};

export default App;

// const router = createBrowserRouter([
  //   { index: true, Component: SignupForm },
  //   { path: "/auth/signup", Component:SignupForm },
  //   { path: "/auth/login", Component: LoginForm },
  //   { path: "/dashboard", Component: Dashboard },
  //   { path: "*", Component: NotFound },
  //   // { path: "/auth/google/callback", Component: AuthCallback }
  // ]);