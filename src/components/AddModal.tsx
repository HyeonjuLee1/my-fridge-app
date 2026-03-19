import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Ingredient, NewIngredient } from '../types';
import { CATEGORIES, DEFAULT_NEW_INGREDIENT, FOOD_EMOJIS } from '../constants';
import { useFocusTrap } from '../hooks';

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
  const selectedEmoji = useWatch({ control, name: 'emoji' });
  const trapRef = useFocusTrap();

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
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] px-4"
      onClick={onClose}
    >
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white rounded-[20px] p-6 w-full max-w-[480px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 id="modal-title" className="text-base font-semibold text-gray-900 m-0">
            {isEditMode ? '재료 수정' : '재료 추가'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

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

          {/* 이모지 */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">이모지</label>
            <Controller
              name="emoji"
              control={control}
              render={({ field }) => (
                <div>
                  {/* 선택된 이모지 미리보기 */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl w-12 h-12 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
                      {selectedEmoji}
                    </span>
                    <span className="text-xs text-gray-400">아래에서 선택하세요</span>
                  </div>
                  {/* 이모지 그리드 */}
                  <div className="grid grid-cols-9 gap-1 p-2 bg-gray-50 rounded-xl max-h-32 overflow-y-auto">
                    {FOOD_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => field.onChange(emoji)}
                        className={`text-xl w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                          field.value === emoji
                            ? 'bg-gray-900 shadow-sm scale-110'
                            : 'hover:bg-gray-200'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            />
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
