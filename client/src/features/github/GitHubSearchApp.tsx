import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Search, Table2, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  InitialSearchState,
  NoResultsState,
} from "@/components/common/EmptyState";
import LoadingSpinner from "@/components/common/loading/LoadingSpinner";
import Header from "@/components/layouts/Header/Header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { useGitHubSearch } from "@/hooks/useGitHubSearch";
import { type GithubUser } from "@/services/githubService";
import { UsersGrid } from "./view/UsersGrid";
import { UsersTable } from "./view/UsersTable";
import { Pagination } from "@/components/common/pagination";
import ScrollToTop from "@/components/ui/scroll-to-top";

export default function GitHubSearchApp() {
  const navigate = useNavigate();

  const [likedUsers, setLikedUsers] = useState<GithubUser[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const { isAuthenticated } = useAuth();
  const {
    searchQuery,
    debouncedSearchQuery,
    currentPage,
    resultsPerPage,

    users: searchUsers,
    totalResults,
    totalPages,

    isLoading,
    isError,

    // Computed states
    hasSearchQuery,
    hasResults,
    isEmpty,
    isInitialState,

    setSearchQuery,
    clearSearch,
    handlePageChange,
    handleResultsPerPageChange,
    refetch,
  } = useGitHubSearch({
    debounceDelay: 500,
    defaultResultsPerPage: 10,
  });

  // Handle like/unlike with database sync
  const handleLike = async (userId: number) => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    const user = searchUsers.find((u) => u.id === userId);
    if (!user) return;

    try {
      if (user.isLiked) {
        // Unlike
        setLikedUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        // Like
        const userToLike: GithubUser = {
          id: user.id,
          login: user.login,
          avatar_url: user.avatar_url,
          html_url: user.html_url,
          public_repos: user.public_repos,
          followers: user.followers,
        };
        setLikedUsers((prev) => [...prev, userToLike]);
      }

      // await likeGithubUser(currentUser.phoneNumber, userId);
      console.log(`${user.isLiked ? "Unliked" : "Liked"} user ${userId}`);
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  const handleSuggestionClick = (suggestion: string) => {
    const cleanSuggestion = suggestion.replace(/^Try "/, "").replace(/"$/, "");
    setSearchQuery(cleanSuggestion);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoading={isLoading}
        likedUsers={likedUsers}
        onClearSearch={handleClearSearch}
      />

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          {/* Left side: Icon + Title + Subtitle + Badge */}
          <div className="flex flex-col w-full sm:w-auto gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* Icon & Title Section */}
              <div className="flex items-start sm:items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-xl"></div>
                  <div className="relative bg-white p-3 rounded-xl border border-blue-100">
                    <Users className="h-6 w-6 sm:h-7 sm:w-7 text-black" />
                  </div>
                </div>

                <div className="flex flex-col">
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight leading-tight">
                    <span className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      <span className="text-gray-800">Search Results for</span>
                      <span className="text-blue-700 bg-blue-50 px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg border border-blue-200 text-sm sm:text-base">
                        "{searchQuery}"
                      </span>
                    </span>
                  </h1>

                  {hasSearchQuery && (
                    <p className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 mt-1">
                      <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                      Discover talented developers and their projects
                    </p>
                  )}
                </div>
              </div>

              {searchUsers && hasResults && (
                <div className="flex sm:hidden items-center gap-2">
                  <Badge className="text-xs px-3 py-1 shadow-sm whitespace-nowrap">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {totalResults.toLocaleString()} results found
                  </Badge>
                </div>
              )}
            </div>

            {/* Badge on larger screens */}
            {searchUsers && hasResults && (
              <div className="hidden sm:flex items-center gap-2">
                <Badge className="text-sm px-4 py-2 shadow-sm whitespace-nowrap">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {totalResults.toLocaleString()} results found
                </Badge>
              </div>
            )}
          </div>

          {/* Right side: View Mode + Per-page selector */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="flex items-center gap-1 sm:gap-2 cursor-pointer"
              >
                <Table2 className="h-4 w-4" />
                <span className="hidden sm:inline">Table</span>
              </Button>

              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="flex items-center gap-1 sm:gap-2 cursor-pointer"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Grid</span>
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <span className="hidden sm:inline-block text-sm text-gray-500">
                Per page:
              </span>

              <Select
                value={resultsPerPage.toString()}
                onValueChange={handleResultsPerPageChange}
              >
                <SelectTrigger className="w-auto bg-white cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5" className="cursor-pointer">
                    5
                  </SelectItem>
                  <SelectItem value="10" className="cursor-pointer">
                    10
                  </SelectItem>
                  <SelectItem value="20" className="cursor-pointer">
                    20
                  </SelectItem>
                  <SelectItem value="50" className="cursor-pointer">
                    50
                  </SelectItem>
                  <SelectItem value="100" className="cursor-pointer">
                    100
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner
            message="Loading GitHub users..."
            size="lg"
            color="primary"
          />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900">
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
              An error occurred while fetching data from the GitHub API. Please
              check your internet connection or try again later.
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        ) : isInitialState ? (
          <InitialSearchState onSuggestionClick={handleSuggestionClick} />
        ) : isEmpty ? (
          <NoResultsState
            searchQuery={debouncedSearchQuery}
            onTryAgain={handleClearSearch}
          />
        ) : viewMode === "table" ? (
          <UsersTable
            users={searchUsers.map((user) => ({
              ...user,
              isLiked: user.isLiked ?? false,
            }))}
            handleLike={handleLike}
            currentPage={currentPage}
            resultsPerPage={resultsPerPage}
          />
        ) : (
          <UsersGrid
            users={searchUsers.map((user) => ({
              ...user,
              isLiked: user.isLiked ?? false,
            }))}
            handleLike={handleLike}
            currentPage={currentPage}
            resultsPerPage={resultsPerPage}
          />
        )}

        {!isLoading && !isError && hasResults && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={totalResults}
            isLoading={isLoading}
            onPageChange={handlePageChange}
          />
        )}
      </main>
      <ScrollToTop />
    </div>
  );
}
