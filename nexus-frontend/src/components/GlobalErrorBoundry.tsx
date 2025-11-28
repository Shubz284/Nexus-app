// GlobalErrorBoundary.tsx - Handles React component crashes
import React from "react";
import { toast } from "sonner";

interface State {
  hasError: boolean;
  error: Error | null;
}

interface Props {
  children: React.ReactNode;
}

class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("React Error Boundary caught:", error, errorInfo);

    // Show toast notification
    toast.error("Something went wrong. Please try refreshing the page.");

    // Send to monitoring service
    if (process.env.NODE_ENV === "production") {
      // Sentry.captureException(error, { extra: errorInfo });
    }
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="max-w-md p-8 text-center">
            <h1 className="mb-4 text-2xl font-bold text-gray-900">
              Oops! Something went wrong
            </h1>
            <p className="mb-6 text-gray-600">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full rounded-md bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
              >
                Reload Page
              </button>
            </div>

            {/* Show error details in development */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Error Details (Dev Only)
                </summary>
                <pre className="mt-2 max-h-32 overflow-auto rounded bg-gray-100 p-2 text-xs">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
