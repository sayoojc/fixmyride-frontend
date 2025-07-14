import { z } from "zod";

export const signupValidationSchema = z
  .object({
    fullName: z.string().trim().min(1, "Full name is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    phone: z
      .string()
      .regex(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .min(1, "Phone is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number"),
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
