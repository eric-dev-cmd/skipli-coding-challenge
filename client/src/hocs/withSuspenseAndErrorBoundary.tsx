import ErrorBoundary from "@/components/errorPages/ErrorBoundary";
import LoadingFallback from "@/components/common/loading/LoadingFallback";
import React, { Suspense } from "react";

interface WithSuspenseAndErrorBoundaryOptions {
  errorFallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
  onReset?: () => void;
  onGoBack?: () => void;
  onGoHome?: () => void;
}

/**
 * Higher Order Component that combines Suspense and ErrorBoundary
 * Perfect for wrapping lazy-loaded components
 *
 * @param Component - The component to wrap (typically a lazy-loaded component)
 * @param options - Optional configuration
 */
const withSuspenseAndErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  options: WithSuspenseAndErrorBoundaryOptions = {}
): React.ComponentType<P> => {
  const {
    errorFallback,
    loadingFallback = <LoadingFallback />,
    onReset,
    onGoBack,
    onGoHome,
  } = options;

  const WithSuspenseAndErrorBoundary = (props: P) => {
    return (
      <ErrorBoundary
        fallback={errorFallback}
        onReset={onReset}
        onGoBack={onGoBack}
        onGoHome={onGoHome}
      >
        <Suspense fallback={loadingFallback}>
          <Component {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };

  // Set display name for debugging
  const displayName = Component.displayName || Component.name || "Component";
  WithSuspenseAndErrorBoundary.displayName = `withSuspenseAndErrorBoundary(${displayName})`;

  return WithSuspenseAndErrorBoundary;
};

export default withSuspenseAndErrorBoundary;
