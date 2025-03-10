"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { useNavigation } from "@/contexts/NavigatoinContext";
import { storeTokenInCookie } from "@/lib/auth/token";
import { useCreateUserMutation } from "@/redux/api/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { storeAuthToken, storeUserInfo } from "@/redux/slice/authSlice";
import { Eye, EyeOff } from "lucide-react";
import Select from "react-select";
import { toast } from "sonner";

// Define validation schema with Zod
// Define validation schema with Zod
const signupSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email format"),
  bio: z.string().min(1, "Bio is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      "Password must contain a letter, a number, and a special character"
    ),
  skills: z.array(z.string()).nonempty("Select at least one skill"),
  causes: z.array(z.string()).nonempty("Select at least one cause"),
});

type SignupFormData = z.infer<typeof signupSchema>;
type OptionType = { label: string; value: string };

const skillsOptions = [
  "Academic",
  "Art",
  "Business",
  "Communication",
  "Computer",
  "Cooking",
  "Craft",
  "Creative",
  "Design",
  "Engineering",
  "Finance",
  "Health",
  "Language",
  "Leadership",
  "Legal",
  "Management",
  "Marketing",
  "Music",
  "Photography",
  "Programming",
  "Science",
  "Social",
].map((skill) => ({ label: skill, value: skill }));

const causesOptions = [
  "Animal",
  "Arts",
  "Children",
  "Community",
  "Crisis",
  "Culture",
  "Disability",
  "Disaster",
  "Education",
  "Employment",
  "Elderly",
  "Environment",
  "Health",
  "Human",
  "Humanitarian",
  "International",
  "Poverty",
  "Rights",
  "Social",
  "Sports",
  "Technology",
].map((cause) => ({ label: cause, value: cause }));

const SignupPage: React.FC = () => {
  const { setSelectedMenu } = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Local loading state

  const router = useRouter();
  const dispatch = useAppDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const [createUser] = useCreateUserMutation();
  const formMethods = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      bio: "",
      skills: [],
      causes: [],
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = formMethods;

  const onSubmit = async (data: SignupFormData) => {
    console.log(data, "this is input data");
    // Simulated API call
    setLoading(true); // Start loading
    try {
      const result = await createUser(data);
      console.log(result);
      setSelectedMenu("overview");
      if (result?.error) {
        toast("User not created successfully", {
          style: {
            backgroundColor: "red",
            color: "white",
          },
        });
      } else {
        toast("User created successfully");

        storeTokenInCookie(result?.data?.data.accessToken);
        dispatch(storeAuthToken(result?.data?.data.accessToken));
        localStorage.setItem("jwt", result?.data?.data.accessToken);

        dispatch(storeUserInfo(result?.data?.user));
        router.push("/");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(onSubmit)} className=" space-y-4">
              <div className="">
                {/* Full Name Field */}
                <FormField
                  control={control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage>{errors.fullName?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <br />

                {/* Email Field */}
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage>{errors.email?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <br />
                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
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
                <br />
                {/* bio Field */}
                <FormField
                  control={control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Bio data" {...field} />
                      </FormControl>
                      <FormMessage>{errors.bio?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <br />
                <p className="mb-0.5">Skills</p>
                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={skillsOptions}
                      value={skillsOptions.filter((option) =>
                        field.value.includes(option.value)
                      )}
                      isMulti
                      onChange={(selectedOptions) =>
                        field.onChange(
                          selectedOptions.map((option) => option.value)
                        )
                      }
                    />
                  )}
                  rules={{ required: true }}
                />
                <br />
                <p className="mb-0.5">Causes</p>
                <Controller
                  name="causes"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={causesOptions}
                      value={causesOptions.filter((option) =>
                        field.value.includes(option.value)
                      )}
                      isMulti
                      onChange={(selectedOptions) =>
                        field.onChange(
                          selectedOptions.map((option) => option.value)
                        )
                      }
                    />
                  )}
                  rules={{ required: true }}
                />
              </div>
              <Button type="submit" className="w-full">
                {loading ? "Creating Account..." : "Create an Account"}
              </Button>
            </form>
          </FormProvider>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
