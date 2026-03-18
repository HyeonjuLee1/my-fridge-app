import { useQuery } from '@tanstack/react-query';
import { fetchRecipesByIngredients, toEnglishNames } from '../api';
import type { SpoonacularRecipe } from '../api';
import type { Ingredient } from '../types';

export function useRecipesByIngredients(ingredients: Ingredient[]) {
  const englishNames = toEnglishNames(ingredients.map((i) => i.name));

  return useQuery<SpoonacularRecipe[]>({
    queryKey: ['recipes', 'byIngredients', englishNames],
    queryFn: () => fetchRecipesByIngredients(englishNames),
    enabled: englishNames.length > 0,
    staleTime: 5 * 60 * 1000, // 5분
  });
}
