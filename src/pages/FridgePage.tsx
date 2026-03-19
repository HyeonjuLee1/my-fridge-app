import { useState } from "react";
import type { Ingredient, CategoryFilter } from "../types";
import { CATEGORY_FILTERS, CATEGORY_EMOJI } from "../constants";
import { IngredientCard, CategorySidebar } from "../components";
import { useIngredientStore } from "../store/useIngredientStore";

interface Props {
  onEdit: (item: Ingredient) => void;
}

export function FridgePage({ onEdit }: Props) {
  const { ingredients, deleteIngredient } = useIngredientStore();
  const [filterCat, setFilterCat] = useState<CategoryFilter>("전체");
  const [search, setSearch] = useState("");

  const filtered = ingredients.filter((i) => {
    const matchCat = filterCat === "전체" || i.category === filterCat;
    const matchSearch = i.name.includes(search);
    return matchCat && matchSearch;
  });

  const urgentCount = ingredients.filter((i) => i.daysLeft <= 2).length;

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] sm:text-[28px] font-extrabold text-gray-900 m-0 tracking-tight">
            내 냉장고
          </h1>
          <p className="text-[13px] text-gray-400 mt-1 mb-0">
            총 {ingredients.length}개 재료 보관 중
          </p>
        </div>
        {urgentCount > 0 && (
          <div className="bg-danger-100 text-danger-600 px-3.5 py-2 rounded-[10px] text-xs font-bold">
            ⚠️ 유통기한 임박 {urgentCount}개
          </div>
        )}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="재료 검색..."
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-[10px] text-[13px] bg-white outline-none"
        />
      </div>

      {/* Mobile: horizontal scroll filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 [scrollbar-width:none] sm:hidden">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`shrink-0 px-3.5 py-1.5 border-0 rounded-full cursor-pointer text-xs font-semibold whitespace-nowrap shadow-sm transition-all duration-150 ${
              filterCat === cat
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600"
            }`}>
            {CATEGORY_EMOJI[cat]} {cat}
          </button>
        ))}
      </div>

      {/* Tablet+: sidebar + grid */}
      <div className="flex gap-6 items-start">
        <CategorySidebar
          ingredients={ingredients}
          filterCat={filterCat}
          onFilter={setFilterCat}
        />

        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">🍽️</div>
              <p className="text-sm">해당 재료가 없어요</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5 sm:gap-3.5">
              {filtered.map((item) => (
                <IngredientCard
                  key={item.id}
                  item={item}
                  onDelete={deleteIngredient}
                  onEdit={onEdit}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
