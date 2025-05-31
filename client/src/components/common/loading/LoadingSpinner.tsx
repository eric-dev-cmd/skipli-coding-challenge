// components/common/LoadingSpinner.tsx
import React from "react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "gray";
  fullScreen?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

const colorClasses = {
  primary: "border-blue-600",
  secondary: "border-green-600",
  gray: "border-gray-900 dark:border-gray-200",
};

const containerSizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  size = "md",
  color = "primary",
  fullScreen = false,
  className = "",
}) => {
  const spinnerContent = (
    <div
      className={`flex flex-col items-center justify-center space-y-4 ${className}`}
    >
      {/* Container cho spinner */}
      <div
        className={`
        flex items-center justify-center rounded-full
        bg-gray-100 dark:bg-gray-800
        ${containerSizeClasses[size]}
      `}
      >
        {/* Spinner */}
        <div
          className={`
          animate-spin rounded-full border-t-2 border-b-2
          ${sizeClasses[size]} ${colorClasses[color]}
        `}
        />
      </div>

      {/* Message */}
      {message && (
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      {spinnerContent}
    </div>
  );
};

export const InlineSpinner: React.FC<{
  size?: "xs" | "sm";
  color?: "primary" | "white" | "gray";
  className?: string;
}> = ({ size = "sm", color = "primary", className = "" }) => {
  const inlineSizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
  };

  const inlineColorClasses = {
    primary: "border-blue-600",
    white: "border-white",
    gray: "border-gray-400",
  };

  return (
    <div
      className={`
      animate-spin rounded-full border-t-2 border-b-2
      ${inlineSizeClasses[size]} ${inlineColorClasses[color]} ${className}
    `}
    />
  );
};

export default LoadingSpinner;
