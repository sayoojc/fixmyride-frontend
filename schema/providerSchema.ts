import { z } from "zod";

export const verificationSchema = z.object({
  licenseImage: z.any().refine((val) => val !== null, {
    message: "License image is required",
  }),
  idProofImage: z.any().refine((val) => val !== null, {
    message: "ID proof image is required",
  }),
  accountHolderName: z.string().min(1, { message: "Account holder name is required" }),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, {
    message: "Invalid IFSC code",
  }),
  bankName:z.string().min(3,{message:"Bank name is required"}),
  accountNumber: z
    .string()
    .min(5, { message: "Account number is too short" })
    .max(20, { message: "Account number is too long" }),
  startedYear: z.string().regex(/^\d{4}$/, {
    message: "Enter a valid year (e.g., 2020)",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
});

export type VerificationFormData = z.infer<typeof verificationSchema>;
