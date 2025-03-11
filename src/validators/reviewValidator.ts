import { z } from "zod";

export const reviewSchema = z.object({
  userId: z.string().uuid({ message: "Invalid user ID" }),
  productId: z.string().uuid({ message: "Invalid product ID" }),
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
});
