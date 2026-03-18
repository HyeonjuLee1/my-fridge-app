import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Ingredient, NewIngredient } from '../types';
import { CATEGORIES, DEFAULT_NEW_INGREDIENT } from '../constants';

// ─── 스키마 ────────────────────────────────────────────────────
const ingredientSchema = z.object({
  name:     z.string().min(1, '이름을 입력해주세요').max(20, '20자 이내로 입력해주세요'),
  amount:   z.string().min(1, '수량을 입력해주세요').max(20, '20자 이내로 입력해주세요'),
  emoji:    z.string(),
  category: z.enum(['단백질', '채소', '유제품']),
  daysLeft: z.number().min(1).max(30),
});

type IngredientFormValues = z.infer<typeof ingredientSchema>;

// ─── Props ─────────────────────────────────────────────────────
interface Props {
  onClose: () => void;
  onAdd?: (item: NewIngredient) => void;
  onEdit?: (item: Ingredient) => void;
  initialIngredient?: Ingredient;
}

export function AddModal({ onClose, onAdd, onEdit, initialIngredient }: Props) {
  const isEditMode = !!initialIngredient;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: initialIngredient
      ? {
          name:     initialIngredient.name,
          amount:   initialIngredient.amount,
          emoji:    initialIngredient.emoji,
          category: initialIngredient.category,
          daysLeft: initialIngredient.daysLeft,
        }
      : { ...DEFAULT_NEW_INGREDIENT },
  });

  const daysLeft = useWatch({ control, name: 'daysLeft' });

  const onSubmit = (data: IngredientFormValues) => {
    if (isEditMode && onEdit && initialIngredient) {
      onEdit({ ...data, id: initialIngredient.id });
    } else if (onAdd) {
      onAdd(data);
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
        <h3 className="text-base font-semibold text-gray-900 m-0 mb-5">
          {isEditMode ? '재료 수정' : '재료 추가'}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">

          {/* 이름 */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">이름</label>
            <input
              {...register('name')}
              placeholder="예: 양파"
              className={`w-full px-3 py-2.5 border rounded-[10px] text-sm outline-none transition-colors ${
                errors.name ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-gray-400'
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* 수량 */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">수량</label>
            <input
              {...register('amount')}
              placeholder="예: 2개"
              className={`w-full px-3 py-2.5 border rounded-[10px] text-sm outline-none transition-colors ${
                errors.amount ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-gray-400'
              }`}
            />
            {errors.amount && (
              <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>
            )}
          </div>

          {/* 카테고리 */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">카테고리</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => field.onChange(cat)}
                      className={`flex-1 py-2 border-0 rounded-lg cursor-pointer text-xs font-semibold ${
                        field.value === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {/* 유통기한 */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">유통기한 (일)</label>
            <Controller
              name="daysLeft"
              control={control}
              render={({ field }) => (
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="w-full"
                />
              )}
            />
            <div className="text-[13px] text-gray-600 text-center mt-1">D-{daysLeft}</div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gray-900 text-white border-0 rounded-xl text-sm font-bold cursor-pointer mt-1"
          >
            {isEditMode ? '수정하기' : '추가하기'}
          </button>

        </form>
      </div>
    </div>
  );
}
