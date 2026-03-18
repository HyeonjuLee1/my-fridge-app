import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useIngredientStore } from '../store/useIngredientStore';
import type { NewIngredient } from '../types';

const mockIngredient: NewIngredient = {
  name: '테스트 재료',
  emoji: '🥕',
  category: '채소',
  daysLeft: 5,
  amount: '1개',
};

// 각 테스트마다 store 초기화 + fake timer로 Date.now() ID 충돌 방지
beforeEach(() => {
  vi.useFakeTimers();
  useIngredientStore.setState({ ingredients: [] });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useIngredientStore', () => {
  describe('addIngredient', () => {
    it('재료를 추가하면 ingredients 배열에 추가됨', () => {
      const { result } = renderHook(() => useIngredientStore());

      act(() => {
        result.current.addIngredient(mockIngredient);
      });

      expect(result.current.ingredients).toHaveLength(1);
      expect(result.current.ingredients[0].name).toBe('테스트 재료');
      expect(result.current.ingredients[0].emoji).toBe('🥕');
    });

    it('추가된 재료에 고유한 id가 자동 부여됨', () => {
      const { result } = renderHook(() => useIngredientStore());

      act(() => { result.current.addIngredient(mockIngredient); });
      vi.advanceTimersByTime(1);
      act(() => { result.current.addIngredient({ ...mockIngredient, name: '두번째 재료' }); });

      const [first, second] = result.current.ingredients;
      expect(first.id).toBeDefined();
      expect(second.id).toBeDefined();
      expect(first.id).not.toBe(second.id);
    });

    it('여러 재료를 순서대로 추가 가능', () => {
      const { result } = renderHook(() => useIngredientStore());

      act(() => { result.current.addIngredient({ ...mockIngredient, name: '양파' }); });
      vi.advanceTimersByTime(1);
      act(() => { result.current.addIngredient({ ...mockIngredient, name: '당근' }); });
      vi.advanceTimersByTime(1);
      act(() => { result.current.addIngredient({ ...mockIngredient, name: '브로콜리' }); });

      expect(result.current.ingredients).toHaveLength(3);
      expect(result.current.ingredients.map((i) => i.name)).toEqual(['양파', '당근', '브로콜리']);
    });
  });

  describe('deleteIngredient', () => {
    it('id로 재료를 삭제', () => {
      const { result } = renderHook(() => useIngredientStore());

      act(() => {
        result.current.addIngredient(mockIngredient);
      });

      const id = result.current.ingredients[0].id;

      act(() => {
        result.current.deleteIngredient(id);
      });

      expect(result.current.ingredients).toHaveLength(0);
    });

    it('존재하지 않는 id로 삭제해도 에러 없음', () => {
      const { result } = renderHook(() => useIngredientStore());

      act(() => {
        result.current.addIngredient(mockIngredient);
      });

      act(() => {
        result.current.deleteIngredient(99999);
      });

      expect(result.current.ingredients).toHaveLength(1);
    });

    it('여러 재료 중 특정 재료만 삭제', () => {
      const { result } = renderHook(() => useIngredientStore());

      act(() => { result.current.addIngredient({ ...mockIngredient, name: '양파' }); });
      vi.advanceTimersByTime(1);
      act(() => { result.current.addIngredient({ ...mockIngredient, name: '당근' }); });

      const targetId = result.current.ingredients[0].id;

      act(() => {
        result.current.deleteIngredient(targetId);
      });

      expect(result.current.ingredients).toHaveLength(1);
      expect(result.current.ingredients[0].name).toBe('당근');
    });
  });

  describe('updateIngredient', () => {
    it('재료 정보를 업데이트', () => {
      const { result } = renderHook(() => useIngredientStore());

      act(() => {
        result.current.addIngredient(mockIngredient);
      });

      const target = result.current.ingredients[0];

      act(() => {
        result.current.updateIngredient({ ...target, name: '수정된 재료', amount: '3개' });
      });

      expect(result.current.ingredients[0].name).toBe('수정된 재료');
      expect(result.current.ingredients[0].amount).toBe('3개');
    });

    it('업데이트 후 배열 길이는 동일', () => {
      const { result } = renderHook(() => useIngredientStore());

      act(() => { result.current.addIngredient(mockIngredient); });
      vi.advanceTimersByTime(1);
      act(() => { result.current.addIngredient({ ...mockIngredient, name: '두번째' }); });

      const target = result.current.ingredients[0];

      act(() => {
        result.current.updateIngredient({ ...target, name: '수정됨' });
      });

      expect(result.current.ingredients).toHaveLength(2);
    });
  });
});
