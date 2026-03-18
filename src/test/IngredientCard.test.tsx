import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IngredientCard } from '../components/IngredientCard';
import type { Ingredient } from '../types';

const mockIngredient: Ingredient = {
  id: 1,
  name: '당근',
  emoji: '🥕',
  category: '채소',
  daysLeft: 5,
  amount: '2개',
};

describe('IngredientCard', () => {
  it('재료 이름, 수량, 카테고리, 유통기한을 렌더링', () => {
    render(<IngredientCard item={mockIngredient} onDelete={vi.fn()} onEdit={vi.fn()} />);

    expect(screen.getByText('당근')).toBeInTheDocument();
    expect(screen.getByText('2개')).toBeInTheDocument();
    expect(screen.getByText('채소')).toBeInTheDocument();
    expect(screen.getByText('D-5')).toBeInTheDocument();
  });

  it('이모지를 렌더링', () => {
    render(<IngredientCard item={mockIngredient} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText('🥕')).toBeInTheDocument();
  });

  it('삭제 버튼 클릭 시 onDelete가 해당 id와 함께 호출됨', async () => {
    const onDelete = vi.fn();
    render(<IngredientCard item={mockIngredient} onDelete={onDelete} onEdit={vi.fn()} />);

    await userEvent.click(screen.getByLabelText('당근 삭제'));

    expect(onDelete).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('수정 버튼 클릭 시 onEdit이 해당 재료 객체와 함께 호출됨', async () => {
    const onEdit = vi.fn();
    render(<IngredientCard item={mockIngredient} onDelete={vi.fn()} onEdit={onEdit} />);

    await userEvent.click(screen.getByLabelText('당근 수정'));

    expect(onEdit).toHaveBeenCalledOnce();
    expect(onEdit).toHaveBeenCalledWith(mockIngredient);
  });

  it('daysLeft가 1이면 "오늘 만료" 표시', () => {
    const expiring = { ...mockIngredient, daysLeft: 1 };
    render(<IngredientCard item={expiring} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText('오늘 만료')).toBeInTheDocument();
  });
});
