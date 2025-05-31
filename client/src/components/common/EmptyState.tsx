import React from "react";
import { Github, Users, type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  iconBgColor?: string;
  iconColor?: string;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  actions?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  iconBgColor = "bg-gray-100",
  iconColor = "text-gray-400",
  suggestions = [],
  onSuggestionClick,
  actions,
  className = "",
}) => {
  return (
    <div className={`text-center py-16 ${className}`}>
      {/* Icon Container */}
      <div
        className={`
        mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6
        ${iconBgColor}
      `}
      >
        <Icon className={`w-12 h-12 ${iconColor}`} />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-gray-600 max-w-md mx-auto mb-6">{description}</p>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick?.(suggestion)}
              className="
                px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full 
                text-sm text-gray-700 transition-colors cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-gray-300
              "
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Custom Actions */}
      {actions && <div className="mt-6">{actions}</div>}
    </div>
  );
};

/**
 * Preset cho Initial Search State
 */
export const InitialSearchState: React.FC<{
  onSuggestionClick?: (suggestion: string) => void;
}> = ({ onSuggestionClick }) => {
  const suggestions = [
    'Try "eric-dev-cmd"',
    'Try "octocat"',
    'Try "github"',
    'Try "microsoft"',
    'Try "facebook"',
  ];

  return (
    <EmptyState
      icon={Github}
      title="Search GitHub Users"
      description="Enter a username to find GitHub users and discover their amazing projects."
      iconBgColor="bg-blue-50"
      iconColor="text-blue-500"
      suggestions={suggestions}
      onSuggestionClick={onSuggestionClick}
    />
  );
};

/**
 * Preset cho No Results State
 */
export const NoResultsState: React.FC<{
  searchQuery: string;
  onTryAgain?: () => void;
}> = ({ searchQuery, onTryAgain }) => {
  return (
    <EmptyState
      icon={Users}
      title="No users found"
      description={`We couldn't find any users matching "${searchQuery}". Try a different search term or check the spelling.`}
      iconBgColor="bg-yellow-50"
      iconColor="text-yellow-500"
      actions={
        onTryAgain && (
          <button
            onClick={onTryAgain}
            className="
            px-4 py-2 bg-blue-700 text-white rounded-lg
            hover:bg-blue-800 transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-800 cursor-pointer
          "
          >
            Clear Search
          </button>
        )
      }
    />
  );
};

export default EmptyState;
