"use client";

import React, { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/shadcn/button";
import { type Unit } from "@/lib/ingredients";
import { generateRecipePrompt } from "@/lib/recipe-prompt";
import { notifyError } from "@/lib/notifications";
import type { UserPreferences } from "@/types";
import { ingredientSchema } from "@/lib/ingredients/schema";
import IngredientForm from "./IngredientForm";

interface Ingredient {
  id: string;
  name: string;
  quantity?: number;
  unit?: Unit;
}

interface IngredientInputProps {
  onSubmit: (prompt: string) => Promise<void>;
  isLoading: boolean;
  preferences: UserPreferences;
}

export function IngredientInput({ onSubmit, isLoading, preferences }: IngredientInputProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "1", name: "" },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate ingredients in sequence
    for (let i = 0; i < ingredients.length; i++) {
      try {
        ingredientSchema.parse(ingredients[i]);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const firstError = error.errors[0];
          const fieldName = firstError.path[0];
          
          notifyError("Validation Error", firstError.message);

          // Focus the invalid field
          const element = document.querySelector(`[name="${fieldName}-${i}"]`) as HTMLElement;
          if (element) {
            element.focus();
            if (element instanceof HTMLSelectElement) {
              element.click();
            }
          }
          return;
        }
      }
    }

    try {
      const prompt = generateRecipePrompt(ingredients, preferences);
      await onSubmit(prompt);
    } catch (error) {
      console.error(error);
      notifyError("Error", "Failed to generate recipe. Please try again.");
    }
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now().toString(), name: "" },
    ]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string | number | undefined) => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Ingredients</h3>
            <span className="text-sm text-muted-foreground">({ingredients.length})</span>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Button
              type="button"
              variant="outline" 
              onClick={addIngredient} 
              className="border-primary text-primary hover:bg-primary/10 hover:text-primary/90 cursor-pointer"
            >
              Add Ingredient
            </Button>
            <Button type="submit" disabled={isLoading} className="cursor-pointer">
              {isLoading ? "Generating..." : "Generate Recipe"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_80px_128px_40px] gap-2 w-full">
          <div className="text-sm font-medium text-muted-foreground">Ingredient</div>
          <div className="hidden sm:block text-sm font-medium text-muted-foreground">Amount (optional)</div>
          <div className="hidden sm:block text-sm font-medium text-muted-foreground">Unit (optional)</div>
          <div></div>
        </div>

        {ingredients.map((ingredient, index) => (
          <IngredientForm
            key={ingredient.id}
            ingredient={ingredient}
            index={index}
            onUpdate={updateIngredient}
            onRemove={removeIngredient}
            canRemove={ingredients.length > 1}
          />
        ))}
      </div>
    </form>
  );
}
