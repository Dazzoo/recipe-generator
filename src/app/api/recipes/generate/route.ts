import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { Ingredient, UserPreferences } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { ingredients, preferences } = await req.json();

    const prompt = generatePrompt(ingredients, preferences);
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional chef. Generate a recipe with ingredients, instructions, and cooking time."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const recipe = parseRecipeResponse(response.choices[0].message.content);
    
    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Error generating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipe' },
      { status: 500 }
    );
  }
}

function generatePrompt(ingredients: Ingredient[], preferences?: Partial<UserPreferences>): string {
  let prompt = `Generate a recipe using these ingredients: ${ingredients.map(i => i.name).join(', ')}.`;

  if (preferences) {
    if (preferences.dietaryRestrictions?.length) {
      prompt += `\nDietary restrictions: ${preferences.dietaryRestrictions.join(', ')}.`;
    }
    if (preferences.cookingSkillLevel) {
      prompt += `\nCooking level: ${preferences.cookingSkillLevel}.`;
    }
    if (preferences.cookingTimePreference) {
      prompt += `\nPreferred cooking time: ${preferences.cookingTimePreference}.`;
    }
    if (preferences.servingSize) {
      prompt += `\nServing size: ${preferences.servingSize} people.`;
    }
  }

  prompt += '\n\nPlease provide the recipe in the following format:\n';
  prompt += 'Title: [Recipe Title]\n';
  prompt += 'Description: [Brief description]\n';
  prompt += 'Cooking Time: [Time in minutes]\n';
  prompt += 'Difficulty: [easy/medium/hard]\n';
  prompt += 'Ingredients:\n- [List ingredients]\n';
  prompt += 'Instructions:\n1. [Step 1]\n2. [Step 2]\n...';

  return prompt;
}

function parseRecipeResponse(content: string | null) {
  if (!content) {
    throw new Error('No recipe content received');
  }

  const lines = content.split('\n');
  const recipe: any = {
    title: '',
    description: '',
    cookingTime: 0,
    difficulty: 'medium',
    ingredients: [],
    instructions: [],
  };

  let currentSection = '';

  for (const line of lines) {
    if (line.startsWith('Title:')) {
      recipe.title = line.replace('Title:', '').trim();
    } else if (line.startsWith('Description:')) {
      recipe.description = line.replace('Description:', '').trim();
    } else if (line.startsWith('Cooking Time:')) {
      const time = line.replace('Cooking Time:', '').trim();
      recipe.cookingTime = parseInt(time) || 30;
    } else if (line.startsWith('Difficulty:')) {
      recipe.difficulty = line.replace('Difficulty:', '').trim().toLowerCase();
    } else if (line === 'Ingredients:') {
      currentSection = 'ingredients';
    } else if (line === 'Instructions:') {
      currentSection = 'instructions';
    } else if (line.startsWith('- ') && currentSection === 'ingredients') {
      recipe.ingredients.push(line.replace('- ', '').trim());
    } else if (line.match(/^\d+\./) && currentSection === 'instructions') {
      recipe.instructions.push(line.replace(/^\d+\./, '').trim());
    }
  }

  return recipe;
} 