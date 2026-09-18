import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
          <div className="text-center max-w-sm">
            <div className="text-3xl mb-3">⚠️</div>
            <h2 className="font-semibold text-slate-900 mb-1">
              Something went wrong
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              The app hit an unexpected error. Refreshing usually fixes it.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
