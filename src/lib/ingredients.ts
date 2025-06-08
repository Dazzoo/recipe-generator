export const UNITS = [
  "g",
  "kg",
  "ml",
  "l",
  "tsp",
  "tbsp",
  "cup",
  "oz",
  "lb",
  "pinch",
  "piece",
  "whole"
] as const;

export type Unit = typeof UNITS[number]; 