"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { jwtDecode } from "jwt-decode"; // ✅ Use jwt-decode
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // ✅ Initialize hooks first
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
  const [invalidToken, setInvalidToken] = useState(false);
  const [userInfo, setUserInfo] = useState<{ id: string; role: string } | null>(
    null
  );

  // ✅ Decode token on mount
  useEffect(() => {
    try {
      if (token) {
        const decoded = jwtDecode<{ id: string; role: string }>(token);
        setUserInfo(decoded);
      } else {
        setInvalidToken(true);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      setInvalidToken(true);
    }
  }, [token]);

  const onSubmit = async (data: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!token || !userInfo?.id || !userInfo?.role) {
      toast.error("Invalid or expired reset link.");
      return;
    }

    try {
      const result = await resetPassword({
        id: userInfo.id,
        newPassword: data.newPassword,
        token,
        role: userInfo.role,
      }).unwrap();

      if (result) {
        toast.success("Password reset successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (error) {
      console.error("Reset Password Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // ✅ Show error message for invalid token instead of early return
  if (invalidToken) {
    return (
      <div className="text-center text-red-500 font-semibold mt-10">
        Invalid or expired reset link.
      </div>
    );
  }

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

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<p className="text-center">Loading...</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;
