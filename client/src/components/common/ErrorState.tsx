import { Button } from "../ui/button";

export const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 space-y-4">
    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900">
      {/* Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-red-600 dark:text-red-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
      Failed to load GitHub users
    </h2>
    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md text-center">
      An error occurred while fetching data from the GitHub API. Please check
      your internet connection or try again later.
    </p>
    <Button onClick={onRetry} variant="outline">
      Try Again
    </Button>
  </div>
);
