import { useMemo, useState } from 'react';
import { RecipeCard, RecipeDetailModal } from '../components';
import { useRecipesByIngredients } from '../hooks';
import { useIngredientStore } from '../store/useIngredientStore';
import { useShoppingListStore } from '../store/useShoppingListStore';
import type { SpoonacularRecipe } from '../api/recipes';

function RecipeCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-transparent animate-pulse">
      <div className="w-full h-40 bg-gray-200" />
      <div className="p-4 flex flex-col gap-2.5">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="flex gap-1 mt-1">
          <div className="h-5 w-16 bg-gray-100 rounded-full" />
          <div className="h-5 w-12 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function RecipePage() {
  const { ingredients } = useIngredientStore();
  const { data: recipes, isLoading, isFetching, isError, error, refetch } = useRecipesByIngredients(ingredients);
  const [selectedRecipe, setSelectedRecipe] = useState<SpoonacularRecipe | null>(null);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);

  const savedRecipes = useShoppingListStore((s) => s.savedRecipes);
  const toggleSaveRecipe = useShoppingListStore((s) => s.toggleSaveRecipe);
  const savedIds = useMemo(() => new Set(savedRecipes.map((r) => r.id)), [savedRecipes]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-[22px] sm:text-[28px] font-extrabold text-gray-900 m-0 tracking-tight">
          레시피 추천
        </h1>
        <p className="text-[13px] text-gray-400 mt-1 mb-0">
          냉장고 재료로 만들 수 있는 레시피
        </p>
      </div>

      {/* 재료 없음 */}
      {ingredients.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🧊</div>
          <p className="text-sm font-medium">냉장고에 재료를 추가하면 레시피를 추천해드려요</p>
        </div>
      )}

      {/* 스크린 리더용 상태 알림 */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {isLoading && '레시피를 불러오는 중입니다.'}
        {isError && '레시피를 불러오지 못했습니다.'}
        {!isLoading && !isError && recipes && `레시피 ${recipes.length}개를 불러왔습니다.`}
      </div>

      {/* 로딩 스켈레톤 */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* 에러 */}
      {isError && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-sm font-semibold text-gray-700 mb-1">레시피를 불러오지 못했어요</p>
          <p className="text-xs text-gray-400 mb-5">
            {error instanceof Error ? error.message : '네트워크 오류가 발생했습니다'}
          </p>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="px-5 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetching ? '불러오는 중...' : '다시 시도'}
          </button>
        </div>
      )}

      {/* 결과 없음 */}
      {!isLoading && !isError && recipes?.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🍽️</div>
          <p className="text-sm font-medium">현재 재료로 만들 수 있는 레시피가 없어요</p>
        </div>
      )}

      {/* 레시피 그리드 */}
      {!isLoading && !isError && recipes && recipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3 sm:gap-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => !isFetchingDetail && setSelectedRecipe(recipe)}
              isSaved={savedIds.has(recipe.id)}
              onToggleSave={() => toggleSaveRecipe(recipe)}
            />
          ))}
        </div>
      )}

      {selectedRecipe && (
        <RecipeDetailModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} onFetchingChange={setIsFetchingDetail} />
      )}
    </>
  );
}
