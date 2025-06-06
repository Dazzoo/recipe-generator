
export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  id: string;
  userId: string;
  dietaryRestrictions: string[];
  allergies: string[];
  cookingSkillLevel: 'beginner' | 'intermediate' | 'expert';
  preferredCuisines: string[];
  cookingTimePreference: 'quick' | 'moderate' | 'elaborate';
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


export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit: Unit;
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

export type Unit = typeof COMMON_UNITS[number]['value'];