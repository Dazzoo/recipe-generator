export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  cookingSkillLevel: "beginner" | "intermediate" | "advanced";
  cookingTimePreference: "quick" | "moderate" | "extensive";
  servingSize: number;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  userId: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
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

export const COMMON_UNITS = [
  { value: 'g', label: 'grams' },
  { value: 'kg', label: 'kilograms' },
  { value: 'ml', label: 'milliliters' },
  { value: 'l', label: 'liters' },
  { value: 'tsp', label: 'teaspoons' },
  { value: 'tbsp', label: 'tablespoons' },
  { value: 'cup', label: 'cups' },
  { value: 'oz', label: 'ounces' },
  { value: 'lb', label: 'pounds' },
  { value: 'pinch', label: 'pinch' },
  { value: 'piece', label: 'piece' },
  { value: 'whole', label: 'whole' },
] as const;

export type Unit =
  | "g"
  | "kg"
  | "ml"
  | "l"
  | "tsp"
  | "tbsp"
  | "cup"
  | "oz"
  | "lb"
  | "piece"
  | "pinch"
  | "to taste";