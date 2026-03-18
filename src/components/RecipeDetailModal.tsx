import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchRecipeDetail } from '../api/recipes';
import type { SpoonacularRecipe } from '../api/recipes';

interface Props {
  recipe: SpoonacularRecipe;
  onClose: () => void;
  onFetchingChange?: (fetching: boolean) => void;
}

export function RecipeDetailModal({ recipe, onClose, onFetchingChange }: Props) {
  const { data: detail, isLoading, isError, isFetching } = useQuery({
    queryKey: ['recipeDetail', recipe.id],
    queryFn: () => fetchRecipeDetail(recipe.id),
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    onFetchingChange?.(isFetching);
    return () => onFetchingChange?.(false);
  }, [isFetching, onFetchingChange]);

  const steps = detail?.analyzedInstructions?.[0]?.steps ?? [];

  // summary에서 HTML 태그 제거
  const plainSummary = detail?.summary?.replace(/<[^>]*>/g, '') ?? '';

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-100 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-[20px] sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 이미지 */}
        <div className="relative w-full h-48 bg-gray-100 shrink-0">
          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover sm:rounded-t-2xl" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center text-sm hover:bg-black/60"
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          {/* 제목 */}
          <h2 className="text-[17px] font-extrabold text-gray-900 mb-3 leading-snug">{recipe.title}</h2>

          {/* 메타 정보 */}
          {detail && (
            <div className="flex gap-3 mb-4 text-xs text-gray-500">
              <span>⏱ {detail.readyInMinutes}분</span>
              <span>🍽 {detail.servings}인분</span>
            </div>
          )}

          {isLoading && (
            <div className="space-y-2 animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
            </div>
          )}

          {isError && (
            <p className="text-sm text-danger-500">상세 정보를 불러오지 못했어요.</p>
          )}

          {detail && (
            <>
              {/* 요약 */}
              {plainSummary && (
                <p className="text-[12px] text-gray-500 leading-relaxed mb-4 line-clamp-3">{plainSummary}</p>
              )}

              {/* 재료 */}
              <div className="mb-4">
                <h3 className="text-[13px] font-bold text-gray-800 mb-2">재료</h3>
                <ul className="flex flex-wrap gap-1.5">
                  {detail.extendedIngredients.map((ing) => (
                    <li
                      key={ing.id}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-600"
                    >
                      {ing.original}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 조리 순서 */}
              {steps.length > 0 && (
                <div>
                  <h3 className="text-[13px] font-bold text-gray-800 mb-2">조리 순서</h3>
                  <ol className="space-y-2.5">
                    {steps.map((s) => (
                      <li key={s.number} className="flex gap-2.5 text-[12px] text-gray-700 leading-relaxed">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                          {s.number}
                        </span>
                        <span>{s.step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
