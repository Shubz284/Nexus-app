import { Link, useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AxiosError } from "axios";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import axiosInstance from "@/api/axios";
import { toast } from "sonner";

export const signupSchema = z
  .strictObject({
    userName: z
      .string()
      .min(5, { message: "Username must be at least 5 characters." }),

    email: z.string().email({ message: "Invalid email address." }),

    password: z
      .string()
      .min(8, { message: "Must be 8+ characters long" })
      .regex(/[a-z]/, { message: "Must contain a lowercase letter" })
      .regex(/[A-Z]/, { message: "Must contain an uppercase letter" })
      .regex(/[0-9]/, { message: "Must contain a number" })
      .regex(/[^a-zA-Z0-9]/, { message: "Must contain a special character" }),

    confirmPassword: z.string(),
    agree: z.literal(true, {
      message: "You must agree to all terms and conditions.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords does not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

interface ValidationError {
  [field: string]: string[];
}

interface ApiErrorResponse {
  errors?: ValidationError;
  message?: string;
}

type SignupApiError = AxiosError<ApiErrorResponse>;

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<SignupFormData> = async (values) => {
    try {
      setIsLoading(true);
      await axiosInstance.post(`/auth/signup`, values);
      toast.success("Account Created.Please Login.", {
        id: "signup-success-toast",
      });
      setTimeout(() => {
        navigate("/auth/login");
      }, 1500);
    } catch (err) {
      const error = err as SignupApiError;

      if (error.response?.data?.errors) {
        const fieldErrors = error.response.data.errors;
        Object.entries(fieldErrors).forEach(([field, messages]) => {
          // Fixed: Simplified field validation
          form.setError(field as keyof SignupFormData, {
            type: "server",
            message: messages[0], // use the first message for that field
          });
        });
      } else {
        // Handle general error
        toast.error(
          error.response?.data?.message || "Signup failed. Please try again.",
        );
        console.error("Unexpected signup error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Sign in instead
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
                  name="userName"
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="johndoe"
                          className="mt-1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
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
                  disabled={isLoading}
                  control={form.control}
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
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Confirm Password
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

                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="agree"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-start">
                        <div className="flex h-5 items-center">
                          <FormControl>
                            <input
                              checked={field.value}
                              type="checkbox"
                              onChange={(e) => field.onChange(e.target.checked)}
                              disabled={field.disabled}
                              className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                          </FormControl>
                        </div>
                        <div className="ml-3 text-sm">
                          <FormLabel className="font-normal text-gray-700">
                            I agree to the{" "}
                            <a
                              href="#"
                              className="font-medium text-purple-600 hover:text-purple-500"
                            >
                              Terms and Conditions
                            </a>
                          </FormLabel>
                        </div>
                      </div>
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
                      Creating account...
                    </div>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Right Side - Gradient Background */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500">
          <div className="flex h-full flex-col items-center justify-center p-12 text-white">
            <div className="mb-8 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <Brain className="h-16 w-16" />
            </div>
            <h1 className="mb-4 text-center text-4xl font-extrabold">
              Your Second Brain Awaits
            </h1>
            <p className="max-w-md text-center text-lg text-purple-100">
              Join thousands organizing their knowledge and sharing their
              expertise with the world.
            </p>
            <div className="mt-12 space-y-4">
              <div className="flex items-center gap-3 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-3xl">📚</div>
                <div>
                  <p className="font-semibold">Save from Anywhere</p>
                  <p className="text-sm text-purple-100">
                    YouTube, Twitter, Instagram & more
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-3xl">🏷️</div>
                <div>
                  <p className="font-semibold">Smart Organization</p>
                  <p className="text-sm text-purple-100">
                    Tag and categorize effortlessly
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-3xl">🔗</div>
                <div>
                  <p className="font-semibold">Share Your Knowledge</p>
                  <p className="text-sm text-purple-100">
                    Beautiful shareable collections
                  </p>
                </div>
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
