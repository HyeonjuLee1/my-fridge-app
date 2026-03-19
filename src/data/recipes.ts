import type { Recipe } from '../types';

export const recipes: Recipe[] = [
  {
    id: 1,
    name: '계란 스크램블',
    emoji: '🍳',
    time: '10분',
    ingredients: ['계란', '우유', '버터'],
    calories: 220,
  },
  {
    id: 2,
    name: '닭가슴살 샐러드',
    emoji: '🥗',
    time: '20분',
    ingredients: ['닭가슴살', '시금치', '토마토'],
    calories: 310,
  },
  {
    id: 3,
    name: '채소 볶음',
    emoji: '🥘',
    time: '15분',
    ingredients: ['당근', '브로콜리', '양파', '버터'],
    calories: 180,
  },
  {
    id: 4,
    name: '토마토 수프',
    emoji: '🍲',
    time: '25분',
    ingredients: ['토마토', '양파', '당근', '버터'],
    calories: 150,
  },
  {
    id: 5,
    name: '소고기 덮밥',
    emoji: '🍛',
    time: '30분',
    ingredients: ['소고기', '양파', '당근', '버터'],
    calories: 520,
  },
  {
    id: 6,
    name: '치즈 오믈렛',
    emoji: '🫕',
    time: '12분',
    ingredients: ['계란', '치즈', '버터'],
    calories: 280,
  },
];
