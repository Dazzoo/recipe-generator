import * as dotenv from 'dotenv';

dotenv.config();

interface ModelInfo {
  name: string;
  displayName?: string;
  description?: string;
  supportedGenerationMethods?: string[];
}

interface ModelsResponse {
  models?: ModelInfo[];
}

export async function listAvailableModels() {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY is not set");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to list models: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const data = await response.json() as ModelsResponse;
    
    console.log("\n=== Available Models ===");
    if (data.models && Array.isArray(data.models)) {
      const generateContentModels = data.models.filter((model: ModelInfo) => 
        model.supportedGenerationMethods?.includes("generateContent")
      );
      
      console.log(`\nTotal models: ${data.models.length}`);
      console.log(`Models supporting generateContent: ${generateContentModels.length}\n`);
      
      generateContentModels.forEach((model: ModelInfo) => {
        console.log(`- ${model.name}`);
        console.log(`  Display Name: ${model.displayName || "N/A"}`);
        console.log(`  Description: ${model.description || "N/A"}`);
        console.log(`  Supported Methods: ${model.supportedGenerationMethods?.join(", ") || "N/A"}`);
        console.log("");
      });
      
      return generateContentModels;
    } else {
      console.log("No models found in response:", data);
      return [];
    }
  } catch (error) {
    console.error("Error listing models:", error);
    throw error;
  }
}

listAvailableModels()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

