import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import GoogleIcon from "../../assets/google.svg";

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
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Loader2Icon, Brain, Sparkles } from "lucide-react";
import axiosInstance from "@/api/axios";
import { SERVER_URL } from "@/config/env";
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

  async function onSubmit(formData: LoginFormData) {
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
    <div className="flex h-screen overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex w-full flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 p-2">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Nexus</span>
            </Link>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/auth/signup"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Sign up for free
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  disabled={isLoading}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Email address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          className="mt-1"
                          {...field}
                        />
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
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="mt-1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={`${SERVER_URL}/auth/google`}
                  className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  <img src={GoogleIcon} className="h-5 w-5" alt="Google" />
                  Continue with Google
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Gradient Background */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500">
          <div className="flex h-full flex-col items-center justify-center p-12 text-white">
            <Sparkles className="mb-8 h-16 w-16" />
            <h1 className="mb-4 text-center text-4xl font-extrabold">
              Organize Your Digital Life
            </h1>
            <p className="max-w-md text-center text-lg text-purple-100">
              Save, organize, and share content from across the web in one
              beautiful place.
            </p>
            <div className="mt-12 grid gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-2">
                  <Brain className="h-5 w-5" />
                </div>
                <span className="text-sm">Your personal knowledge hub</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-2">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="text-sm">Smart organization with tags</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-2">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="text-sm">Share your collections</span>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-20 -left-20 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl"></div>
          <div className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-pink-300 opacity-20 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
