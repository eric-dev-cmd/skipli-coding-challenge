import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GithubIcon,
  LayoutGrid,
  Search,
  Table2,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import LoadingSpinner from "@/components/common/loading/LoadingSpinner";
import SearchBar from "@/components/common/search/SearchBar";
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
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { type GithubUser } from "@/services/githubService";
import { UsersGrid } from "./view/UsersGrid";
import { UsersTable } from "./view/UsersTable";
import {
  InitialSearchState,
  NoResultsState,
} from "@/components/common/EmptyState";

export default function GitHubSearchApp() {
  const navigate = useNavigate();

  const [likedUsers, setLikedUsers] = useState<GithubUser[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const { isAuthenticated } = useAuth();
  const [phoneNumber] = useLocalStorage<string>("phoneNumber", "");
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
      <header className="border-b border-gray-200 sticky top-0 z-[100] shadow-md backdrop-blur-sm bg-white/95">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <GithubIcon />
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 whitespace-nowrap">
                <Link to={ROUTES.HOME}>GitHub Search</Link>
              </h1>
            </div>

            {/* Search Bar */}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search GitHub usernames..."
              isLoading={isLoading}
              autoFocus={true}
              onClear={handleClearSearch}
              className="mx-2 sm:mx-4 md:mx-8"
            />

            <div className="flex-shrink-0">
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => console.log("eric clicked")}
                  className={`
        relative flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2
        rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2
        focus:ring-black transition-all duration-200 cursor-pointer
      `}
                >
                  <User className="h-5 sm:h-6 w-5 sm:w-6 text-gray-700" />
                  <span className="hidden sm:inline text-sm font-medium text-gray-700 truncate max-w-[120px]">
                    {phoneNumber}
                  </span>

                  {likedUsers.length > 0 && (
                    <Badge
                      variant="destructive"
                      className={`
            absolute -top-1.5 -right-1.5 h-4 sm:h-5 w-4 sm:w-5
            rounded-full flex items-center justify-center
            text-[10px] text-xs font-semibold bg-red-700 text-white
            border-2 border-white shadow
          `}
                    >
                      {likedUsers.length}
                    </Badge>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  size="sm"
                  className={`
        px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm
        rounded-full transition-all duration-200 cursor-pointer
      `}
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Icon & Title Section */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-xl"></div>
                  <div className="relative bg-white p-3 rounded-xl border border-blue-100">
                    <Users className="h-7 w-7" />
                  </div>
                </div>

                <div className="flex flex-col">
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight leading-tight">
                    <span className="flex items-center gap-2 flex-wrap">
                      <span className="text-gray-700">Search Results for</span>
                      <span className="text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                        "{searchQuery}"
                      </span>
                    </span>
                  </h1>
                  {hasSearchQuery && (
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <Search className="h-4 w-4" />
                      Discover talented developers and their projects
                    </p>
                  )}
                </div>
              </div>

              {/* Results Badge */}
              {searchUsers && hasResults && (
                <div className="flex items-center gap-2 ml-4">
                  <Badge className="text-sm px-4 py-2 shadow-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {totalResults.toLocaleString()} results found
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Table2 className="h-4 w-4" />
                <span className="hidden sm:inline">Table</span>
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="flex items-center gap-2 cursor-pointer"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Grid</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Per page:</span>
              <Select
                value={resultsPerPage.toString()}
                onValueChange={handleResultsPerPageChange}
              >
                <SelectTrigger className="w-20 bg-white cursor-pointer">
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
            isLoading={isLoading}
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
            isLoading={isLoading}
          />
        )}

        {!isLoading && !isError && hasResults && (
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2">
              <Button
                className="cursor-pointer"
                variant="outline"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || isLoading}
              >
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {/* Show first page */}
                {currentPage > 3 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      className="w-10"
                    >
                      1
                    </Button>
                    {currentPage > 4 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                  </>
                )}

                {/* Show pages around current page */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, currentPage - 2) + i;
                  if (pageNum > totalPages) return null;

                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isLoading}
                      className="w-10 cursor-pointer"
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                {/* Show last page */}
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      className="w-10"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>

              <Button
                className="cursor-pointer"
                variant="outline"
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {!isLoading && !isError && searchUsers && (
          <div className="text-center text-sm text-gray-500 mt-4">
            Page <b className="text-black font-semibold">{currentPage}</b> of{" "}
            <b className="text-black font-semibold">{totalPages}</b>
            {totalResults >= 1000 && " (GitHub API limit: 1000+ results)"}
          </div>
        )}
      </main>
    </div>
  );
}
