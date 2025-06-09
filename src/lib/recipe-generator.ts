import { GoogleGenerativeAI } from "@google/generative-ai";
import type { RecipeResponse } from "./recipe-prompt";
import { validateRecipeResponse } from "./recipe-prompt";
import { env } from "./env/env";

const genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY);

export async function generateRecipe(prompt: string): Promise<RecipeResponse> {
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    console.log("prompt", prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const recipeData = JSON.parse(text);
    
    // Validate the response
    return validateRecipeResponse(recipeData);
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw new Error("Failed to generate recipe. Please try again.");
  }
}   