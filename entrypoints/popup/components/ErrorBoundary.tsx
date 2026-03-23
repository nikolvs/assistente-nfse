import { Component, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { error: Error | null };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="px-4 py-6 flex flex-col gap-2">
          <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2.5 leading-relaxed">
            Erro inesperado: {this.state.error.message}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
