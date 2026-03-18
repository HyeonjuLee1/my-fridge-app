import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Ingredient, NewIngredient } from '../types';
import { initialIngredients } from '../data/ingredients';

interface IngredientStore {
  ingredients: Ingredient[];
  addIngredient: (item: NewIngredient) => void;
  deleteIngredient: (id: number) => void;
  updateIngredient: (item: Ingredient) => void;
}

export const useIngredientStore = create<IngredientStore>()(
  persist(
    (set) => ({
      ingredients: initialIngredients,

      addIngredient: (item) =>
        set((state) => ({
          ingredients: [...state.ingredients, { ...item, id: Date.now() }],
        })),

      deleteIngredient: (id) =>
        set((state) => ({
          ingredients: state.ingredients.filter((i) => i.id !== id),
        })),

      updateIngredient: (item) =>
        set((state) => ({
          ingredients: state.ingredients.map((i) => (i.id === item.id ? item : i)),
        })),
    }),
    {
      name: 'fridge-ingredients', // localStorage key
    },
  ),
);
