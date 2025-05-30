'use client';

import React, { useState, useCallback } from 'react';
import { IngredientInput } from '@/components/ui/IngredientInput';
import { UserPreferences } from '@/components/ui/UserPreferences';
import { RecipeList } from '@/components/ui/RecipeList';
import type { Ingredient, UserPreferences as UserPreferencesType, Recipe } from '@/types';

export default function HomePage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [preferences, setPreferences] = useState<Partial<UserPreferencesType>>({});
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateRecipes = useCallback(async () => {
    if (ingredients.length === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients,
          preferences,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipes');
      }

      const recipe = await response.json();
      setRecipes([recipe]);
    } catch (error) {
      console.error('Error generating recipes:', error);
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

  const handlePreferencesChange = (newPreferences: Partial<UserPreferencesType>) => {
    setPreferences(newPreferences);
    if (ingredients.length > 0) {
      generateRecipes();
    }
  };

  const handleFavoriteToggle = (recipeId: string) => {
    setRecipes(recipes.map(recipe =>
      recipe.id === recipeId
        ? { ...recipe, isFavorite: !recipe.isFavorite }
        : recipe
    ));
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          AI-Powered Recipe Generator
        </h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            What's in your kitchen?
          </h2>
          <IngredientInput onIngredientsChange={handleIngredientsChange} />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Your Preferences
          </h2>
          <UserPreferences onPreferencesChange={handlePreferencesChange} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Recipe Suggestions
          </h2>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Generating recipes...</p>
            </div>
          ) : (
            <RecipeList
              recipes={recipes}
              onFavoriteToggle={handleFavoriteToggle}
            />
          )}
        </section>
      </div>
    </main>
  );
} 