import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { IngredientWithId } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const COMMON_UNITS = [
  { value: 'g', label: 'grams' },
  { value: 'kg', label: 'kilograms' },
  { value: 'ml', label: 'milliliters' },
  { value: 'l', label: 'liters' },
  { value: 'tsp', label: 'teaspoons' },
  { value: 'tbsp', label: 'tablespoons' },
  { value: 'cup', label: 'cups' },
  { value: 'oz', label: 'ounces' },
  { value: 'lb', label: 'pounds' },
  { value: 'pinch', label: 'pinch' },
  { value: 'piece', label: 'piece' },
  { value: 'whole', label: 'whole' },
] as const;

export type Unit = typeof COMMON_UNITS[number]['value'];

export const validateIngredientForm = (
  name: string,
  quantity: string,
  unit: string
): boolean => {
  return Boolean(
    name.trim() &&
    quantity.trim() &&
    unit.trim()
  );
};

export const createIngredient = (
  name: string,
  quantity: string,
  unit: string
): IngredientWithId => {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    quantity: quantity.trim(),
    unit: unit.trim() as Unit,
  };
};

export const handleIngredientKeyNavigation = (
  e: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>,
  field: 'name' | 'quantity' | 'unit' | 'add',
  isFormValid: boolean,
  refs: {
    nameInputRef: React.RefObject<HTMLInputElement | null>;
    quantityInputRef: React.RefObject<HTMLInputElement | null>;
    unitSelectRef: React.RefObject<HTMLButtonElement | null>;
  },
  onAdd: () => void
) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    
    if (field === 'name') {
      if (!refs.nameInputRef.current?.value.trim()) {
        refs.nameInputRef.current?.focus();
        return;
      }
      refs.quantityInputRef.current?.focus();
    } else if (field === 'quantity') {
      if (!refs.quantityInputRef.current?.value.trim()) {
        refs.quantityInputRef.current?.focus();
        return;
      }
      refs.unitSelectRef.current?.focus();
    } else if (field === 'unit') {
      if (!refs.unitSelectRef.current?.value?.trim()) {
        refs.unitSelectRef.current?.focus();
        return;
      }
      if (isFormValid) {
        onAdd();
      }
    } else if (field === 'add' && isFormValid) {
      onAdd();
    }
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    if (field === 'name') {
      refs.quantityInputRef.current?.focus();
    } else if (field === 'quantity') {
      refs.unitSelectRef.current?.focus();
    } else if (field === 'unit') {
      if (isFormValid) {
        const addButton = document.querySelector('[data-add-button]') as HTMLButtonElement;
        addButton?.focus();
      }
    }
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    if (field === 'quantity') {
      refs.nameInputRef.current?.focus();
    } else if (field === 'unit') {
      refs.quantityInputRef.current?.focus();
    } else if (field === 'add') {
      refs.unitSelectRef.current?.focus();
    }
  }
};
