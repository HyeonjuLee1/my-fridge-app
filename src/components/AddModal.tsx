import { useState } from 'react';
import type { Ingredient, NewIngredient } from '../types';
import { CATEGORIES, DEFAULT_NEW_INGREDIENT } from '../constants';

interface Props {
  onClose: () => void;
  onAdd?: (item: NewIngredient) => void;
  onEdit?: (item: Ingredient) => void;
  initialIngredient?: Ingredient;
}

export function AddModal({ onClose, onAdd, onEdit, initialIngredient }: Props) {
  const isEditMode = !!initialIngredient;
  const [newItem, setNewItem] = useState<NewIngredient>(
    initialIngredient
      ? { name: initialIngredient.name, emoji: initialIngredient.emoji, category: initialIngredient.category, daysLeft: initialIngredient.daysLeft, amount: initialIngredient.amount }
      : { ...DEFAULT_NEW_INGREDIENT }
  );

  const handleAdd = () => {
    if (!newItem.name || !newItem.amount) return;
    if (isEditMode && onEdit && initialIngredient) {
      onEdit({ ...newItem, id: initialIngredient.id });
    } else if (onAdd) {
      onAdd(newItem);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-end justify-center z-[100]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-[20px] p-6 w-full max-w-[480px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold text-gray-900 m-0 mb-5">{isEditMode ? '재료 수정' : '재료 추가'}</h3>
        <div className="flex flex-col gap-3">
          {(
            [
              { label: '이름', key: 'name', placeholder: '예: 양파' },
              { label: '수량', key: 'amount', placeholder: '예: 2개' },
            ] as { label: string; key: keyof NewIngredient; placeholder: string }[]
          ).map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="text-xs text-gray-400 block mb-1">{label}</label>
              <input
                value={newItem[key] as string}
                onChange={(e) => setNewItem((p) => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-[10px] text-sm outline-none"
              />
            </div>
          ))}

          <div>
            <label className="text-xs text-gray-400 block mb-1">카테고리</label>
            <div className="flex gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setNewItem((p) => ({ ...p, category: cat }))}
                  className={`flex-1 py-2 border-0 rounded-lg cursor-pointer text-xs font-semibold ${
                    newItem.category === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">유통기한 (일)</label>
            <input
              type="range"
              min={1}
              max={30}
              value={newItem.daysLeft}
              onChange={(e) =>
                setNewItem((p) => ({ ...p, daysLeft: Number(e.target.value) }))
              }
              className="w-full"
            />
            <div className="text-[13px] text-gray-600 text-center mt-1">
              D-{newItem.daysLeft}
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="w-full py-3.5 bg-gray-900 text-white border-0 rounded-xl text-sm font-bold cursor-pointer mt-1"
          >
            {isEditMode ? '수정하기' : '추가하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
