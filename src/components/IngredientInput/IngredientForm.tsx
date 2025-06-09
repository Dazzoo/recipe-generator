"use client";

import React from "react";
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
import { Ingredient } from "@/lib/recipe-prompt";

interface IngredientFormProps {
    ingredient: Ingredient;
    index: number;
    onUpdate: (id: string, field: keyof Ingredient, value: string | number | undefined) => void;
    onRemove: (id: string) => void;
    canRemove: boolean;
  }
  
  function IngredientForm({ ingredient, index, onUpdate, onRemove, canRemove }: IngredientFormProps) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_80px_128px_40px] gap-2 w-full">
        <Input
          name={`name-${index}`}
          placeholder="Ingredient name"
          value={ingredient.name}
          onChange={(e) => onUpdate(ingredient.id, "name", e.target.value)}
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
              if (value === '') {
                onUpdate(ingredient.id, "quantity", undefined);
              } else if (/^\d+(\.\d{0,2})?$/.test(value)) {
                onUpdate(ingredient.id, "quantity", parseFloat(value));
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
                  onUpdate(ingredient.id, "unit", value as Unit);
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
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(ingredient.id)}
              className="shrink-0 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  export default IngredientForm;