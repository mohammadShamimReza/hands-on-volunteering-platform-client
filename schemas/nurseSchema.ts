import { z } from "zod";

export const nurseSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Name is required"),

  email: z.string().email("Invalid email address"), password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      "Password must contain a letter, a number, and a special character"
  ),
  phone: z.number().min(10, "Phone number must be at least 10 characters"),
  address: z.string().optional(),
  role: z.string().min(2, "Role is required"),
});

export type Nurse = z.infer<typeof nurseSchema>;
