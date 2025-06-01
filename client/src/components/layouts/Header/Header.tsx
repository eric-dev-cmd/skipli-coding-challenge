import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GithubIcon, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import SearchBar from "@/components/common/search/SearchBar";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  favoriteCount: number[];
  onClearSearch: () => void;
  onProfileClick: () => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  isLoading,
  favoriteCount,
  onClearSearch,
  onProfileClick,
}: HeaderProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  return (
    <header className="sticky top-0 z-[100] bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-md">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between h-16 gap-2 md:gap-4">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 mr-2">
            <GithubIcon className="h-6 w-6 text-gray-800" />
            <h1 className="ml-1 hidden sm:inline-block text-lg sm:text-xl font-bold text-gray-900 whitespace-nowrap">
              <Link to={ROUTES.HOME}>GitHub Search</Link>
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 min-w-[0] mx-2 sm:mx-4 md:mx-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search GitHub usernames..."
              isLoading={isLoading}
              autoFocus={true}
              onClear={onClearSearch}
              className="w-full max-w-full sm:max-w-lg"
            />
          </div>

          {/* Authentication / Profile */}
          <div className="flex-shrink-0 flex items-center">
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onProfileClick}
                className="
               relative flex items-center gap-1 sm:gap-2
               px-2 sm:px-3 py-1.5 sm:py-2
               rounded-full hover:bg-gray-100 dark:hover:bg-gray-800
               focus:outline-none focus:ring-2 focus:ring-black
               transition-all duration-200 cursor-pointer
             "
              >
                <User className="h-5 sm:h-6 w-5 sm:w-6 text-gray-700 dark:text-gray-200" />
                <span className="hidden sm:inline-block text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-[100px]">
                  {user?.name}
                </span>

                {favoriteCount.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="
                    absolute -top-1.5 -right-1.5
                    h-4 sm:h-5 w-4 sm:w-5
                    flex items-center justify-center
                    rounded-full text-[10px] sm:text-xs font-semibold
                    bg-red-700 text-white border-2 border-white shadow
                    hover:bg-red-800 transition-colors duration-200
                  "
                    title="Number of favorite GitHub users"
                  >
                    {favoriteCount.length}
                  </Badge>
                )}
              </Button>
            ) : (
              <Button
                onClick={() => navigate(ROUTES.LOGIN)}
                size="sm"
                className="
                  text-xs sm:text-sm
                  px-3 sm:px-4 py-1.5 sm:py-2
                  rounded-md transition-all duration-200
                  cursor-pointer
                "
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
