import { z } from "zod";

export const ingredientSchema = z.object({
  name: z.string()
    .min(3, "Ingredient name must be at least 3 characters")
    .regex(/^[a-zA-Z\s]+$/, "Ingredient name can only contain letters and spaces"),
  quantity: z.number()
    .min(0.01, "Quantity must be greater than 0")
    .max(1000, "Quantity must be less than 1000")
    .optional(),
  unit: z.string()
    .min(1, "Unit is required")
    .optional(),
});

export type IngredientSchema = z.infer<typeof ingredientSchema>; 