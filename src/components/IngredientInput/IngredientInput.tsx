"use client";

import React, { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { X } from "lucide-react";
import { UNITS, type Unit } from "@/lib/ingredients";
import { generateRecipePrompt } from "@/lib/recipe-prompt";
import type { UserPreferences } from "@/types";
import { useToast } from "@/hooks/useToast";

interface IngredientInputProps {
  onSubmit: (prompt: string) => Promise<void>;
  isLoading: boolean;
  preferences: UserPreferences;
}

export function IngredientInput({ onSubmit, isLoading, preferences }: IngredientInputProps) {
  const [ingredients, setIngredients] = useState<Array<{ id: string; name: string; quantity?: number; unit?: Unit }>>([
    { id: "1", name: "" },
  ]);

  const { toast } = useToast();

  const ingredientSchema = z.object({
    name: z.string()
      .min(3, "Ingredient name must be at least 3 characters")
      .regex(/^[a-zA-Z\s]+$/, "Ingredient name can only contain letters and spaces"),
    quantity: z.number()
      .min(0.01, "Quantity must be greater than 0")
      .max(1000, "Quantity must be less than 1000")
      .optional(),
    unit: z.string()
      .min(1, "Unit is required")
      .optional(),
  });

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
          
          toast({
            variant: "destructive",
            title: "Validation Error",
            description: firstError.message,
          });

          // Focus the invalid field
          const element = document.querySelector(`[name="${fieldName}-${i}"]`) as HTMLElement;
          if (element) {
            element.focus();
            // If it's a select element, we need to click it to open the dropdown
            if (element instanceof HTMLSelectElement) {
              element.click();
            }
          }
          return; // Stop validation at first error
        }
      }
    }

    try {
      const prompt = generateRecipePrompt(ingredients, preferences);
      await onSubmit(prompt);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate recipe. Please try again.",
      });
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

  const updateIngredient = (id: string, field: "name" | "quantity" | "unit", value: string | number | undefined) => {
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
          <div key={ingredient.id} className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_80px_128px_40px] gap-2 w-full">
            <Input
              name={`name-${index}`}
              placeholder="Ingredient name"
              value={ingredient.name}
              onChange={(e) => updateIngredient(ingredient.id, "name", e.target.value)}
              className="bg-white dark:bg-gray-950 w-full"
            />
            <div className="grid grid-cols-[80px_128px_40px] gap-2 sm:contents">
              <Input
                name={`quantity-${index}`}
                type="number"
                placeholder="Qty"
                value={ingredient.quantity ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow numbers with up to 2 decimal places
                  if (value === '') {
                    updateIngredient(ingredient.id, "quantity", undefined);
                  } else if (/^\d+(\.\d{0,2})?$/.test(value)) {
                    updateIngredient(ingredient.id, "quantity", parseFloat(value));
                  }
                }}
                min="0.00"
                step="0.10"
                className="bg-white dark:bg-gray-950 w-full"
              />
              <div className="w-full">
                <Select
                  name={`unit-${index}`}
                  value={ingredient.unit}
                  onValueChange={(value: string) => {
                    if (UNITS.includes(value as Unit)) {
                      updateIngredient(ingredient.id, "unit", value as Unit);
                    }
                  }}
                >
                  <SelectTrigger className="h-10 sm:h-11 bg-white dark:bg-gray-950 w-full text-base sm:text-sm">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-950 [&_[data-state=checked]]:bg-primary [&_[data-state=checked]]:text-white [&_[data-state=checked]]:dark:bg-primary/90 [&_[data-state=checked]]:dark:text-white [&_[data-state=checked]]:hover:bg-primary/90 [&_[data-state=checked]]:dark:hover:bg-primary/80 [&_[data-state=unchecked]]:hover:bg-gray-100 [&_[data-state=unchecked]]:dark:hover:bg-gray-900">
                    {UNITS.map((unit) => (
                      <SelectItem key={unit} value={unit} className="text-sm sm:text-base">
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {ingredients.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeIngredient(ingredient.id)}
                  className="shrink-0 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
