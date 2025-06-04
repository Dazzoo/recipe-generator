"use client";

import React, { useState, useCallback } from "react";
import { IngredientInput } from "@/components/ui/IngredientInput";
import { UserPreferences } from "@/components/ui/UserPreferences";
import { RecipeList } from "@/components/ui/RecipeList";
import type {
  Ingredient,
  UserPreferences as UserPreferencesType,
  Recipe,
} from "@/types";

export default function HomePage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [preferences, setPreferences] = useState<Partial<UserPreferencesType>>(
    {}
  );
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateRecipes = useCallback(async () => {
    if (ingredients.length === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients,
          preferences,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate recipes");
      }

      const recipe = await response.json();
      setRecipes([recipe]);
    } catch (error) {
      console.error("Error generating recipes:", error);
      // TODO: Add error handling UI
    } finally {
      setIsLoading(false);
    }
  }, [ingredients, preferences]);

  const handleIngredientsChange = (newIngredients: Ingredient[]) => {
    setIngredients(newIngredients);
    if (newIngredients.length > 0) {
      generateRecipes();
    }
  };

  const handlePreferencesChange = (
    newPreferences: Partial<UserPreferencesType>
  ) => {
    setPreferences(newPreferences);
    if (ingredients.length > 0) {
      generateRecipes();
    }
  };

  const handleFavoriteToggle = (recipeId: string) => {
    setRecipes(
      recipes.map((recipe) =>
        recipe.id === recipeId
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe
      )
    );
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            AI-Powered Recipe Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover delicious recipes based on ingredients you have and your
            cooking preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <section className="bg-card rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-card-foreground mb-6">
                What's in your kitchen?
              </h2>
              <IngredientInput onIngredientsChange={handleIngredientsChange} />
            </section>

            <section className="bg-card rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-card-foreground mb-6">
                Your Preferences
              </h2>
              <UserPreferences onPreferencesChange={handlePreferencesChange} />
            </section>
          </div>

          <section className="bg-card rounded-2xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-card-foreground mb-6">
              Recipe Suggestions
            </h2>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
                <p className="mt-4 text-muted-foreground text-lg">
                  Generating your perfect recipe...
                </p>
              </div>
            ) : (
              <RecipeList
                recipes={recipes}
                onFavoriteToggle={handleFavoriteToggle}
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
