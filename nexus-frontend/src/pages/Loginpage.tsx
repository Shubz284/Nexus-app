// Remember you have to dlete the below code
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;































// import { useRef, useState } from "react";
// import Button from "../components_Custom/Button";
// import Input from "../components_Custom/Input";
// import { BACKEND_URL } from "../config";
// import axios from "axios";
// import { useNavigate } from "react-router";
// import { Toaster, toast } from "sonner";

// const Signin = () => {
//   const usernameRef = useRef<HTMLInputElement>(null);
//   const passwordRef = useRef<HTMLInputElement>(null);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   async function signin() {
//     const username = usernameRef.current?.value;
//     const password = passwordRef.current?.value;

//     if (!username || !password) {
//       toast.warning("Please Enter  Username and Password");
//       return;
//     }

//     try {
//       const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//         username,
//         password,
//       });

//       // In axios response.data has final data that backend has returned u
//       const jwt = response.data.token;
//       if (jwt) {
//         localStorage.setItem("token", jwt);
//         toast.success("You have Logged in succesfully!");

//         setTimeout(() => {
//           navigate("/dashboard");
//         }, 800);
//       } else {
//         toast.warning("Signin failed: No token received");
//       }
//     } catch (error) {
//       //@ts-ignore
//       toast.warning(`Signin failed: ${error.response?.data?.msg} `);
//     }
//   }

//   return (
//     <div className="flex h-screen w-screen items-center justify-center bg-gray-200">
//       <Toaster />
//       <div className="max-w-72 rounded-xl border border-neutral-300 bg-white px-8 py-10">
//         <div className="space-y-3">
//           <Input reference={usernameRef} placeholder="Username" />
//           <Input reference={passwordRef} placeholder="Password" />
//         </div>
//         <div className="space-y-3 pt-4 text-center">
//           <Button
//             variant="secondary"
//             text={loading ? "Signing in..." : "Signin"}
//             size="md"
//             fullWidth={true}
//             loading={true}
//             onClick={signin}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signin;
