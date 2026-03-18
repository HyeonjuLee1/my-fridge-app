import type { Ingredient } from '../types';
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR, getDaysColor, getDaysLabel } from '../constants';

interface Props {
  item: Ingredient;
  onDelete: (id: number) => void;
  onEdit: (item: Ingredient) => void;
}

export function IngredientCard({ item, onDelete, onEdit }: Props) {
  const catStyle = CATEGORY_COLORS[item.category] ?? DEFAULT_CATEGORY_COLOR;
  const dayStyle = getDaysColor(item.daysLeft);

  return (
    <div className="group relative bg-white rounded-2xl p-3.5 sm:p-5 shadow-sm border border-transparent transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md hover:border-gray-200">
      {/* 수정/삭제 버튼: 모바일은 항상 노출, 데스크톱은 hover 시 노출 */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-150">
        <button
          onClick={() => onEdit(item)}
          className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] bg-gray-100 text-gray-400 hover:bg-blue-100 hover:text-blue-600"
          aria-label={`${item.name} 수정`}
        >
          ✎
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] bg-gray-100 text-gray-400 hover:bg-danger-100 hover:text-danger-600"
          aria-label={`${item.name} 삭제`}
        >
          ✕
        </button>
      </div>

      <div className="text-[28px] sm:text-[36px] mb-2 sm:mb-3">{item.emoji}</div>
      <div className="font-bold text-[13px] sm:text-[15px] text-gray-900 mb-1">{item.name}</div>
      <div className="text-[11px] text-gray-400 mb-2.5">{item.amount}</div>
      <div className="flex items-center justify-between flex-wrap gap-1">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catStyle.bgClass} ${catStyle.textClass}`}>
          {item.category}
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dayStyle.bgClass} ${dayStyle.textClass}`}>
          {getDaysLabel(item.daysLeft)}
        </span>
      </div>
    </div>
  );
}
