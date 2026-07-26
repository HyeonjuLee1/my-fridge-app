import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useShoppingListStore } from '../store/useShoppingListStore';
import type { SpoonacularRecipe } from '../api';

const mockRecipe: SpoonacularRecipe = {
  id: 1,
  title: '김치볶음밥',
  image: 'https://example.com/rice.jpg',
  usedIngredientCount: 1,
  missedIngredientCount: 2,
  usedIngredients: [{ id: 10, name: 'rice', original: 'rice', image: '' }],
  missedIngredients: [
    { id: 20, name: 'kimchi', original: 'kimchi', image: '' },
    { id: 21, name: 'egg', original: 'egg', image: '' },
  ],
};

const mockRecipe2: SpoonacularRecipe = {
  id: 2,
  title: '된장찌개',
  image: 'https://example.com/stew.jpg',
  usedIngredientCount: 0,
  missedIngredientCount: 1,
  usedIngredients: [],
  missedIngredients: [{ id: 20, name: 'kimchi', original: 'kimchi', image: '' }],
};

beforeEach(() => {
  useShoppingListStore.setState({ savedRecipes: [], checkedNames: [] });
});

describe('useShoppingListStore', () => {
  describe('toggleSaveRecipe', () => {
    it('찜하지 않은 레시피를 찜하면 savedRecipes에 추가됨', () => {
      const { result } = renderHook(() => useShoppingListStore());

      act(() => {
        result.current.toggleSaveRecipe(mockRecipe);
      });

      expect(result.current.savedRecipes).toHaveLength(1);
      expect(result.current.savedRecipes[0].title).toBe('김치볶음밥');
      expect(result.current.savedRecipes[0].missedIngredients).toEqual([
        { id: 20, name: 'kimchi' },
        { id: 21, name: 'egg' },
      ]);
    });

    it('이미 찜한 레시피를 다시 토글하면 찜이 취소됨', () => {
      const { result } = renderHook(() => useShoppingListStore());

      act(() => { result.current.toggleSaveRecipe(mockRecipe); });
      act(() => { result.current.toggleSaveRecipe(mockRecipe); });

      expect(result.current.savedRecipes).toHaveLength(0);
    });
  });

  describe('toggleChecked', () => {
    it('재료 이름을 체크하면 checkedNames에 추가됨', () => {
      const { result } = renderHook(() => useShoppingListStore());

      act(() => { result.current.toggleChecked('kimchi'); });

      expect(result.current.checkedNames).toEqual(['kimchi']);
    });

    it('체크된 재료를 다시 토글하면 checkedNames에서 제거됨', () => {
      const { result } = renderHook(() => useShoppingListStore());

      act(() => { result.current.toggleChecked('kimchi'); });
      act(() => { result.current.toggleChecked('kimchi'); });

      expect(result.current.checkedNames).toEqual([]);
    });
  });

  describe('markPurchased', () => {
    it('구매 완료된 재료를 모든 찜한 레시피의 missedIngredients에서 제거함', () => {
      const { result } = renderHook(() => useShoppingListStore());

      act(() => { result.current.toggleSaveRecipe(mockRecipe); });
      act(() => { result.current.toggleSaveRecipe(mockRecipe2); });
      act(() => { result.current.toggleChecked('kimchi'); });

      act(() => { result.current.markPurchased(['kimchi']); });

      const recipe1 = result.current.savedRecipes.find((r) => r.id === 1);
      const recipe2 = result.current.savedRecipes.find((r) => r.id === 2);
      expect(recipe1?.missedIngredients).toEqual([{ id: 21, name: 'egg' }]);
      expect(recipe2?.missedIngredients).toEqual([]);
    });

    it('구매 완료된 재료는 checkedNames에서도 제거됨', () => {
      const { result } = renderHook(() => useShoppingListStore());

      act(() => { result.current.toggleSaveRecipe(mockRecipe); });
      act(() => { result.current.toggleChecked('kimchi'); });
      act(() => { result.current.markPurchased(['kimchi']); });

      expect(result.current.checkedNames).toEqual([]);
    });
  });
});
