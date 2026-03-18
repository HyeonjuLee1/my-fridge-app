import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddModal } from '../components/AddModal';
import type { Ingredient } from '../types';

describe('AddModal - 추가 모드', () => {
  it('"재료 추가" 타이틀과 "추가하기" 버튼을 렌더링', () => {
    render(<AddModal onClose={vi.fn()} onAdd={vi.fn()} />);

    expect(screen.getByText('재료 추가')).toBeInTheDocument();
    expect(screen.getByText('추가하기')).toBeInTheDocument();
  });

  it('이름과 수량을 입력하고 제출하면 onAdd 호출됨', async () => {
    const onAdd = vi.fn();
    render(<AddModal onClose={vi.fn()} onAdd={onAdd} />);

    await userEvent.type(screen.getByPlaceholderText('예: 양파'), '양파');
    await userEvent.type(screen.getByPlaceholderText('예: 2개'), '1개');
    await userEvent.click(screen.getByText('추가하기'));

    expect(onAdd).toHaveBeenCalledOnce();
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ name: '양파', amount: '1개' }),
    );
  });

  it('이름이 비어 있으면 onAdd 호출 안됨', async () => {
    const onAdd = vi.fn();
    render(<AddModal onClose={vi.fn()} onAdd={onAdd} />);

    await userEvent.type(screen.getByPlaceholderText('예: 2개'), '1개');
    await userEvent.click(screen.getByText('추가하기'));

    expect(onAdd).not.toHaveBeenCalled();
  });

  it('수량이 비어 있으면 onAdd 호출 안됨', async () => {
    const onAdd = vi.fn();
    render(<AddModal onClose={vi.fn()} onAdd={onAdd} />);

    await userEvent.type(screen.getByPlaceholderText('예: 양파'), '양파');
    await userEvent.click(screen.getByText('추가하기'));

    expect(onAdd).not.toHaveBeenCalled();
  });

  it('카테고리 버튼 클릭 시 선택 상태가 변경됨', async () => {
    render(<AddModal onClose={vi.fn()} onAdd={vi.fn()} />);

    const proteinBtn = screen.getByText('단백질');
    await userEvent.click(proteinBtn);

    expect(proteinBtn).toHaveClass('bg-gray-900');
  });

  it('배경 클릭 시 onClose 호출됨', async () => {
    const onClose = vi.fn();
    const { container } = render(<AddModal onClose={onClose} onAdd={vi.fn()} />);

    // 배경(첫번째 div) 클릭
    await userEvent.click(container.firstChild as Element);

    expect(onClose).toHaveBeenCalledOnce();
  });
});

describe('AddModal - 유효성 검사 (Zod)', () => {
  it('이름 미입력 후 제출 시 에러 메시지를 표시한다', async () => {
    render(<AddModal onClose={vi.fn()} onAdd={vi.fn()} />);

    await userEvent.type(screen.getByPlaceholderText('예: 2개'), '1개');
    await userEvent.click(screen.getByText('추가하기'));

    expect(screen.getByText('이름을 입력해주세요')).toBeInTheDocument();
  });

  it('수량 미입력 후 제출 시 에러 메시지를 표시한다', async () => {
    render(<AddModal onClose={vi.fn()} onAdd={vi.fn()} />);

    await userEvent.type(screen.getByPlaceholderText('예: 양파'), '양파');
    await userEvent.click(screen.getByText('추가하기'));

    expect(screen.getByText('수량을 입력해주세요')).toBeInTheDocument();
  });

  it('이름이 20자 초과 시 에러 메시지를 표시한다', async () => {
    render(<AddModal onClose={vi.fn()} onAdd={vi.fn()} />);

    await userEvent.type(screen.getByPlaceholderText('예: 양파'), '가'.repeat(21));
    await userEvent.type(screen.getByPlaceholderText('예: 2개'), '1개');
    await userEvent.click(screen.getByText('추가하기'));

    expect(screen.getByText('20자 이내로 입력해주세요')).toBeInTheDocument();
  });

  it('유효성 통과 시 에러 메시지가 표시되지 않는다', async () => {
    render(<AddModal onClose={vi.fn()} onAdd={vi.fn()} />);

    await userEvent.type(screen.getByPlaceholderText('예: 양파'), '양파');
    await userEvent.type(screen.getByPlaceholderText('예: 2개'), '1개');
    await userEvent.click(screen.getByText('추가하기'));

    expect(screen.queryByText('이름을 입력해주세요')).not.toBeInTheDocument();
    expect(screen.queryByText('수량을 입력해주세요')).not.toBeInTheDocument();
  });
});

describe('AddModal - 수정 모드', () => {
  const existingIngredient: Ingredient = {
    id: 42,
    name: '기존 재료',
    emoji: '🧅',
    category: '채소',
    daysLeft: 7,
    amount: '3개',
  };

  it('"재료 수정" 타이틀과 "수정하기" 버튼을 렌더링', () => {
    render(
      <AddModal onClose={vi.fn()} onEdit={vi.fn()} initialIngredient={existingIngredient} />,
    );

    expect(screen.getByText('재료 수정')).toBeInTheDocument();
    expect(screen.getByText('수정하기')).toBeInTheDocument();
  });

  it('폼이 기존 재료 정보로 초기화됨', () => {
    render(
      <AddModal onClose={vi.fn()} onEdit={vi.fn()} initialIngredient={existingIngredient} />,
    );

    expect(screen.getByDisplayValue('기존 재료')).toBeInTheDocument();
    expect(screen.getByDisplayValue('3개')).toBeInTheDocument();
  });

  it('수정 후 제출하면 onEdit이 기존 id를 유지한 채 호출됨', async () => {
    const onEdit = vi.fn();
    render(
      <AddModal onClose={vi.fn()} onEdit={onEdit} initialIngredient={existingIngredient} />,
    );

    const nameInput = screen.getByDisplayValue('기존 재료');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, '수정된 재료');
    await userEvent.click(screen.getByText('수정하기'));

    expect(onEdit).toHaveBeenCalledOnce();
    expect(onEdit).toHaveBeenCalledWith(
      expect.objectContaining({ id: 42, name: '수정된 재료' }),
    );
  });
});
