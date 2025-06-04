"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import type { Ingredient } from "@/types";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import { Card } from "@/components/ui/shadcn/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { X } from "lucide-react";

interface IngredientInputProps {
  onIngredientsChange: (ingredients: Ingredient[]) => void;
}

interface IngredientWithId extends Ingredient {
  id: string;
}

const COMMON_UNITS = [
  { value: "g", label: "grams (g)" },
  { value: "kg", label: "kilograms (kg)" },
  { value: "ml", label: "milliliters (ml)" },
  { value: "l", label: "liters (l)" },
  { value: "tsp", label: "teaspoon (tsp)" },
  { value: "tbsp", label: "tablespoon (tbsp)" },
  { value: "oz", label: "ounces (oz)" },
  { value: "lb", label: "pounds (lb)" },
  { value: "cup", label: "cup" },
  { value: "piece", label: "piece" },
  { value: "pinch", label: "pinch" },
  { value: "slice", label: "slice" },
  { value: "whole", label: "whole" },
  { value: "clove", label: "clove" },
  { value: "bunch", label: "bunch" },
  { value: "sprig", label: "sprig" },
  { value: "can", label: "can" },
  { value: "jar", label: "jar" },
  { value: "pack", label: "pack" },
  { value: "to taste", label: "to taste" },
];

export function IngredientInput({ onIngredientsChange }: IngredientInputProps) {
  const [ingredients, setIngredients] = useState<IngredientWithId[]>([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  const nameInputRef = useRef<HTMLInputElement>(null);
  const quantityInputRef = useRef<HTMLInputElement>(null);
  const unitSelectRef = useRef<HTMLButtonElement>(null);

  const isFormValid = useMemo(() => {
    return name.trim() && quantity.trim() && unit.trim();
  }, [name, quantity, unit]);

  // Focus name input on component mount
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const focusEmptyField = () => {
    if (!name.trim()) {
      nameInputRef.current?.focus();
      return true;
    }
    if (!quantity.trim()) {
      quantityInputRef.current?.focus();
      return true;
    }
    if (!unit.trim()) {
      unitSelectRef.current?.focus();
      return true;
    }
    return false;
  };

  const handleAddIngredient = () => {
    if (focusEmptyField()) return;

    const newIngredient: IngredientWithId = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      quantity: Number(quantity.trim()),
      unit: unit.trim(),
    };

    const updatedIngredients = [...ingredients, newIngredient];
    setIngredients(updatedIngredients);
    onIngredientsChange(updatedIngredients);

    // Reset form
    setName("");
    setQuantity("");
    setUnit("");
    nameInputRef.current?.focus();
  };

  const handleRemoveIngredient = (id: string) => {
    const updatedIngredients = ingredients.filter((ing) => ing.id !== id);
    setIngredients(updatedIngredients);
    onIngredientsChange(updatedIngredients);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>,
    field: 'name' | 'quantity' | 'unit' | 'add'
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (field === 'name') {
        if (!name.trim()) {
          nameInputRef.current?.focus();
          return;
        }
        quantityInputRef.current?.focus();
      } else if (field === 'quantity') {
        if (!quantity.trim()) {
          quantityInputRef.current?.focus();
          return;
        }
        unitSelectRef.current?.focus();
      } else if (field === 'unit') {
        if (!unit.trim()) {
          unitSelectRef.current?.focus();
          return;
        }
        if (isFormValid) {
          handleAddIngredient();
        }
      } else if (field === 'add' && isFormValid) {
        handleAddIngredient();
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (field === 'name') {
        quantityInputRef.current?.focus();
      } else if (field === 'quantity') {
        unitSelectRef.current?.focus();
      } else if (field === 'unit') {
        if (isFormValid) {
          const addButton = document.querySelector('[data-add-button]') as HTMLButtonElement;
          addButton?.focus();
        }
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (field === 'quantity') {
        nameInputRef.current?.focus();
      } else if (field === 'unit') {
        quantityInputRef.current?.focus();
      } else if (field === 'add') {
        unitSelectRef.current?.focus();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            ref={nameInputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'name')}
            placeholder="Ingredient name"
            className="w-full pixel-input"
          />
        </div>
        <div className="flex gap-4">
          <Input
            ref={quantityInputRef}
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'quantity')}
            placeholder="Qty"
            className="w-20 pixel-input"
          />
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger 
              ref={unitSelectRef} 
              className="w-32 pixel-select"
              onKeyDown={(e) => handleKeyDown(e, 'unit')}
            >
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent className="pixel-card">
              {COMMON_UNITS.map((unit) => (
                <SelectItem 
                  key={unit.value} 
                  value={unit.value}
                  className="pixel-text"
                >
                  {unit.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAddIngredient}
            disabled={!isFormValid}
            className="whitespace-nowrap pixel-button disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 focus:bg-primary/90 focus:ring-2 focus:ring-primary/50 transition-colors"
            onKeyDown={(e) => handleKeyDown(e, 'add')}
            data-add-button
          >
            Add
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {ingredients.map((ingredient) => (
          <Card
            key={ingredient.id}
            className="p-4 flex-row items-center justify-between hover:bg-accent/50 transition-colors pixel-card"
          >
            <span className="text-sm pixel-text">
              {ingredient.quantity} {ingredient.unit} {ingredient.name}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveIngredient(ingredient.id)}
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 pixel-button"
            >
              <X className="h-4 w-4" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
