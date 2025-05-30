'use client';

import React from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { cn, formatTime } from '@/lib/utils';
import type { Recipe } from '@/types';

interface RecipeCardProps {
  recipe: Recipe;
  onFavoriteToggle?: (recipeId: string) => void;
  className?: string;
}

export function RecipeCard({ recipe, onFavoriteToggle, className }: RecipeCardProps) {
  return (
    <div className={cn('bg-white rounded-lg shadow-md overflow-hidden', className)}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">{recipe.title}</h3>
          <button
            onClick={() => onFavoriteToggle?.(recipe.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            {recipe.isFavorite ? (
              <HeartIconSolid className="w-6 h-6 text-red-500" />
            ) : (
              <HeartIcon className="w-6 h-6" />
            )}
          </button>
        </div>

        {recipe.description && (
          <p className="text-gray-600 mb-4">{recipe.description}</p>
        )}

        <div className="flex gap-4 text-sm text-gray-500 mb-4">
          <span>⏱️ {formatTime(recipe.cookingTime)}</span>
          <span>👥 {recipe.servings} servings</span>
          <span>📊 {recipe.difficulty}</span>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Ingredients:</h4>
            <ul className="list-disc list-inside text-gray-600">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Instructions:</h4>
            <ol className="list-decimal list-inside text-gray-600">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="mb-2">{instruction}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 