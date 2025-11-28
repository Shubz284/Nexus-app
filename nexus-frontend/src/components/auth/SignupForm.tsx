import { Link, useNavigate} from "react-router-dom";
 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import {  z } from "zod";
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

  export default function SignupForm () {
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

    const onSubmit:SubmitHandler<SignupFormData> = async (values) => {
      try {
        setIsLoading(true);
        await axiosInstance.post(`/auth/signup`, values);
          toast.success("Account Created.Please Login.", {
            id: "signup-success-toast",
          });
        setTimeout(() => {
          navigate("/auth/login");
        }, 1500)
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
          })
          } else {
        // Handle general error
        toast.error(error.response?.data?.message || "Signup failed. Please try again.");
        console.error("Unexpected signup error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  }

    return (
      <div className="flex min-h-screen items-center justify-around overflow-auto">
        <div className="p-5">
          <div className="flex items-center justify-center">
            <Brain size={40} className="text-purple-600" />
          </div>
          <h1 className="scroll-m-20 text-center text-4xl font-bold tracking-tight text-balance">
            Welcome to Nexus
          </h1>

          <div className="mt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-[70vw] rounded-2xl border-4 p-4 md:w-[40vw]"
              >
                <FormField
                  control={form.control}
                  name="userName"
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Username" {...field} />
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
                    <FormItem className="mb-4">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
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
                    <FormItem className="mb-4">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="password"
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
                    <FormItem className="mb-4">
                      <FormLabel>Confirm Password</FormLabel>
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

                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="agree"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <div className="flex items-center space-x-1.5">
                        <FormControl>
                          <input
                            checked={field.value}
                            type="checkbox"
                            onChange={(e) => field.onChange(e.target.checked)} // Fixed: Proper onChange handling
                            disabled={field.disabled}
                          />
                        </FormControl>
                        <FormLabel>
                          I agree to all terms and conditions
                        </FormLabel>
                      </div>
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
                    "Signup"
                  )}
                </Button>
              </form>
            </Form>
            <p className="mt-3">
              Already have an account ?{"  "}
              <Link to="/auth/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
}