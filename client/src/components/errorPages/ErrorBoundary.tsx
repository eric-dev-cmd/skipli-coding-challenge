import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  onGoBack?: () => void;
  onGoHome?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = (): void => {
    if (this.props.onReset) {
      this.props.onReset();
      this.setState({ hasError: false, error: null, errorInfo: null });
    } else {
      window.location.reload();
    }
  };

  handleGoBack = (): void => {
    if (this.props.onGoBack) {
      this.props.onGoBack();
    } else {
      window.history.back();
    }
  };

  handleGoHome = (): void => {
    if (this.props.onGoHome) {
      this.props.onGoHome();
    } else {
      window.location.href = "/";
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
          <div className="w-full max-w-xl p-8 rounded-lg border border-border bg-card shadow-md">
            {/* Error Icon với animation */}
            <div
              className="flex justify-center mb-6 opacity-0"
              style={{ animation: "fadeIn 0.5s forwards" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-orange-500"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            {/* Tiêu đề với animation */}
            <h2
              className="text-2xl font-bold mb-2 text-center opacity-0"
              style={{ animation: "fadeIn 0.5s forwards 0.2s" }}
            >
              Đã xảy ra lỗi
            </h2>

            {/* Thông báo với animation */}
            <p
              className="text-muted-foreground mb-6 text-center opacity-0"
              style={{ animation: "fadeIn 0.5s forwards 0.4s" }}
            >
              Chúng tôi đã gặp phải một lỗi không mong muốn. Bạn có thể thử tải
              lại trang, quay lại trang trước hoặc trở về trang chủ.
            </p>

            {/* Chi tiết lỗi (collapsible) */}
            <details className="mb-6 bg-muted rounded-lg overflow-hidden">
              <summary className="p-3 cursor-pointer font-medium">
                Chi tiết kỹ thuật (dành cho nhà phát triển)
              </summary>
              <div className="p-3 border-t border-border">
                <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-60">
                  {this.state.error?.message}
                  {this.state.error?.stack && "\n\n" + this.state.error.stack}
                </pre>
              </div>
            </details>

            {/* Nút hành động với animation */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 opacity-0"
                style={{ animation: "fadeInUp 0.5s forwards 0.6s" }}
              >
                Tải lại trang
              </button>
              <button
                onClick={this.handleGoBack}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 opacity-0"
                style={{ animation: "fadeInUp 0.5s forwards 0.8s" }}
              >
                Quay lại
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 opacity-0"
                style={{ animation: "fadeInUp 0.5s forwards 1s" }}
              >
                Trang chủ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Định nghĩa keyframes cho animations
const style = document.createElement("style");
style.innerHTML = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

export default ErrorBoundary;
