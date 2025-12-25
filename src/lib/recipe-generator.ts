import { GoogleGenerativeAI } from "@google/generative-ai";
import type { RecipeResponse } from "./recipe-prompt";
import { validateRecipeResponse } from "./recipe-prompt";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function generateRecipe(prompt: string): Promise<RecipeResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash-lite" });

    console.log("prompt", prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();

    const recipeData = JSON.parse(cleanedText);
    
    return validateRecipeResponse(recipeData);
  } catch (error: unknown) {
    console.error("Error generating recipe:", error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStatus = (error as { status?: number })?.status;
    
    if (errorStatus === 429 || errorMessage.includes("quota")) {
      throw new Error("API quota exceeded. Please check your Google AI API key and billing plan.");
    }
    
    throw new Error(errorMessage || "Failed to generate recipe. Please try again.");
  }
}   