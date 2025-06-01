// components/search/SearchBar.tsx
import React, { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { InlineSpinner } from "../loading/LoadingSpinner";

interface SearchBarProps {
  value: string;

  onChange: (value: string) => void;

  placeholder?: string;

  isLoading?: boolean;
  autoFocus?: boolean;
  id?: string;
  className?: string;
  onEnter?: (value: string) => void;
  onClear?: () => void;
  disabled?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  isLoading = false,
  autoFocus = false,
  id = "search-input",
  className = "",
  onEnter,
  onClear,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus effect
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onEnter) {
      onEnter(value);
    }
  };

  // Handle clear button click
  const handleClear = () => {
    onChange("");
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div className={`relative flex-1 max-w-3xl min-w-0 ${className}`}>
      <div className="relative">
        {/* Search Icon */}
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 sm:h-5 w-4 sm:w-5 pointer-events-none" />

        {/* Input Field */}
        <Input
          ref={inputRef}
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className={`
            pl-10 pr-12 w-full h-9 sm:h-10 text-xs sm:text-sm
            transition-all duration-200
            ${disabled ? "cursor-not-allowed opacity-50" : ""}
            ${isLoading ? "pr-16" : "pr-12"}
          `}
        />

        {/* Right side icons container */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {/* Loading Spinner */}
          {isLoading && (
            <InlineSpinner
              size="sm"
              color="primary"
              className="flex-shrink-0"
            />
          )}

          {/* Clear Button */}
          {!isLoading && value.trim() && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="
                rounded-full hover:bg-gray-200
                p-1 transition-colors flex-shrink-0
                focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const CompactSearchBar: React.FC<
  Omit<SearchBarProps, "className"> & {
    className?: string;
  }
> = (props) => {
  return (
    <SearchBar {...props} className={`max-w-md ${props.className || ""}`} />
  );
};

export default SearchBar;
