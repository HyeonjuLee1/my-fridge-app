// ─── 카테고리 ────────────────────────────────────────────────
export type Category = '단백질' | '채소' | '유제품';

export type CategoryFilter = Category | '전체';

// ─── 재료 ────────────────────────────────────────────────────
export interface Ingredient {
  id: number;
  name: string;
  emoji: string;
  category: Category;
  daysLeft: number;
  amount: string;
}

/** 재료 추가 폼 (id는 자동 생성) */
export type NewIngredient = Omit<Ingredient, 'id'>;

// ─── 레시피 ──────────────────────────────────────────────────
export interface Recipe {
  id: number;
  name: string;
  emoji: string;
  time: string;
  ingredients: string[]; // 재료 이름 목록 (냉장고와 동적 매칭)
  calories: number;
}

// ─── 장보기 리스트 ────────────────────────────────────────────
export interface SavedRecipeIngredient {
  id: number;
  name: string;
}

/** 찜한 레시피 (장보기 리스트 집계용 스냅샷) */
export interface SavedRecipe {
  id: number;
  title: string;
  missedIngredients: SavedRecipeIngredient[];
}

// ─── UI 스타일 타입 (Tailwind 클래스 문자열) ────────────────
export interface CategoryColorStyle {
  bgClass: string;
  textClass: string;
}

export interface StatusColorStyle {
  bgClass: string;
  textClass: string;
}

// ─── 탭 ─────────────────────────────────────────────────────
export type TabType = 'fridge' | 'recipe';
