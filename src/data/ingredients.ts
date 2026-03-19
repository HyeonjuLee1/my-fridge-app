import type { Ingredient } from '../types';

export const initialIngredients: Ingredient[] = [
  { id: 1,  name: '계란',     emoji: '🥚', category: '단백질', daysLeft: 2,  amount: '6개'   },
  { id: 2,  name: '우유',     emoji: '🥛', category: '유제품', daysLeft: 1,  amount: '500ml' },
  { id: 3,  name: '당근',     emoji: '🥕', category: '채소',   daysLeft: 5,  amount: '2개'   },
  { id: 4,  name: '닭가슴살', emoji: '🍗', category: '단백질', daysLeft: 3,  amount: '300g'  },
  { id: 5,  name: '시금치',   emoji: '🥬', category: '채소',   daysLeft: 1,  amount: '1봉'   },
  { id: 6,  name: '두부',     emoji: '🍱', category: '단백질', daysLeft: 4,  amount: '1모'   },
  { id: 7,  name: '토마토',   emoji: '🍅', category: '채소',   daysLeft: 6,  amount: '3개'   },
  { id: 8,  name: '버터',     emoji: '🧈', category: '유제품', daysLeft: 14, amount: '200g'  },
  { id: 9,  name: '양파',     emoji: '🧅', category: '채소',   daysLeft: 7,  amount: '2개'   },
  { id: 10, name: '치즈',     emoji: '🧀', category: '유제품', daysLeft: 8,  amount: '150g'  },
  { id: 11, name: '브로콜리', emoji: '🥦', category: '채소',   daysLeft: 3,  amount: '1개'   },
  { id: 12, name: '소고기',   emoji: '🥩', category: '단백질', daysLeft: 2,  amount: '200g'  },
];
