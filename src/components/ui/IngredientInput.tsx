'use client';

import React, { useState } from 'react';
import type { Ingredient } from '@/types';
import { Input } from '@/components/ui/shadcn/input';
import { Button } from '@/components/ui/shadcn/button';
import { Card } from '@/components/ui/shadcn/card';
import { X } from 'lucide-react';

interface IngredientInputProps {
  onIngredientsChange: (ingredients: Ingredient[]) => void;
}

interface IngredientWithId extends Ingredient {
  id: string;
}

export function IngredientInput({ onIngredientsChange }: IngredientInputProps) {
  const [ingredients, setIngredients] = useState<IngredientWithId[]>([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');

  const handleAddIngredient = () => {
    if (!name.trim()) return;

    const newIngredient: IngredientWithId = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      quantity: quantity.trim() ? Number(quantity.trim()) : undefined,
      unit: unit.trim() || undefined,
    };

    const updatedIngredients = [...ingredients, newIngredient];
    setIngredients(updatedIngredients);
    onIngredientsChange(updatedIngredients);

    // Reset form
    setName('');
    setQuantity('');
    setUnit('');
  };

  const handleRemoveIngredient = (id: string) => {
    const updatedIngredients = ingredients.filter(ing => ing.id !== id);
    setIngredients(updatedIngredients);
    onIngredientsChange(updatedIngredients);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingredient name"
            className="w-full pixel-input"
          />
        </div>
        <div className="flex gap-4">
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Qty"
            className="w-20 pixel-input"
          />
          <Input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="Unit"
            className="w-24 pixel-input"
          />
          <Button
            onClick={handleAddIngredient}
            className="whitespace-nowrap pixel-button"
          >
            Add
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {ingredients.map((ingredient) => (
          <Card
            key={ingredient.id}
            className="p-4 flex items-center justify-between hover:bg-accent/50 transition-colors pixel-card"
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