import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from '../components/ErrorBoundary';

// 에러를 throw하는 테스트용 컴포넌트
function BrokenComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('테스트 에러 메시지');
  return <div>정상 컴포넌트</div>;
}

describe('ErrorBoundary', () => {
  // ErrorBoundary가 잡은 에러를 React가 console.error로 출력하는 것을 억제
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('에러가 없으면 children을 렌더링한다', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('정상 컴포넌트')).toBeInTheDocument();
  });

  it('에러 발생 시 fallback UI를 렌더링한다', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('문제가 발생했어요')).toBeInTheDocument();
    expect(screen.getByText('테스트 에러 메시지')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument();
  });

  it('에러 발생 시 children은 렌더링되지 않는다', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.queryByText('정상 컴포넌트')).not.toBeInTheDocument();
  });

  it('custom fallback prop이 있으면 기본 UI 대신 렌더링한다', () => {
    render(
      <ErrorBoundary fallback={<div>커스텀 에러 화면</div>}>
        <BrokenComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('커스텀 에러 화면')).toBeInTheDocument();
    expect(screen.queryByText('문제가 발생했어요')).not.toBeInTheDocument();
  });

  it('"다시 시도" 버튼 클릭 시 에러 상태가 초기화된다', async () => {
    // 클로저 변수로 throw 여부를 제어 — 리셋 전에 false로 바꿔서 재렌더 시 정상 동작하도록 함
    let shouldThrow = true;
    function RecoverableComponent() {
      if (shouldThrow) throw new Error('에러');
      return <div>정상 컴포넌트</div>;
    }

    render(
      <ErrorBoundary>
        <RecoverableComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('문제가 발생했어요')).toBeInTheDocument();

    shouldThrow = false;
    await userEvent.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(screen.getByText('정상 컴포넌트')).toBeInTheDocument();
  });
});
