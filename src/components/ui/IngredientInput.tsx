'use client';

import React, { useState } from 'react';
import type { Ingredient } from '@/types';

interface IngredientInputProps {
  onIngredientsChange: (ingredients: Ingredient[]) => void;
}

export function IngredientInput({ onIngredientsChange }: IngredientInputProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');

  const handleAddIngredient = () => {
    if (!name.trim()) return;

    const newIngredient: Ingredient = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      quantity: quantity.trim(),
      unit: unit.trim(),
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
    <div className="space-y-4">
      <div className="flex gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ingredient name"
          className="flex-1 p-2 border rounded"
        />
        <input
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
          className="w-24 p-2 border rounded"
        />
        <input
          type="text"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="Unit"
          className="w-24 p-2 border rounded"
        />
        <button
          onClick={handleAddIngredient}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded"
          >
            <span>
              {ingredient.quantity} {ingredient.unit} {ingredient.name}
            </span>
            <button
              onClick={() => handleRemoveIngredient(ingredient.id)}
              className="text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 