import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalResults,
  isLoading,
  onPageChange,
}: PaginationProps) {
  const handlePrevious = () => {
    onPageChange(Math.max(1, currentPage - 1));
  };

  const handleNext = () => {
    onPageChange(Math.min(totalPages, currentPage + 1));
  };

  const renderPageNumbers = () => {
    const pages = [];

    if (currentPage > 3) {
      pages.push(
        <Button
          key="first"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          className="w-10"
        >
          1
        </Button>
      );

      if (currentPage > 4) {
        pages.push(
          <span
            key="ellipsis-start"
            className="px-2 text-gray-400 dark:text-gray-500"
          >
            ...
          </span>
        );
      }
    }

    for (let i = 0; i < Math.min(5, totalPages); i++) {
      const pageNum = Math.max(1, currentPage - 2) + i;
      if (pageNum > totalPages) break;

      pages.push(
        <Button
          key={pageNum}
          variant={pageNum === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(pageNum)}
          disabled={isLoading}
          className={`w-10 ${
            pageNum === currentPage
              ? "cursor-default"
              : "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          aria-current={pageNum === currentPage ? "page" : undefined}
        >
          {pageNum}
        </Button>
      );
    }

    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) {
        pages.push(
          <span
            key="ellipsis-end"
            className="px-2 text-gray-400 dark:text-gray-500"
          >
            ...
          </span>
        );
      }

      pages.push(
        <Button
          key="last"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          className="w-10"
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center space-y-3 mt-6 w-full">
      {/* Pagination Controls */}
      <div className="flex flex-wrap justify-center gap-2 w-full sm:flex-nowrap sm:justify-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentPage === 1 || isLoading}
          className="cursor-pointer w-full sm:w-auto"
          aria-label="Previous Page"
        >
          Previous
        </Button>

        <div className="flex flex-wrap justify-center gap-1">
          {renderPageNumbers()}
        </div>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentPage === totalPages || isLoading}
          className="cursor-pointer w-full sm:w-auto"
          aria-label="Next Page"
        >
          Next
        </Button>
      </div>

      {/* Page Info */}
      <div className="text-sm text-gray-500 text-center w-full">
        Page{" "}
        <b className="text-gray-900 dark:text-white font-semibold">
          {currentPage}
        </b>{" "}
        of{" "}
        <b className="text-gray-900 dark:text-white font-semibold">
          {totalPages}
        </b>
        {totalResults >= 1000 && (
          <span className="ml-1">(GitHub API limit: 1000+ results)</span>
        )}
      </div>
    </div>
  );
}
