import type { RecipeResponse } from "@/lib/recipe-prompt";

interface RecipeCardProps {
  recipe: RecipeResponse;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">{recipe.title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{recipe.description}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Prep Time</div>
          <div className="font-medium">{recipe.prepTime} mins</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Cook Time</div>
          <div className="font-medium">{recipe.cookTime} mins</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Time</div>
          <div className="font-medium">{recipe.totalTime} mins</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Servings</div>
          <div className="font-medium">{recipe.servings}</div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-3">Ingredients</h4>
        <ul className="space-y-2">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">
                {ingredient.amount} {ingredient.unit} {ingredient.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-3">Instructions</h4>
        <ol className="space-y-4">
          {recipe.instructions.map((instruction) => (
            <li key={instruction.step} className="flex gap-3">
              <span className="font-medium text-primary">{instruction.step}.</span>
              <span>{instruction.description}</span>
            </li>
          ))}
        </ol>
      </div>

      {recipe.tips.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-3">Tips</h4>
          <ul className="space-y-2">
            {recipe.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h4 className="text-lg font-semibold mb-3">Nutritional Information</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400">Calories</div>
            <div className="font-medium">{recipe.nutritionalInfo.calories} kcal</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400">Protein</div>
            <div className="font-medium">{recipe.nutritionalInfo.protein}g</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400">Carbs</div>
            <div className="font-medium">{recipe.nutritionalInfo.carbs}g</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400">Fat</div>
            <div className="font-medium">{recipe.nutritionalInfo.fat}g</div>
          </div>
        </div>
      </div>
    </div>
  );
} 