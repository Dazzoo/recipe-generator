import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseJsonSafely } from "./json-parser";
import type { RecipeResponse } from "./recipe-prompt";
import { validateRecipeResponse } from "./recipe-prompt";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const MAX_RETRIES = 2;

export async function generateRecipe(prompt: string): Promise<RecipeResponse> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash-lite" });

      if (attempt === 0) {
        console.log("prompt", prompt);
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const recipeData = parseJsonSafely(text) as RecipeResponse;
      
      return validateRecipeResponse(recipeData);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStatus = (error as { status?: number })?.status;
      
      if (errorStatus === 429 || errorMessage.includes("quota")) {
        throw new Error("API quota exceeded. Please check your Google AI API key and billing plan.");
      }
      
      if (errorMessage.includes("Failed to parse JSON")) {
        if (attempt < MAX_RETRIES) {
          console.warn(`JSON parsing failed (attempt ${attempt + 1}/${MAX_RETRIES + 1}), retrying...`);
          continue;
        }
      }
      
      if (attempt === MAX_RETRIES) {
        console.error("Error generating recipe after retries:", error);
        throw new Error("Failed to generate valid recipe. The AI response could not be parsed. Please try again.");
      }
    }
  }
  
  throw new Error("Failed to generate recipe. Please try again.");
}   