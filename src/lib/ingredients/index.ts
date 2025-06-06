import { z } from 'zod';
import { Ingredient, Unit } from "@/types";

export const ingredientFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  quantity: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    'Quantity must be greater than 0'
  ),
  unit: z.string().min(1, 'Please select a unit'),
});

export type IngredientFormData = z.infer<typeof ingredientFormSchema>;

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
): Ingredient => {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    quantity: quantity.trim(),
    unit: unit.trim() as Unit,
  };
};

type IngredientRefs = {
  nameInputRef: React.RefObject<HTMLInputElement | null>;
  quantityInputRef: React.RefObject<HTMLInputElement | null>;
  unitSelectRef: React.RefObject<HTMLButtonElement | null>;
};

const handleEnterKey = (
  field: 'name' | 'quantity' | 'unit' | 'add',
  isFormValid: boolean,
  refs: IngredientRefs,
  onAdd: () => void
) => {
  if (isFormValid) {
    onAdd();
    return;
  }
  
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
  }
};

const handleArrowRight = (
  field: 'name' | 'quantity' | 'unit' | 'add',
  isFormValid: boolean,
  refs: IngredientRefs
) => {
  if (field === 'name') {
    refs.quantityInputRef.current?.focus();
  } else if (field === 'quantity') {
    refs.unitSelectRef.current?.focus();
  } else if (field === 'unit' && isFormValid) {
    const addButton = document.querySelector('[data-add-button]') as HTMLButtonElement;
    addButton?.focus();
  }
};

const handleArrowLeft = (
  field: 'name' | 'quantity' | 'unit' | 'add',
  refs: IngredientRefs
) => {
  if (field === 'quantity') {
    refs.nameInputRef.current?.focus();
  } else if (field === 'unit') {
    refs.quantityInputRef.current?.focus();
  } else if (field === 'add') {
    refs.unitSelectRef.current?.focus();
  }
};

export const handleIngredientKeyNavigation = (
  e: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>,
  field: 'name' | 'quantity' | 'unit' | 'add',
  isFormValid: boolean,
  refs: IngredientRefs,
  onAdd: () => void
) => {
  switch (e.key) {
    case 'Enter':
      e.preventDefault();
      handleEnterKey(field, isFormValid, refs, onAdd);
      break;
    case 'ArrowRight':
      e.preventDefault();
      handleArrowRight(field, isFormValid, refs);
      break;
    case 'ArrowLeft':
      e.preventDefault();
      handleArrowLeft(field, refs);
      break;
  }
}; 