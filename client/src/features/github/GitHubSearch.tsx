import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { LayoutGrid, Search, Table2, TrendingUp, Users } from "lucide-react";
import { lazy, Suspense, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import LoadingSpinner from "@/components/common/loading/LoadingSpinner";
import { Pagination } from "@/components/common/pagination";
import {
  InitialSearchState,
  NoResultsState,
} from "@/components/common/states/EmptyState";
import { ErrorState } from "@/components/common/states/ErrorState";
import Header from "@/components/layouts/Header/Header";
import ScrollToTop from "@/components/ui/scroll-to-top";
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
import toast from "react-hot-toast";
import { useFavoriteManager } from "@/hooks/useFavoriteManager";

const ProfileDialog = lazy(() => import("./components/dialogs/ProfileDialog"));
const UsersTable = lazy(() => import("./components/users/UsersTable"));
const UsersGrid = lazy(() => import("./components/users/UsersGrid"));

export default function GitHubSearchApp() {
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  const { isAuthenticated, user, logout } = useAuth();
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

  const { favoriteIds, toggleFavorite, refetchFavorites } = useFavoriteManager(
    user?.id || ""
  );

  // Handle like/unlike with database sync
  const handleLike = async (userId: number) => {
    if (!isAuthenticated) {
      const delaySeconds = 2;
      toast.error(
        `Please log in to like users. You will be redirected in ${delaySeconds} seconds.`,
        { icon: "🔒" }
      );
      setTimeout(() => navigate(ROUTES.LOGIN), delaySeconds * 1000);
      return;
    }

    const userToLike = searchUsers.find((u) => u.id === userId);

    if (!userToLike) return;

    setIsLiking(true);
    try {
      // Call toggleFavorite instead of manual API call
      await toggleFavorite(userId);
      refetchFavorites();
      toast.success(
        `${userToLike.login} has been ${
          favoriteIds.includes(userId) ? "removed from" : "added to"
        } your favorites.`,
        {
          icon: favoriteIds.includes(userId) ? "💔" : "❤️",
          duration: 2000,
        }
      );
    } finally {
      setIsLiking(false);
    }
  };

  const handleViewProfile = (url: string, username: string) => {
    window.open(url, "_blank");
    toast.success(`Opening ${username}'s profile`, {
      icon: "🔗",
      duration: 1500,
    });
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  const handleSuggestionClick = (suggestion: string) => {
    const cleanSuggestion = suggestion.replace(/^Try "/, "").replace(/"$/, "");
    setSearchQuery(cleanSuggestion);
  };

  const handleLogout = () => {
    setSearchQuery("");
    setIsProfileModalOpen(false);
    logout();
  };

  const preparedUsers = useMemo(
    () =>
      searchUsers.map((user) => ({
        ...user,
        isLiked: favoriteIds?.includes(user.id),
      })),
    [searchUsers, favoriteIds]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoading={isLoading}
        favoriteCount={favoriteIds}
        onClearSearch={handleClearSearch}
        onProfileClick={() => setIsProfileModalOpen(true)}
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
                      Search for developers on GitHub
                    </p>
                  )}
                </div>
              </div>

              {searchUsers && hasResults && (
                <div className="flex items-center gap-2">
                  <Badge
                    className={`
        shadow-sm whitespace-nowrap
        text-xs px-3 py-1 sm:text-sm sm:px-4 sm:py-2
      `}
                  >
                    <TrendingUp className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                    {totalResults.toLocaleString()} results found
                  </Badge>
                </div>
              )}
            </div>
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
                <SelectTrigger className="w-16 sm:w-20 bg-white cursor-pointer">
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

        {isLiking && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <LoadingSpinner size="lg" color="primary" />
          </div>
        )}

        {isLoading && (
          <LoadingSpinner
            message="Loading GitHub users..."
            size="lg"
            color="primary"
          />
        )}
        {isError && <ErrorState onRetry={refetch} />}
        {isInitialState && (
          <InitialSearchState onSuggestionClick={handleSuggestionClick} />
        )}
        {isEmpty && (
          <NoResultsState
            searchQuery={debouncedSearchQuery}
            onTryAgain={handleClearSearch}
          />
        )}
        {!isLoading && !isError && !isInitialState && !isEmpty && (
          <Suspense fallback={<LoadingSpinner message="Loading results..." />}>
            {viewMode === "table" ? (
              <UsersTable
                users={preparedUsers}
                handleLike={handleLike}
                currentPage={currentPage}
                resultsPerPage={resultsPerPage}
              />
            ) : (
              <UsersGrid
                users={preparedUsers}
                handleLike={handleLike}
                currentPage={currentPage}
                resultsPerPage={resultsPerPage}
              />
            )}
          </Suspense>
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
      {isProfileModalOpen ? (
        <Suspense fallback={<LoadingSpinner />}>
          {isProfileModalOpen && (
            <ProfileDialog
              isOpen={isProfileModalOpen}
              onClose={() => setIsProfileModalOpen(false)}
              userName={user?.name}
              onLogout={handleLogout}
              onViewProfile={handleViewProfile}
            />
          )}
        </Suspense>
      ) : (
        ""
      )}

      <ScrollToTop />
    </div>
  );
}
