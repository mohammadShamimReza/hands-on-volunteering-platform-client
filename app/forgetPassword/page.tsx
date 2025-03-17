"use client";
import { Button } from "@/components/ui/button";
import { useForgetPasswordMutation } from "@/redux/api/authApi";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ErrorType {
  response?: {
    statusCode?: number;
    message?: string;
    errorMessages?: string;
  };
}

interface ForgetPasswordResponse {
  statusCode?: number;
  success?: boolean;
  message?: string | null;
  data?: string; // 🔹 Now, reset link is stored directly in "data"
}

function ForgetPassword() {
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const { errors } = formState;

  const onSubmit = async (data: { email: string }) => {
    try {
      const result: ForgetPasswordResponse = await forgetPassword(
        data
      ).unwrap();
      console.log(result);
      const resetLink = result?.data; // 🔹 Extract only the reset link

      if (resetLink) {
        setPreviewUrl(resetLink); // ✅ Now setting only the string URL
        toast.success("Password reset link sent! Check your email.");
      } else {
        toast.error("Failed to retrieve reset link.");
      }
    } catch (error) {
      console.error("Error:", error);
      const specificError = error as ErrorType;
      const errorMessage =
        specificError?.response?.errorMessages || "An error occurred.";
      toast.error(errorMessage);
    }
  };
  return (
    <div className="min-h-screen mt-10 flex flex-col items-center">
      <h2 className="text-2xl font-bold">Forgot Password?</h2>
      <p className="text-sm text-gray-600 mt-2">
        Enter your email, and we&apos;ll send you a link to reset your password.
      </p>

      {/* ✅ Reset Link Display */}
      {previewUrl && (
        <div className="mt-5 bg-blue-50 border border-blue-300 text-blue-800 p-3 rounded-md shadow-md text-center">
          <p>Password reset link:</p>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium"
          >
            Click here to reset your password
          </a>
        </div>
      )}

      {/* ✅ Email Input Form */}
      <form className="max-w-md w-full mt-6" onSubmit={handleSubmit(onSubmit)}>
        <label
          className="block text-sm font-semibold text-gray-700"
          htmlFor="email"
        >
          Email Address
        </label>
        <input
          className={`w-full p-2 border rounded-lg ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          type="email"
          id="email"
          placeholder="Enter your email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}

        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </div>
  );
}

export default ForgetPassword;
