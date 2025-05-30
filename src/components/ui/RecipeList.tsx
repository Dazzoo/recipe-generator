'use client';

import React from 'react';
import type { Recipe } from '@/types';

interface RecipeListProps {
  recipes: Recipe[];
  onFavoriteToggle?: (recipeId: string) => void;
}

export function RecipeList({ recipes, onFavoriteToggle }: RecipeListProps) {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-8 bg-red-500">
        No recipes found. Add some ingredients to get started!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
              {onFavoriteToggle && (
                <button
                  onClick={() => onFavoriteToggle(recipe.id)}
                  className={`text-2xl ${
                    recipe.isFavorite ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              )}
            </div>
            <p className="text-gray-600 mb-4">{recipe.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Cooking Time</span>
                <p>{recipe.cookingTime}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Difficulty</span>
                <p className="capitalize">{recipe.difficulty}</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">Ingredients</h4>
              <ul className="list-disc list-inside space-y-1">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.quantity} {ingredient.unit} {ingredient.name}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Instructions</h4>
              <ol className="list-decimal list-inside space-y-2">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 