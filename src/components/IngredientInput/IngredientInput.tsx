"use client";

import React, { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { COMMON_UNITS, type Ingredient, type Unit } from "@/types";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Card } from "@/components/shadcn/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { X } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { 
  validateIngredientForm, 
  createIngredient, 
  handleIngredientKeyNavigation,
  ingredientFormSchema,
  type IngredientFormData
} from "@/lib/ingredients";

interface IngredientInputProps {
  onRecipeGenerated: (recipe: any) => void;
}

const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  quantity: z.number().min(0.1, "Quantity must be greater than 0"),
  unit: z.enum(["g", "kg", "ml", "l", "tsp", "tbsp", "cup", "oz", "lb", "pinch", "piece", "whole"] as const, {
    required_error: "Unit is required",
  }),
});

type Ingredient = z.infer<typeof ingredientSchema> & { id: number };

const UNITS = ["g", "kg", "ml", "l", "tsp", "tbsp", "cup", "oz", "lb", "pinch", "piece", "whole"] as const;

export function IngredientInput({ onRecipeGenerated }: IngredientInputProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ id: Date.now(), name: "", quantity: 0, unit: "g" }]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const nameInputRef = useRef<HTMLInputElement>(null);
  const quantityInputRef = useRef<HTMLInputElement>(null);
  const unitSelectRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus on the first ingredient's name input
    const firstInput = document.querySelector('input[name="name-0"]') as HTMLInputElement;
    if (firstInput) {
      firstInput.focus();
    }
  }, []); // Empty dependency array means this runs once on mount

  const addIngredient = () => {
    setIngredients([...ingredients, { id: Date.now(), name: "", quantity: 0, unit: "g" }]);
  };

  const updateIngredient = (id: number, field: keyof Ingredient, value: string | number) => {
    setIngredients(ingredients.map(ing => 
      ing.id === id ? { ...ing, [field]: value } : ing
    ));
  };

  const removeIngredient = (id: number) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate all ingredients
      ingredients.forEach((ingredient, index) => {
        ingredientSchema.parse(ingredient);
      });

      const response = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });

      if (!response.ok) throw new Error("Failed to generate recipe");
      const data = await response.json();
      onRecipeGenerated(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Get the first error and focus the field
        const firstError = error.errors[0];
        const fieldName = firstError.path[0];
        const index = ingredients.length - 1;
        
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: `Ingredient ${index + 1}: ${firstError.message}`,
        });

        // Focus the invalid field
        const element = document.querySelector(`[name="${fieldName}-${index}"]`) as HTMLElement;
        if (element) element.focus();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "An error occurred",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" onKeyDown={(e) => {
      if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
        e.preventDefault();
      }
    }}>
      {ingredients.map((ingredient, index) => (
        <div key={ingredient.id} className="flex gap-2 items-start">
          <Input
            name={`name-${index}`}
            placeholder="Ingredient name"
            value={ingredient.name}
            onChange={(e) => updateIngredient(ingredient.id, "name", e.target.value)}
            className="flex-1 bg-white dark:bg-gray-950"
          />
          <Input
            name={`quantity-${index}`}
            type="number"
            placeholder="Qty"
            value={ingredient.quantity}
            onChange={(e) => updateIngredient(ingredient.id, "quantity", parseFloat(e.target.value) || 0)}
            className="w-20 bg-white dark:bg-gray-950"
          />
          <Select
            name={`unit-${index}`}
            value={ingredient.unit}
            onValueChange={(value) => updateIngredient(ingredient.id, "unit", value)}
          >
            <SelectTrigger className="w-32 bg-white dark:bg-gray-950">
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              {UNITS.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {ingredients.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeIngredient(ingredient.id)}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <div className="flex gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={addIngredient} 
          className="border-primary text-primary hover:bg-primary/10 hover:text-primary/90"
        >
          Add Ingredient
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Recipe"}
        </Button>
      </div>
    </form>
  );
}
