import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z.number().positive("Price must be a positive number"),
  salePrice: z.number().positive("Sale Price must be a positive number"),
  stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
  weight: z.number().positive().optional(),
  length: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  categoryId: z.string().uuid("Invalid category ID format"),
  subcategory: z.string().optional(),
  images: z
    .array(
      z.object({
        url: z.string().url("Invalid image URL format"),
        alt: z.string().optional(),
      })
    )
    .min(1, "At least one image is required"),
});
