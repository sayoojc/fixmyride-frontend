import { z } from "zod";
export const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Image file is required"),
});

export const modelSchema = z.object({
  name: z.string().min(1, "Model name is required"),
  brandId: z.string().min(1, "Brand is required"),
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Image file is required"),
  fuelTypes: z.array(z.string()).min(1, "At least one fuel type is required"),
});