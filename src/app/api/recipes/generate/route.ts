import { NextResponse } from 'next/server';
import { generateRecipe } from "@/lib/recipe-generator";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    const recipeData = await generateRecipe(prompt);
    return NextResponse.json(recipeData);
  } catch (error) {
    console.error("Error generating recipe:", error);
    return NextResponse.json({ error: "Failed to generate recipe" }, { status: 500 });
  }
} 