import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useShoppingListStore } from '../store/useShoppingListStore';
import { useIngredientStore } from '../store/useIngredientStore';

interface AggregatedItem {
  name: string;
  recipeTitles: string[];
}

export function ShoppingListPage() {
  const savedRecipes = useShoppingListStore((s) => s.savedRecipes);
  const checkedNames = useShoppingListStore((s) => s.checkedNames);
  const toggleChecked = useShoppingListStore((s) => s.toggleChecked);
  const markPurchased = useShoppingListStore((s) => s.markPurchased);
  const addIngredient = useIngredientStore((s) => s.addIngredient);

  const items = useMemo<AggregatedItem[]>(() => {
    const map = new Map<string, AggregatedItem>();
    savedRecipes.forEach((recipe) => {
      recipe.missedIngredients.forEach((ing) => {
        const existing = map.get(ing.name);
        if (existing) {
          existing.recipeTitles.push(recipe.title);
        } else {
          map.set(ing.name, { name: ing.name, recipeTitles: [recipe.title] });
        }
      });
    });
    return Array.from(map.values());
  }, [savedRecipes]);

  const checkedCount = items.filter((item) => checkedNames.includes(item.name)).length;

  const handleAddChecked = () => {
    const checkedItems = items.filter((item) => checkedNames.includes(item.name));
    checkedItems.forEach((item) => {
      addIngredient({
        name: item.name,
        emoji: '🛒',
        category: '채소',
        amount: '1개',
        daysLeft: 5,
      });
    });
    markPurchased(checkedItems.map((item) => item.name));
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-[22px] sm:text-[28px] font-extrabold text-gray-900 m-0 tracking-tight">
          장보기 리스트
        </h1>
        <p className="text-[13px] text-gray-400 mt-1 mb-0">
          {savedRecipes.length > 0
            ? `찜한 레시피 ${savedRecipes.length}개 기준 · 부족한 재료 ${items.length}개`
            : '레시피를 찜하면 부족한 재료를 모아서 보여드려요'}
        </p>
      </div>

      {savedRecipes.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🛒</div>
          <p className="text-sm font-medium mb-5">아직 찜한 레시피가 없어요</p>
          <Link
            to="/recipe"
            className="inline-block px-5 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl no-underline"
          >
            레시피 보러가기
          </Link>
        </div>
      )}

      {savedRecipes.length > 0 && items.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">✅</div>
          <p className="text-sm font-medium">찜한 레시피에 필요한 재료를 모두 갖고 있어요</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="bg-white rounded-2xl p-2 sm:p-3">
          <ul className="flex flex-col">
            {items.map((item) => {
              const checked = checkedNames.includes(item.name);
              return (
                <li
                  key={item.name}
                  className="flex items-center gap-3 px-3 py-3 border-b border-gray-100 last:border-b-0"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleChecked(item.name)}
                    aria-label={`${item.name} 구매 완료`}
                    className="w-4 h-4 shrink-0 accent-gray-900"
                  />
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold ${checked ? 'line-through text-gray-300' : 'text-gray-900'}`}>
                      {item.name}
                    </div>
                    <div className="text-[11px] text-gray-400 truncate">
                      {item.recipeTitles.join(', ')}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {checkedCount > 0 && (
        <div className="sticky bottom-[76px] sm:bottom-4 mt-4 flex justify-center">
          <button
            onClick={handleAddChecked}
            className="px-5 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl border-0 cursor-pointer shadow-lg"
          >
            체크한 {checkedCount}개 냉장고에 추가
          </button>
        </div>
      )}
    </>
  );
}
