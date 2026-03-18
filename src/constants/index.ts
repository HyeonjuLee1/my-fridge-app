import type { Category, CategoryFilter, CategoryColorStyle, StatusColorStyle } from '../types';

// ─── 카테고리 목록 ────────────────────────────────────────────
export const CATEGORIES: Category[] = ['단백질', '채소', '유제품'];

export const CATEGORY_FILTERS: CategoryFilter[] = ['전체', ...CATEGORIES];

// ─── 카테고리 이모지 ──────────────────────────────────────────
export const CATEGORY_EMOJI: Record<CategoryFilter, string> = {
  전체:   '🧊',
  단백질: '🍗',
  채소:   '🥬',
  유제품: '🥛',
};

// ─── 카테고리 배지 색상 (Tailwind 클래스) ─────────────────────
export const CATEGORY_COLORS: Record<Category, CategoryColorStyle> = {
  단백질: { bgClass: 'bg-orange-50',  textClass: 'text-orange-600' },
  채소:   { bgClass: 'bg-green-50',   textClass: 'text-green-700'  },
  유제품: { bgClass: 'bg-blue-50',    textClass: 'text-blue-700'   },
};

export const DEFAULT_CATEGORY_COLOR: CategoryColorStyle = {
  bgClass: 'bg-gray-100',
  textClass: 'text-gray-700',
};

// ─── 유통기한 상태 색상 (Tailwind 클래스) ────────────────────
export const getDaysColor = (daysLeft: number): StatusColorStyle => {
  if (daysLeft <= 1) return { bgClass: 'bg-danger-100', textClass: 'text-danger-600' };
  if (daysLeft <= 3) return { bgClass: 'bg-accent-100', textClass: 'text-accent-600' };
  return { bgClass: 'bg-primary-100', textClass: 'text-primary-700' };
};

export const getDaysLabel = (daysLeft: number): string => {
  if (daysLeft <= 1) return '오늘 만료';
  return `D-${daysLeft}`;
};

// ─── 식재료 이모지 목록 ───────────────────────────────────────
export const FOOD_EMOJIS = [
  // 채소
  '🥦', '🥕', '🧅', '🍅', '🥬', '🌽', '🍆', '🥒', '🧄', '🥔', '🌶️', '🫑', '🫛',
  // 단백질
  '🥚', '🍗', '🥩', '🐟', '🍤', '🥓', '🦐', '🥜',
  // 유제품
  '🥛', '🧀', '🧈',
  // 과일
  '🍎', '🍋', '🍊', '🍇', '🍓', '🍌',
  // 기타
  '🍞', '🥐', '🍚', '🧂', '🫙', '🥫',
] as const;

// ─── 재료 추가 폼 기본값 ──────────────────────────────────────
export const DEFAULT_NEW_INGREDIENT = {
  name: '',
  emoji: '🥦',
  category: '채소' as Category,
  daysLeft: 5,
  amount: '',
} as const;
