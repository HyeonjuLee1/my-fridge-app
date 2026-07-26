import { memo, useState } from 'react';
import type { SpoonacularRecipe } from '../api';

interface Props {
  recipe: SpoonacularRecipe;
  onClick: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export const RecipeCard = memo(function RecipeCard({ recipe, onClick, isSaved = false, onToggleSave }: Props) {
  const total = recipe.usedIngredientCount + recipe.missedIngredientCount;
  const hasAll = recipe.missedIngredientCount === 0;
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border-2 cursor-pointer transition-all duration-150 hover:-translate-y-1 hover:shadow-xl ${
        hasAll ? 'border-primary-500' : 'border-transparent'
      }`}
    >
      {/* 레시피 이미지 */}
      <div className="relative w-full h-40 bg-gray-100">
        {imgError || !recipe.image ? (
          <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
        ) : (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
        {onToggleSave && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
            aria-label={isSaved ? `${recipe.title} 찜 취소` : `${recipe.title} 찜하기`}
            aria-pressed={isSaved}
            className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-base transition-colors"
          >
            {isSaved ? '❤️' : '🤍'}
          </button>
        )}
        {/* 보유 현황 배지 */}
        <span
          className={`absolute top-2 right-2 text-[11px] font-bold px-2.5 py-1 rounded-full ${
            hasAll ? 'bg-primary-500 text-white' : 'bg-white/90 text-gray-600'
          }`}
        >
          {hasAll ? '✅ 바로 가능' : `재료 부족`}
        </span>
      </div>

      <div className="p-4">
        {/* 제목 */}
        <div className="font-extrabold text-[14px] sm:text-[15px] text-gray-900 mb-3 leading-snug line-clamp-2">
          {recipe.title}
        </div>

        {/* 보유 재료 */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>
            재료{' '}
            <strong className={hasAll ? 'text-primary-600' : 'text-gray-900'}>
              {recipe.usedIngredientCount}/{total}
            </strong>
            개 보유
          </span>
          {recipe.missedIngredientCount > 0 && (
            <span className="text-danger-500">
              {recipe.missedIngredientCount}개 부족
            </span>
          )}
        </div>

        {/* 재료 태그 (보유 + 부족) */}
        <div className="flex flex-wrap gap-1">
          {recipe.usedIngredients.slice(0, 3).map((ing) => (
            <span
              key={ing.id}
              className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium"
            >
              ✓ {ing.name}
            </span>
          ))}
          {recipe.usedIngredients.length > 3 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 font-medium">
              +{recipe.usedIngredients.length - 3}
            </span>
          )}
          {recipe.missedIngredients.slice(0, 2).map((ing) => (
            <span
              key={ing.id}
              className="text-[10px] px-2 py-0.5 rounded-full bg-danger-50 text-danger-500 font-medium"
            >
              ✗ {ing.name}
            </span>
          ))}
          {recipe.missedIngredients.length > 2 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 font-medium">
              +{recipe.missedIngredients.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});
