import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import githubService from "@/services/githubService";
import { useDebounce } from "./useDebounce";

interface UseGitHubSearchOptions {
  debounceDelay?: number;
  defaultResultsPerPage?: number;
  staleTime?: number;
  gcTime?: number;
}

interface SearchState {
  searchQuery: string;
  currentPage: number;
  resultsPerPage: number;
  isCleared: boolean;
}

export const useGitHubSearch = (options: UseGitHubSearchOptions = {}) => {
  const {
    debounceDelay = 500,
    defaultResultsPerPage = 10,
    staleTime = 5 * 60 * 1000, // 5 minutes
    gcTime = 10 * 60 * 1000, // 10 minutes
  } = options;

  // Search state
  const [searchState, setSearchState] = useState<SearchState>({
    searchQuery: "",
    currentPage: 1,
    resultsPerPage: defaultResultsPerPage,
    isCleared: false,
  });

  // Debounced search query
  const debouncedSearchQuery = useDebounce(
    searchState.searchQuery,
    debounceDelay
  );

  // Reset page when searching change query
  useEffect(() => {
    if (
      searchState.searchQuery !== debouncedSearchQuery &&
      !searchState.isCleared
    ) {
      setSearchState((prev) => ({
        ...prev,
        currentPage: 1,
      }));
    }
  }, [debouncedSearchQuery, searchState.searchQuery, searchState.isCleared]);

  // React Query
  const queryResult = useQuery({
    queryKey: [
      "github-search",
      debouncedSearchQuery,
      searchState.currentPage,
      searchState.resultsPerPage,
    ],
    queryFn: () =>
      githubService.searchGithubUsers(
        debouncedSearchQuery,
        searchState.currentPage,
        searchState.resultsPerPage
      ),
    enabled: debouncedSearchQuery.length > 0 && !searchState.isCleared,
    staleTime,
    gcTime,
    retry: false,
  });

  // Actions
  const setSearchQuery = useCallback((query: string) => {
    setSearchState((prev) => ({
      ...prev,
      searchQuery: query,
      isCleared: false, // Reset cleared flag khi có search mới
    }));
  }, []);

  const setCurrentPage = useCallback((page: number) => {
    setSearchState((prev) => ({
      ...prev,
      currentPage: page,
    }));
  }, []);

  const setResultsPerPage = useCallback((perPage: number) => {
    setSearchState((prev) => ({
      ...prev,
      resultsPerPage: perPage,
      currentPage: 1, // Reset về trang 1 khi thay đổi results per page
    }));
  }, []);

  const clearSearch = useCallback(() => {
    setSearchState((prev) => ({
      ...prev,
      searchQuery: "",
      currentPage: 1,
      isCleared: true, // Set flag để ngăn query chạy
    }));
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  const handleResultsPerPageChange = useCallback(
    (value: string) => {
      const newPerPage = Number.parseInt(value);
      setResultsPerPage(newPerPage);
    },
    [setResultsPerPage]
  );

  // Processed data
  const users = (queryResult.data?.users || []).map((u) => ({
    ...u,
  }));

  const totalResults = queryResult.data?.pagination?.total_count || 0;
  const totalPages = queryResult.data?.pagination?.total_pages || 1;

  // Computed states
  const hasSearchQuery = debouncedSearchQuery.length > 0;
  const hasResults = users.length > 0;
  const isEmpty =
    hasSearchQuery &&
    !hasResults &&
    !queryResult.isLoading &&
    !queryResult.isError;
  const isInitialState = !hasSearchQuery && !queryResult.isLoading;

  return {
    // State
    searchQuery: searchState.searchQuery,
    debouncedSearchQuery,
    currentPage: searchState.currentPage,
    resultsPerPage: searchState.resultsPerPage,

    // Data
    users,
    totalResults,
    totalPages,

    // Loading states
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    isFetching: queryResult.isFetching,

    // Computed states
    hasSearchQuery,
    hasResults,
    isEmpty,
    isInitialState,

    // Actions
    setSearchQuery,
    setCurrentPage,
    setResultsPerPage,
    clearSearch,
    handlePageChange,
    handleResultsPerPageChange,
    refetch: queryResult.refetch,
    // Raw query result for advanced usage
    queryResult,
  };
};
