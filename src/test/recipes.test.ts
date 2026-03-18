import { describe, it, expect } from 'vitest';
import { toEnglishNames, ingredientNameMap } from '../api/recipes';

describe('toEnglishNames', () => {
  it('한글 재료명을 영문으로 변환', () => {
    expect(toEnglishNames(['계란', '우유'])).toEqual(['eggs', 'milk']);
  });

  it('매핑에 없는 재료는 원본 그대로 반환', () => {
    expect(toEnglishNames(['파프리카'])).toEqual(['파프리카']);
  });

  it('빈 배열이면 빈 배열 반환', () => {
    expect(toEnglishNames([])).toEqual([]);
  });

  it('매핑된 재료와 미매핑 재료가 섞여 있으면 각각 처리', () => {
    expect(toEnglishNames(['닭가슴살', '파프리카', '당근'])).toEqual([
      'chicken breast',
      '파프리카',
      'carrot',
    ]);
  });

  it('ingredientNameMap의 모든 항목이 정상 변환됨', () => {
    const koreanNames = Object.keys(ingredientNameMap);
    const englishNames = Object.values(ingredientNameMap);
    expect(toEnglishNames(koreanNames)).toEqual(englishNames);
  });
});
