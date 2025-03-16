"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { storeTokenInCookie } from "@/lib/auth/token";
import { useLoginUserMutation } from "@/redux/api/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { storeAuthToken } from "@/redux/slice/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Define the validation schema using Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      "Password must contain a letter, a number, and a special character"
    ),
  role: z.string().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loginUser] = useLoginUserMutation();
  const [loading, setLoading] = useState(false); // Local loading state

  const formMethods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = formMethods;

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data: LoginFormData) => {
    if (data.email !== "" && data.password !== "") {
      try {
        setLoading(true);
        data.role = "USER";
        const result = await loginUser(data);

        if (result?.error) {
          toast("User is not valid, please give the valid crediantials", {
            style: {
              backgroundColor: "red",
              color: "white",
            },
          });
        } else {
          toast("Login successfully");

          storeTokenInCookie(result?.data?.data.accessToken);
          dispatch(storeAuthToken(result?.data?.data.accessToken));
          localStorage.setItem("jwt", result?.data?.data.accessToken);

          location.replace("/");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // End loading
      }
    } else {
      toast("Invalid email or password.");
    }
  };

  return (
    <div className="w-full xl:min-h-[800px] mx-auto">
      {/* Left Column - Login Form */}
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-muted-foreground">
              Get all login crediantials in{" "}
              <Link
                className="underline text-blue-700"
                href={
                  "https://github.com/mohammadShamimReza/Shamim-Hospital-frontend?tab=readme-ov-file#credentials-for-testing"
                }
                target="_blank"
              >
                Here
              </Link>
            </p>
          </div>

          <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage>{errors.email?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      {/* <Link
                        href="/forgot-password"
                        className="text-sm underline"
                      >
                        Forgot your password?
                      </Link> */}
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="name123$#"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 px-2 flex items-center"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <p className="text-xs text-muted-foreground ml-3">
                      Password must contain a letter, a number, and a special
                      character
                    </p>
                    <FormMessage>{errors.password?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </FormProvider>

          <div className=" text-right text-sm">
            <Link href="/forgetPassword" className="underline">
              Forget Password
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column - Cover Image */}
    </div>
  );
}
