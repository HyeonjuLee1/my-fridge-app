import { describe, it, expect } from 'vitest';
import { toLargeSpoonacularImage } from '../utils';

describe('toLargeSpoonacularImage', () => {
  it('556x370 사이즈를 636x393으로 변환', () => {
    expect(toLargeSpoonacularImage('https://img.spoonacular.com/recipes/716429-556x370.jpg')).toBe(
      'https://img.spoonacular.com/recipes/716429-636x393.jpg',
    );
  });

  it('다른 사이즈(312x231)도 636x393으로 변환', () => {
    expect(toLargeSpoonacularImage('https://img.spoonacular.com/recipes/716429-312x231.jpg')).toBe(
      'https://img.spoonacular.com/recipes/716429-636x393.jpg',
    );
  });

  it('가장 작은 사이즈(90x90)도 636x393으로 변환', () => {
    expect(toLargeSpoonacularImage('https://img.spoonacular.com/recipes/716429-90x90.jpg')).toBe(
      'https://img.spoonacular.com/recipes/716429-636x393.jpg',
    );
  });

  it('이미 636x393이면 그대로 유지', () => {
    expect(toLargeSpoonacularImage('https://img.spoonacular.com/recipes/716429-636x393.jpg')).toBe(
      'https://img.spoonacular.com/recipes/716429-636x393.jpg',
    );
  });

  it('사이즈 패턴이 없는 URL은 원본 그대로 반환', () => {
    const url = 'https://example.com/images/dish.png';
    expect(toLargeSpoonacularImage(url)).toBe(url);
  });

  it('빈 문자열은 그대로 반환', () => {
    expect(toLargeSpoonacularImage('')).toBe('');
  });
});
