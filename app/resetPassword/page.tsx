"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResetPasswordMutation } from "@/redux/api/authApi"; // Assuming you have an API setup
import jwt, { JwtPayload } from "jsonwebtoken";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const decodeToken = (token: string): JwtPayload | null => {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const token = searchParams.get("token") || "";
  const res = decodeToken(token);

  // Extracting token & id from the URL (which should be passed from the email)
  const id = res?.id ;
  const role = res?.role; // Assuming role is also passed

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!token || !id || !role) {
      toast.error("Invalid or expired reset link.");
      return;
    }

    try {
      const result = await resetPassword({
        id,
        newPassword: data.newPassword,
        token,
        role,
      }).unwrap();

      console.log(result);

      if (result) {
        toast.success("Password reset successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Reset Password</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium">New Password</label>
            <Input
              type={showPassword ? "text" : "password"}
              {...register("newPassword", { required: "Password is required" })}
              placeholder="Enter new password"
              className="mt-1"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium">
              Confirm Password
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("newPassword") || "Passwords must match",
              })}
              placeholder="Confirm your password"
              className="mt-1"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Show Password Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <span className="text-sm">Show Password</span>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
