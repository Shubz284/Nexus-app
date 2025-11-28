import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, } from "react-hook-form";
import { z } from "zod";
import GoogleIcon from "../../assets/google.svg"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import axiosInstance from "@/api/axios";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errorHandler";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formData:LoginFormData) {
    console.log(formData);

    setIsLoading(true); // Set loading to true at the start
    try {
      const res = await axiosInstance.post(`/auth/login`, formData);

      if (res.data.success) {
        toast.success("Login successful");
        navigate(`/app/dashboard`);
      }
    } catch (err) {
      handleApiError(err as any, form as any);
    } finally {
      // This block will run whether the login succeeds or fails
      setIsLoading(false); // Always reset loading to false at the end
    }
  }

  return (
    <>
      <div className="flex min-h-screen w-full items-center justify-around overflow-x-hidden overflow-y-auto">
        <div className="p-5">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-balance">
            Login
          </h1>
          <div className="mt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-[70vw] rounded-2xl border-4 p-4 md:w-[40vw]"
              >
                <FormField
                  control={form.control}
                  disabled={isLoading}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className={"text-lg"}>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  disabled={isLoading}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className={"text-lg"}>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="Password"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="mt-4 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2Icon className="mr-2 animate-spin" />
                      Please wait
                    </div>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </Form>
          </div>

          <div>
            <div className="mt-4 mb-3 flex items-center space-x-5">
              <p>Or, Login with</p>
              <div className="mt-2 flex items-center justify-center gap-4">
                {/* Use the icons directly as components */}
                <a
                  href={`${import.meta.env.VITE_SERVER_URL}/auth/google`}
                  title="Login with Google"
                >
                  <img src={GoogleIcon}/>
                </a>
                {/* <a href="/auth/facebook" title="Login with Facebook">
                  <FacebookIcon />
                </a>
                <a
                  href={`${import.meta.env.VITE_SERVER_URL}/auth/twitter`}
                  title="Login with Twitter"
                >
                  <TwitterIcon />
                </a> */}
              </div>
            </div>

            <p>
              Don't have an account?
              <Link
                to="/auth/signup"
                className="text-blue-500 hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
