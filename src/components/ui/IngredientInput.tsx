"use client";

import React, { useState, useRef, useEffect } from "react";
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
import { COMMON_UNITS, validateIngredientForm, createIngredient, handleIngredientKeyNavigation } from '@/lib/utils';

interface IngredientInputProps {
  onIngredientsChange: (ingredients: Ingredient[]) => void;
}

export function IngredientInput({ onIngredientsChange }: IngredientInputProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  const nameInputRef = useRef<HTMLInputElement>(null);
  const quantityInputRef = useRef<HTMLInputElement>(null);
  const unitSelectRef = useRef<HTMLButtonElement>(null);

  const isFormValid = validateIngredientForm(name, quantity, unit);

  // Focus name input on component mount
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  useEffect(() => {
    onIngredientsChange(ingredients);
  }, [ingredients, onIngredientsChange]);

  const handleAddIngredient = () => {
    if (!isFormValid) return;

    const newIngredient = createIngredient(name, quantity, unit);
    setIngredients([...ingredients, newIngredient]);
    setName('');
    setQuantity('');
    setUnit('');
    nameInputRef.current?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>,
    field: 'name' | 'quantity' | 'unit' | 'add'
  ) => {
    handleIngredientKeyNavigation(e, field, isFormValid, {
      nameInputRef,
      quantityInputRef,
      unitSelectRef
    }, handleAddIngredient);
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
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
            className="whitespace-nowrap pixel-button disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 hover:text-white focus:bg-primary/90 focus:text-white focus:ring-2 focus:ring-primary/50 transition-all"
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
