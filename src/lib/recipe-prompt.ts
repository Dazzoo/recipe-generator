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
  const dietaryRestrictions = preferences.dietaryRestrictions?.length > 0 
    ? preferences.dietaryRestrictions.join(", ") 
    : "none";
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

  const timeConstraints = {
    quick: "Total cooking time should be 30 minutes or less. Use simple techniques and minimal prep.",
    moderate: "Total cooking time should be between 30-60 minutes. You can use moderate techniques.",
    elaborate: "Total cooking time can be 60+ minutes. Complex techniques and detailed preparation are acceptable."
  };

  const skillGuidance = {
    beginner: "Use simple techniques only (chopping, basic sautéing, boiling). Avoid advanced methods like braising, sous vide, or complex reductions. Provide very detailed, step-by-step instructions with no assumed knowledge.",
    intermediate: "You can use moderate techniques (sautéing, roasting, basic sauces). Instructions should be clear but can assume some cooking knowledge.",
    expert: "Advanced techniques are welcome (complex sauces, multi-step preparations, advanced cooking methods). Instructions can be more concise."
  };

  const dietaryGuidance = dietaryRestrictions !== "none" 
    ? `CRITICAL: This recipe MUST strictly adhere to the following dietary restrictions: ${dietaryRestrictions}. Do not include any ingredients or cooking methods that violate these restrictions. If an ingredient conflicts, suggest a suitable substitute.`
    : "No specific dietary restrictions. Use standard ingredients.";

  return `You are an expert chef creating a precise recipe. Generate a complete, detailed recipe that strictly follows all requirements below.

PRIMARY INGREDIENTS (must be included):
${ingredientsList}

REQUIREMENTS TO FOLLOW EXACTLY:

1. SERVING SIZE: ${servingSize} people
   - All ingredient quantities MUST be calculated for exactly ${servingSize} servings
   - Do not provide quantities for a different serving size

2. COOKING SKILL LEVEL: ${skillLevel}
   ${skillGuidance[skillLevel as keyof typeof skillGuidance]}

3. TIME CONSTRAINT: ${timePreference}
   ${timeConstraints[timePreference as keyof typeof timeConstraints]}
   - prepTime + cookTime MUST equal totalTime
   - Ensure the totalTime aligns with the ${timePreference} preference

4. DIETARY RESTRICTIONS: ${dietaryRestrictions}
   ${dietaryGuidance}

5. INGREDIENT HANDLING:
   - ALL provided ingredients (${ingredientsList}) MUST appear in the final ingredients list
   - If a provided ingredient lacks quantity/unit, determine appropriate amounts based on ${servingSize} servings
   - Add complementary ingredients (spices, seasonings, basic pantry items) to create a complete, balanced dish
   - For each ingredient, provide exact amounts with proper units (cups, tablespoons, grams, etc.)

6. INSTRUCTIONS QUALITY:
   - Number each step sequentially starting from 1
   - Each step should be specific and actionable
   - Include timing, temperatures, and visual cues where relevant
   - Match instruction complexity to ${skillLevel} skill level
   - Ensure instructions lead to a complete, finished dish

7. NUTRITIONAL INFORMATION:
   - Calculate realistic nutritional values for ${servingSize} servings
   - Values should be per serving (divide total by ${servingSize})
   - Provide accurate estimates based on the actual ingredients used

OUTPUT FORMAT - Return ONLY valid JSON (no markdown, no code blocks, no extra text):

{
  "title": "Recipe name (descriptive and appetizing)",
  "description": "2-3 sentence description of the dish, its flavors, and why it's suitable for ${skillLevel} cooks",
  "prepTime": <number in minutes>,
  "cookTime": <number in minutes>,
  "totalTime": <number in minutes - must equal prepTime + cookTime>,
  "servings": ${servingSize},
  "ingredients": [
    {
      "name": "exact ingredient name",
      "amount": <number>,
      "unit": "standard unit (cup, tbsp, tsp, g, oz, piece, etc.)"
    }
  ],
  "instructions": [
    {
      "step": <number starting from 1>,
      "description": "detailed, actionable instruction"
    }
  ],
  "tips": [
    "helpful tip 1",
    "helpful tip 2",
    "helpful tip 3"
  ],
  "nutritionalInfo": {
    "calories": <number per serving>,
    "protein": <number in grams per serving>,
    "carbs": <number in grams per serving>,
    "fat": <number in grams per serving>
  }
}

CRITICAL: 
- Return ONLY the JSON object, no markdown formatting, no code block markers
- Ensure all numbers are actual numbers (not strings)
- All provided ingredients must be in the ingredients array
- Quantities must be accurate for ${servingSize} servings
- Follow time constraints strictly
- Match skill level complexity exactly`;
}

export function validateRecipeResponse(response: unknown): RecipeResponse {
  // TODO: Add proper validation using zod schema
  return response as RecipeResponse;
} 