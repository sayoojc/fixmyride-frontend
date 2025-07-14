import { z } from "zod"

const PartSchema = z.object({
  name: z.string().min(1, "Part name is required").max(100, "Part name too long"),
  price: z.number().min(0, "Price must be positive").max(999999, "Price too high"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(1000, "Quantity too high"),
})

const PriceBreakupSchema = z.object({
  parts: z.array(PartSchema).min(1, "At least one part is required").max(50, "Too many parts"),
  laborCharge: z.number().min(0, "Labor charge must be positive").max(999999, "Labor charge too high"),
  discount: z.number().min(0, "Discount must be positive").max(999999, "Discount too high").optional(),
  tax: z.number().min(0, "Tax must be positive").max(999999, "Tax too high").optional(),
  total: z.number().min(0, "Total must be positive").max(999999, "Total too high"),
})

export const ServicePackageSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long").trim(),
  description: z.string().min(1, "Description is required").max(500, "Description too long").trim(),
  brandId: z.string().min(1, "Brand is required"),
  modelId: z.string().min(1, "Model is required"),
  imageUrl:z.string(),
  servicePackageCategory : z.enum(["general", "ac", "brake", "washing"]),
  fuelType: z.enum(['petrol','diesel','lpg','cng'], {
    required_error: "Fuel type is required",
    invalid_type_error: "Invalid fuel type",
  }),
  servicesIncluded: z
    .array(z.string().min(1, "Service name cannot be empty"))
    .min(1, "At least one service is required")
    .max(20, "Too many services"),
  priceBreakup: PriceBreakupSchema,
})

export type ServicePackageFormData = z.infer<typeof ServicePackageSchema>
export type PartFormData = z.infer<typeof PartSchema>
export type PriceBreakupFormData = z.infer<typeof PriceBreakupSchema>

// Validation helper functions
export const validateServicePackage = (data: unknown): ServicePackageFormData => {
  return ServicePackageSchema.parse(data)
}

export const validatePartialServicePackage = (data: unknown): Partial<ServicePackageFormData> => {
  return ServicePackageSchema.partial().parse(data)
}
