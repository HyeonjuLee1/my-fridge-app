import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecipePage } from '../pages/RecipePage';
import { useIngredientStore } from '../store/useIngredientStore';
import { useRecipesByIngredients } from '../hooks';
import type { SpoonacularRecipe } from '../api';
import type { Ingredient } from '../types';

vi.mock('../store/useIngredientStore', () => ({
  useIngredientStore: vi.fn(),
}));

vi.mock('../hooks', () => ({
  useRecipesByIngredients: vi.fn(),
}));

// RecipeDetailModal은 별도 API 호출을 하므로 이 테스트 범위에서 격리
vi.mock('../components/RecipeDetailModal', () => ({
  RecipeDetailModal: () => <div data-testid="recipe-detail-modal" />,
}));

const mockUseStore = vi.mocked(useIngredientStore);
const mockUseRecipes = vi.mocked(useRecipesByIngredients);

const mockIngredient: Ingredient = {
  id: 1, name: '계란', emoji: '🥚', category: '단백질', daysLeft: 5, amount: '5개',
};

const mockRecipes: SpoonacularRecipe[] = [
  {
    id: 1,
    title: 'Egg Fried Rice',
    image: 'https://example.com/rice.jpg',
    usedIngredientCount: 2,
    missedIngredientCount: 0,
    usedIngredients: [{ id: 1, name: 'eggs', original: 'eggs', image: '' }],
    missedIngredients: [],
  },
];

// 각 테스트에서 기본값 설정 후 필요한 부분만 override
const defaultRecipesResult = {
  data: undefined,
  isLoading: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
};

describe('RecipePage', () => {
  beforeEach(() => {
    mockUseStore.mockReturnValue({
      ingredients: [mockIngredient],
      addIngredient: vi.fn(),
      deleteIngredient: vi.fn(),
      updateIngredient: vi.fn(),
    });
    mockUseRecipes.mockReturnValue(defaultRecipesResult as ReturnType<typeof useRecipesByIngredients>);
  });

  it('재료가 없으면 재료 추가 안내 메시지를 표시한다', () => {
    mockUseStore.mockReturnValue({
      ingredients: [],
      addIngredient: vi.fn(),
      deleteIngredient: vi.fn(),
      updateIngredient: vi.fn(),
    });

    render(<RecipePage />);

    expect(screen.getByText('냉장고에 재료를 추가하면 레시피를 추천해드려요')).toBeInTheDocument();
  });

  it('로딩 중이면 스켈레톤 6개를 표시한다', () => {
    mockUseRecipes.mockReturnValue({
      ...defaultRecipesResult,
      isLoading: true,
    } as ReturnType<typeof useRecipesByIngredients>);

    render(<RecipePage />);

    expect(document.querySelectorAll('.animate-pulse')).toHaveLength(6);
  });

  it('에러 발생 시 에러 메시지와 "다시 시도" 버튼을 표시한다', () => {
    mockUseRecipes.mockReturnValue({
      ...defaultRecipesResult,
      isError: true,
      error: new Error('네트워크 오류'),
    } as ReturnType<typeof useRecipesByIngredients>);

    render(<RecipePage />);

    expect(screen.getByText('레시피를 불러오지 못했어요')).toBeInTheDocument();
    expect(screen.getByText('네트워크 오류')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument();
  });

  it('"다시 시도" 버튼 클릭 시 refetch가 호출된다', async () => {
    const refetch = vi.fn();
    mockUseRecipes.mockReturnValue({
      ...defaultRecipesResult,
      isError: true,
      error: new Error('오류'),
      refetch,
    } as ReturnType<typeof useRecipesByIngredients>);

    render(<RecipePage />);
    await userEvent.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(refetch).toHaveBeenCalledOnce();
  });

  it('레시피가 없으면 "레시피 없음" 안내 메시지를 표시한다', () => {
    mockUseRecipes.mockReturnValue({
      ...defaultRecipesResult,
      data: [],
    } as ReturnType<typeof useRecipesByIngredients>);

    render(<RecipePage />);

    expect(screen.getByText('현재 재료로 만들 수 있는 레시피가 없어요')).toBeInTheDocument();
  });

  it('레시피 목록을 정상적으로 렌더링한다', () => {
    mockUseRecipes.mockReturnValue({
      ...defaultRecipesResult,
      data: mockRecipes,
    } as ReturnType<typeof useRecipesByIngredients>);

    render(<RecipePage />);

    expect(screen.getByText('Egg Fried Rice')).toBeInTheDocument();
  });
});
