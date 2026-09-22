import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="border border-red-500/50 bg-bg-surface p-8 max-w-md w-full text-center">
            <div className="font-mono text-xs text-red-500 mb-3">
              // error_boundary
            </div>
            <h2 className="font-mono text-xl font-bold text-cream mb-4">
              ! something_broke
            </h2>
            <p className="font-mono text-xs text-muted mb-6">
              {this.state.error?.message || "Unknown error"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="font-mono text-xs border border-amber text-amber px-4 py-2 hover:bg-amber hover:text-bg-primary transition-all"
            >
              [ reload_page ]
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
