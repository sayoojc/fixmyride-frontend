import { z } from "zod"
export const signupSchema = z
  .object({
    name: z.string().trim().min(1, "Business name is required").max(100, "Business name is too long"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^[6-9]\d{9}$/, "Phone number must be 10 digits"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    longitude:z.number(),
    latitude:z.number(),
    address: z.object({
      street: z.string().trim().min(1, "Street address is required").max(200, "Street address is too long"),
      city: z.string().trim().min(1, "City is required").max(100, "City name is too long"),
      state: z.string().trim().min(1, "State is required").max(100, "State name is too long"),
      pinCode: z
        .string()
        .min(1, "Zip code is required")
        .regex(/^\d{6}$/, "pin code must be 6 digits"),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
