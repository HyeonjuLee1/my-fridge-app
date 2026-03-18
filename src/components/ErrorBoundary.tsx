import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center px-6">
          <span className="text-5xl">⚠️</span>
          <h2 className="text-lg font-semibold text-gray-800">문제가 발생했어요</h2>
          <p className="text-sm text-gray-500 max-w-xs">
            {this.state.error?.message ?? '알 수 없는 오류가 발생했습니다.'}
          </p>
          <button
            onClick={this.handleReset}
            className="mt-2 px-5 py-2 rounded-[10px] bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
