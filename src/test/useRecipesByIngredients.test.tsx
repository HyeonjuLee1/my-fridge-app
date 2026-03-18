import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useRecipesByIngredients } from '../hooks/useRecipesByIngredients';
import { fetchRecipesByIngredients } from '../api';
import type { Ingredient } from '../types';
import type { SpoonacularRecipe } from '../api';

// fetchRecipesByIngredients만 mock하고 toEnglishNames는 실제 구현 사용
vi.mock('../api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api')>();
  return { ...actual, fetchRecipesByIngredients: vi.fn() };
});

const mockFetch = vi.mocked(fetchRecipesByIngredients);

// 각 테스트마다 격리된 QueryClient 생성 (캐시 공유 방지)
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const makeIngredient = (name: string): Ingredient => ({
  id: 1, name, emoji: '🥦', category: '채소', daysLeft: 5, amount: '1개',
});

const mockRecipes: SpoonacularRecipe[] = [
  {
    id: 1,
    title: 'Egg Fried Rice',
    image: 'https://example.com/rice.jpg',
    usedIngredientCount: 2,
    missedIngredientCount: 1,
    usedIngredients: [],
    missedIngredients: [],
  },
];

describe('useRecipesByIngredients', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('재료가 없으면 API를 호출하지 않는다', () => {
    const { result } = renderHook(
      () => useRecipesByIngredients([]),
      { wrapper: createWrapper() },
    );

    expect(result.current.fetchStatus).toBe('idle');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('재료가 있으면 API를 호출하고 데이터를 반환한다', async () => {
    mockFetch.mockResolvedValue(mockRecipes);

    const { result } = renderHook(
      () => useRecipesByIngredients([makeIngredient('계란')]),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockRecipes);
    expect(mockFetch).toHaveBeenCalledOnce();
  });

  it('한글 재료명이 영문으로 변환되어 API에 전달된다', async () => {
    mockFetch.mockResolvedValue([]);

    const { result } = renderHook(
      () => useRecipesByIngredients([makeIngredient('계란'), makeIngredient('우유')]),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockFetch).toHaveBeenCalledWith(['eggs', 'milk']);
  });

  it('API 호출 실패 시 isError가 true가 된다', async () => {
    mockFetch.mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(
      () => useRecipesByIngredients([makeIngredient('계란')]),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
