import axios from 'axios';

// 개발: Vite 프록시(/api/spoonacular)를 통해 API Key를 서버 사이드에서 주입
// 프로덕션: 별도의 서버리스 함수 또는 BFF를 통해 동일한 프록시 경로 제공
const BASE_URL = '/api/spoonacular';

// ─── Spoonacular 응답 타입 ────────────────────────────────────
export interface SpoonacularIngredient {
  id: number;
  name: string;
  original: string;
  image: string;
}

export interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  usedIngredients: SpoonacularIngredient[];
  missedIngredients: SpoonacularIngredient[];
}

// ─── API 호출 ─────────────────────────────────────────────────
/**
 * 재료 이름 목록으로 Spoonacular 레시피 검색
 * ⚠️ Spoonacular는 영문 재료명을 사용합니다.
 *    한글 재료명 → 영문 변환이 필요하면 ingredientNameMap을 활용하세요.
 */
export const fetchRecipesByIngredients = async (
  ingredientNames: string[],
): Promise<SpoonacularRecipe[]> => {
  const { data } = await axios.get<SpoonacularRecipe[]>(
    `${BASE_URL}/recipes/findByIngredients`,
    {
      params: {
        ingredients: ingredientNames.join(',+'),
        number: 12,
        ranking: 1,       // 보유 재료 최대 활용 순
        ignorePantry: true,
      },
    },
  );
  return data;
};

// ─── 레시피 상세 타입 ─────────────────────────────────────────
export interface RecipeStep {
  number: number;
  step: string;
}

export interface RecipeDetail {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  extendedIngredients: { id: number; original: string }[];
  analyzedInstructions: { steps: RecipeStep[] }[];
}

export const fetchRecipeDetail = async (id: number): Promise<RecipeDetail> => {
  const { data } = await axios.get<RecipeDetail>(`${BASE_URL}/recipes/${id}/information`);
  return data;
};

// ─── 한글 → 영문 재료명 매핑 ─────────────────────────────────
export const ingredientNameMap: Record<string, string> = {
  계란: 'eggs',
  우유: 'milk',
  당근: 'carrot',
  닭가슴살: 'chicken breast',
  시금치: 'spinach',
  두부: 'tofu',
  토마토: 'tomato',
  버터: 'butter',
  양파: 'onion',
  치즈: 'cheese',
  브로콜리: 'broccoli',
  소고기: 'beef',
};

export const toEnglishNames = (koreanNames: string[]): string[] =>
  koreanNames.map((name) => ingredientNameMap[name] ?? name);
