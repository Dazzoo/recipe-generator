import { checkRateLimit } from "@/lib/rate-limiter";
import { generateRecipe } from "@/lib/recipe-generator";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const rateLimitResult = checkRateLimit(request);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: rateLimitResult.error },
      { status: 429 }
    );
  }

  try {
    const { prompt } = await request.json();
    const recipeData = await generateRecipe(prompt);
    return NextResponse.json(recipeData);
  } catch (error) {
    console.error("Error generating recipe:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Failed to generate recipe";
    const status = errorMessage.includes("quota") || errorMessage.includes("rate limit") ? 429 : 500;
    
    return NextResponse.json({ error: errorMessage }, { status });
  }
} 