import { z } from "zod";

export const updateProfileSchema = z.object({
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Phone number must be 10 digits starting with 6-9"),
  userName: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name too long"),
  userId: z.string().trim().min(1, "User ID is required"),
});