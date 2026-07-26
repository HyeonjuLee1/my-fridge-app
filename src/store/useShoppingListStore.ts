import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SavedRecipe } from '../types';
import type { SpoonacularRecipe } from '../api';

interface ShoppingListStore {
  savedRecipes: SavedRecipe[];
  checkedNames: string[];
  toggleSaveRecipe: (recipe: SpoonacularRecipe) => void;
  toggleChecked: (name: string) => void;
  /** 체크된 재료를 장보기 리스트에서 제거 (구매 완료 → 냉장고 등록 후 호출) */
  markPurchased: (names: string[]) => void;
}

export const useShoppingListStore = create<ShoppingListStore>()(
  persist(
    (set) => ({
      savedRecipes: [],
      checkedNames: [],

      toggleSaveRecipe: (recipe) =>
        set((state) => {
          const alreadySaved = state.savedRecipes.some((r) => r.id === recipe.id);
          if (alreadySaved) {
            return { savedRecipes: state.savedRecipes.filter((r) => r.id !== recipe.id) };
          }
          return {
            savedRecipes: [
              ...state.savedRecipes,
              {
                id: recipe.id,
                title: recipe.title,
                missedIngredients: recipe.missedIngredients.map((i) => ({ id: i.id, name: i.name })),
              },
            ],
          };
        }),

      toggleChecked: (name) =>
        set((state) => ({
          checkedNames: state.checkedNames.includes(name)
            ? state.checkedNames.filter((n) => n !== name)
            : [...state.checkedNames, name],
        })),

      markPurchased: (names) =>
        set((state) => ({
          savedRecipes: state.savedRecipes.map((r) => ({
            ...r,
            missedIngredients: r.missedIngredients.filter((i) => !names.includes(i.name)),
          })),
          checkedNames: state.checkedNames.filter((n) => !names.includes(n)),
        })),
    }),
    {
      name: 'fridge-shopping-list',
    },
  ),
);
