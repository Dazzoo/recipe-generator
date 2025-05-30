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
  name: string;
  quantity?: number;
  unit?: string;
} 