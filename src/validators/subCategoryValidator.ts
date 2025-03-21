import { z } from "zod";

export const subCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  slug: z.string().optional(),
  categoryId: z.string().uuid("Invalid category ID format"),
});
