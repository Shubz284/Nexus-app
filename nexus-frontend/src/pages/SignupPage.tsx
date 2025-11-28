// Remember you have to dlete the below code
import SignupForm from '@/components/auth/SignupForm'


export  const SignupPage = () => {
  return (
    <div>
      <SignupForm/>
    </div>
  )
}
















































































// import { useRef, useState } from "react";
// import Input from "../components_Custom/Input";
// import Button from "../components_Custom/Button";
// import axios from "axios";
// import { BACKEND_URL } from "../config";
// import { useNavigate } from "react-router";
// import auth from "../assets/google.png";
// import { Toaster, toast } from "sonner";

// const Signup = () => {
//   const usernameRef = useRef<HTMLInputElement>(null);
//   const passwordRef = useRef<HTMLInputElement>(null);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   async function signup() {
//     const username = usernameRef.current?.value;
//     const password = passwordRef.current?.value;

//     setLoading(true);

//     try {
//       await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//         username,
//         password,
//       });

//       // Show success toast
//       toast.success("You signed up successfully!");

//       // Wait a bit before navigating so user can see the toast
//       setTimeout(() => {
//         navigate("/signin");
//       }, 1500);
//     } catch (error: any) {
//       // Handle errors and show error toasts
//       if (error.response && error.response.data) {
//         const errorData = error.response.data;

//         // Handle field-specific validation errors
//         if (errorData.errors) {
//           // Show each field error as a separate toast
//           Object.entries(errorData.errors).forEach(([field, message]) => {
//             toast.error(`${field}: ${message}`);
//           });
//         }
//         // Handle general error message
//         else if (errorData.message) {
//           toast.error(errorData.message);
//         }
//         // Default error
//         else {
//           toast.error("Something went wrong. Please try again.");
//         }
//       } else {
//         toast.error("Network error. Please check your connection.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }

//   const handleGoogleLogin = async () => {
//     window.location.href = `${BACKEND_URL}/auth/google`; // Redirect to backend Google auth route
//   };

//   return (
//     <div className="flex h-screen w-screen items-center justify-center bg-gray-200">
//       <div className="max-w-72 rounded-xl border border-neutral-300 bg-white px-8 py-10">
//         <div className="space-y-3">
//           <Input reference={usernameRef} placeholder="Username" />
//           <Input reference={passwordRef} placeholder="Password" />
//         </div>
//         <div className="mt-3 flex items-center justify-center">
//           <button onClick={handleGoogleLogin}>
//             <img
//               src={auth}
//               alt="Google login"
//               className="h-10 w-10 cursor-pointer"
//             />
//           </button>
//         </div>
//         <div className="pt-4 text-center">
//           <Button
//             variant="secondary"
//             text={loading ? "Signing up..." : "Signup"}
//             size="md"
//             fullWidth={true}
//             loading={true}
//             onClick={signup}
//           />
//         </div>
//         <div className="pt-2 font-medium tracking-tight">
//           <p> Already have an account?</p>
//         </div>
//       </div>
//       <Toaster />
//     </div>
//   );
// };

// export default Signup;
