"use client";

import { IngredientInput } from "@/components/IngredientInput/IngredientInput";
import { RecipeCard } from "@/components/Recipe/RecipeCard";
import { UserPreferences } from "@/components/UserPreferences";
import { notifyError, notifySuccess } from "@/lib/notifications";
import type { RecipeResponse, UserPreferences as UserPreferencesType } from "@/types";
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null);
  const [preferences, setPreferences] = useState<UserPreferencesType>({
    dietaryRestrictions: [],
    cookingSkillLevel: "beginner",
    cookingTimePreference: "moderate",
    servingSize: 2,
  });

  const handleSubmit = async (prompt: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || "Failed to generate recipe";
        
        if (response.status === 429) {
          notifyError("Rate Limit Exceeded", errorMessage);
        } else {
          notifyError("Error", errorMessage);
        }
        return;
      }

      const recipeData = await response.json();
      setRecipe(recipeData);
      notifySuccess("Recipe Generated", "Your recipe has been generated successfully!");
    } catch (error) {
      console.error("Error generating recipe:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate recipe. Please try again.";
      notifyError("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesChange = (newPreferences: Partial<UserPreferencesType>) => {
    setPreferences((prev) => ({ ...prev, ...newPreferences }));
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Recipe Generator</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Your Preferences</h2>
            <UserPreferences onPreferencesChange={handlePreferencesChange} />
          </div>

          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
            <IngredientInput onSubmit={handleSubmit} isLoading={isLoading} preferences={preferences} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Recipe</h2>
          {recipe ? (
            <RecipeCard recipe={recipe} />
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              {isLoading ? "Generating recipe..." : "Your recipe will appear here"}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
