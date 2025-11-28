import LoginPage from '@/pages/Loginpage';
import { SignupPage } from '@/pages/SignupPage';


export const AuthRoutes = [
  {
    path: "signup",
    element: <SignupPage />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
];
  


