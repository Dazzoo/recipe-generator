export function extractJsonFromText(text: string): string {
  let cleaned = text.trim();

  const jsonBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonBlockMatch) {
    cleaned = jsonBlockMatch[1].trim();
  }

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

export function fixCommonJsonIssues(jsonString: string): string {
  let fixed = jsonString;

  fixed = fixed.replace(/,\s*}/g, '}');
  fixed = fixed.replace(/,\s*]/g, ']');
  
  fixed = fixed.replace(/([{,]\s*)(\w+):/g, '$1"$2":');
  
  fixed = fixed.replace(/:\s*'([^']*)'/g, ': "$1"');
  
  fixed = fixed.replace(/\n\s*\n/g, '\n');
  
  fixed = fixed.replace(/\/\*[\s\S]*?\*\//g, '');
  fixed = fixed.replace(/\/\/.*$/gm, '');

  return fixed;
}

export function parseJsonSafely(text: string, maxRetries = 2): unknown {
  let cleaned = extractJsonFromText(text);
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return JSON.parse(cleaned);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxRetries) {
        cleaned = fixCommonJsonIssues(cleaned);
      }
    }
  }

  throw new Error(
    `Failed to parse JSON after ${maxRetries + 1} attempts. ${lastError?.message || 'Unknown error'}. Original text length: ${text.length}`
  );
}

