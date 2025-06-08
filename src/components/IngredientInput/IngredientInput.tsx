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
import { useToast } from "@/hooks/useToast";

interface IngredientInputProps {
  onRecipeGenerated: (recipe: any) => void;
}

const ingredientSchema = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters")
    .regex(/^[a-zA-Z\s]+$/, "Ingredient name can only contain letters and spaces"),
  quantity: z.number()
    .min(0.01, "Quantity must be greater than 0")
    .refine((val) => {
      // Check if the number has at most 2 decimal places
      const str = val.toString();
      return /^\d+(\.\d{0,2})?$/.test(str);
    }, "Please enter a valid number with up to 2 decimal places (e.g., 1, 1.5, 2.25)"),
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

      const response = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });

      if (!response.ok) throw new Error("Failed to generate recipe");
      const data = await response.json();
      onRecipeGenerated(data);
    } catch (error) {
      if (!(error instanceof z.ZodError)) {
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
    <form onSubmit={handleSubmit} className="space-y-4 w-full" onKeyDown={(e) => {
      if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
        e.preventDefault();
      }
    }}>
      <div className="grid grid-cols-[minmax(0,1fr)_80px_128px_40px] gap-2 w-full">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Ingredient</label>
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Amount</label>
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Unit</label>
        </div>
        <div></div>
      </div>
      {ingredients.map((ingredient, index) => (
        <div key={ingredient.id} className="grid grid-cols-[minmax(0,1fr)_80px_128px_40px] gap-2 w-full">
          <Input
            name={`name-${index}`}
            placeholder="Ingredient name"
            value={ingredient.name}
            onChange={(e) => updateIngredient(ingredient.id, "name", e.target.value)}
            className="bg-white dark:bg-gray-950 w-full"
          />
          <Input
            name={`quantity-${index}`}
            type="number"
            placeholder="Qty"
            value={ingredient.quantity}
            onChange={(e) => {
              const value = e.target.value;
              // Allow numbers with up to 2 decimal places
              if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
                updateIngredient(ingredient.id, "quantity", value === '' ? 0 : parseFloat(value));
              }
            }}
            min="0.00"
            step="0.10"
            className="bg-white dark:bg-gray-950 w-full"
          />
          <Select
            name={`unit-${index}`}
            value={ingredient.unit}
            onValueChange={(value) => updateIngredient(ingredient.id, "unit", value)}
          >
            <SelectTrigger className="h-10 sm:h-11 bg-white dark:bg-gray-950 w-full">
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
