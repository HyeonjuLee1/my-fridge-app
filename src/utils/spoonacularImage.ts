// Spoonacular 이미지 URL: https://img.spoonacular.com/recipes/{ID}-{SIZE}.{TYPE}
// SIZE: 90x90, 240x150, 312x150, 312x231, 480x360, 556x370, 636x393 중 하나
const SIZE_SUFFIX_PATTERN = /-\d+x\d+(?=\.\w+$)/;
const LARGE_SIZE_SUFFIX = '-636x393';

/**
 * Spoonacular 이미지 URL의 사이즈 접미사를 가장 큰 636x393으로 통일한다.
 * 패턴이 일치하지 않는 URL(다른 도메인 등)은 원본 그대로 반환한다.
 */
export function toLargeSpoonacularImage(url: string): string {
  return url.replace(SIZE_SUFFIX_PATTERN, LARGE_SIZE_SUFFIX);
}
