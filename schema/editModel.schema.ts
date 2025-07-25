import { z } from "zod";
export const modelSchema = z.object({
  name: z.string().min(1, "Model name is required"),
  brandId: z.string().min(1, "Brand is required"),
  image: z
    .instanceof(File),
  fuelTypes: z.array(z.string()).min(1, "At least one fuel type is required"),
});