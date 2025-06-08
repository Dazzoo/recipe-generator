import type { UserPreferences } from "@/types";

export interface Ingredient {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
}

export interface RecipeResponse {
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  ingredients: {
    name: string;
    amount: number;
    unit: string;
  }[];
  instructions: {
    step: number;
    description: string;
  }[];
  tips: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export function generateRecipePrompt(ingredients: Ingredient[], preferences: UserPreferences): string {
  const dietaryRestrictions = preferences.dietaryRestrictions?.join(", ") || "none";
  const skillLevel = preferences.cookingSkillLevel;
  const timePreference = preferences.cookingTimePreference;
  const servingSize = preferences.servingSize;

  const ingredientsList = ingredients
    .map(ing => {
      if (ing.quantity && ing.unit) {
        return `${ing.quantity} ${ing.unit} of ${ing.name}`;
      } else if (ing.quantity) {
        return `${ing.quantity} of ${ing.name}`;
      } else if (ing.unit) {
        return `${ing.unit} of ${ing.name}`;
      }
      return ing.name;
    })
    .join(", ");

  return `Create a recipe using these ingredients: ${ingredientsList}

Requirements:
- Dietary restrictions: ${dietaryRestrictions}
- Cooking skill level: ${skillLevel}
- Time preference: ${timePreference}
- Serving size: ${servingSize} people

Please provide the recipe in the following JSON format:
{
  "title": "string",
  "description": "string",
  "prepTime": number (in minutes),
  "cookTime": number (in minutes),
  "totalTime": number (in minutes),
  "servings": number,
  "ingredients": [
    {
      "name": "string",
      "amount": number,
      "unit": "string"
    }
  ],
  "instructions": [
    {
      "step": number,
      "description": "string"
    }
  ],
  "tips": ["string"],
  "nutritionalInfo": {
    "calories": number,
    "protein": number (in grams),
    "carbs": number (in grams),
    "fat": number (in grams)
  }
}

Make sure to:
1. Include the provided ingredients in the recipe
2. Suggest complementary ingredients to create a complete dish
3. Adjust quantities based on serving size
4. Consider dietary restrictions
5. Match the cooking skill level
6. Keep within the time preference
7. Provide clear, step-by-step instructions
8. Include helpful tips
9. Calculate approximate nutritional information
10. If an ingredient doesn't have a specified quantity or unit, suggest appropriate amounts based on the recipe`;
}

export function validateRecipeResponse(response: unknown): RecipeResponse {
  // TODO: Add proper validation using zod schema
  return response as RecipeResponse;
} 