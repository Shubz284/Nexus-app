// import { useNavigate } from "react-router";
// import { Button } from "../components/ui/button";
// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import googleSvg from "../assets/google.svg"
// import { Brain } from "lucide-react";

// export default function Example() {
//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center gap-8">
//       <div className="flex flex-col items-center gap-5">
//         <Brain className="text-purple-700" size={35} />
//         <h1 className="text-3xl font-bold text-purple-700">Welcome to Nexus</h1>
//       </div>
//       <div className="w-full max-w-sm">
//         <Card>
//           <CardHeader>
//             <CardTitle>Create your account</CardTitle>
//             <CardDescription>
//               Enter your email below to signup to your account
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form>
//               <div className="flex flex-col gap-6">
//                 <div className="grid gap-2">
//                   <Label htmlFor="email">Email</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="m..example.com"
//                     required
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="username">Username</Label>
//                   <Input
//                     id="username"
//                     type="username"
//                     placeholder=""
//                     required
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <div className="flex items-center">
//                     <Label htmlFor="password">Password</Label>
//                   </div>
//                   <Input id="password" type="password" required />
//                 </div>
//               </div>
//             </form>
//           </CardContent>
//           <CardFooter className="flex-col gap-2">
//             <Button type="submit" className="w-full cursor-pointer">
//               Signup
//             </Button>
//             <Button variant="outline" className="w-full cursor-pointer">
//               <img src={googleSvg} width={18} height={18} />
//               Continue with Google
//             </Button>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// }
