import type { Ingredient, CategoryFilter } from '../types';
import { CATEGORY_FILTERS, CATEGORY_EMOJI } from '../constants';

interface Props {
  ingredients: Ingredient[];
  filterCat: CategoryFilter;
  onFilter: (cat: CategoryFilter) => void;
}

export function CategorySidebar({ ingredients, filterCat, onFilter }: Props) {
  const stats = [
    { label: '오늘 만료', count: ingredients.filter((i) => i.daysLeft <= 1).length, colorClass: 'text-danger-600'  },
    { label: '2~3일 내', count: ingredients.filter((i) => i.daysLeft > 1 && i.daysLeft <= 3).length, colorClass: 'text-accent-600'  },
    { label: '여유 있음', count: ingredients.filter((i) => i.daysLeft >  3).length, colorClass: 'text-primary-600' },
  ];

  return (
    <div className="hidden sm:flex flex-col w-[180px] lg:w-[220px] shrink-0">
      <p className="text-[11px] font-bold text-gray-400 mb-2.5 uppercase tracking-wider">
        카테고리
      </p>

      <div className="flex flex-col gap-1 mb-5">
        {CATEGORY_FILTERS.map((cat) => {
          const count =
            cat === '전체'
              ? ingredients.length
              : ingredients.filter((i) => i.category === cat).length;
          const isActive = filterCat === cat;
          return (
            <button
              key={cat}
              onClick={() => onFilter(cat)}
              className={`flex items-center justify-between px-3.5 py-2.5 border-0 rounded-[10px] cursor-pointer text-[13px] transition-all duration-150 ${
                isActive ? 'bg-gray-900 text-white font-bold' : 'bg-white text-gray-600 font-medium'
              }`}
            >
              <span>{CATEGORY_EMOJI[cat]} {cat}</span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl p-4">
        <p className="text-[11px] font-bold text-gray-400 mb-3 uppercase tracking-wider">현황</p>
        {stats.map((s) => (
          <div key={s.label} className="flex justify-between items-center mb-2 last:mb-0">
            <span className="text-xs text-gray-500">{s.label}</span>
            <span className={`text-[13px] font-bold ${s.colorClass}`}>{s.count}개</span>
          </div>
        ))}
      </div>
    </div>
  );
}
