import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GithubIcon, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import SearchBar from "@/components/common/search/SearchBar";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { type GithubUser } from "@/services/githubService";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  likedUsers: GithubUser[];
  onClearSearch: () => void;
  onProfileClick: () => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  isLoading,
  likedUsers,
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
              // Giới hạn chiều rộng, để flex co dãn đúng:
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
                  rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black
                  transition-all duration-200 cursor-pointer
                "
              >
                <User className="h-5 sm:h-6 w-5 sm:w-6 text-gray-700" />

                {/* Chỉ hiển thị text phoneNumber từ sm trở lên, và nếu quá dài thì ellipsis */}
                <span className="hidden sm:inline-block text-sm font-medium text-gray-700 truncate max-w-[100px]">
                  {user?.name}
                </span>

                {likedUsers.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="
                      absolute -top-1.5 -right-1.5
                      h-4 sm:h-5 w-4 sm:w-5
                      rounded-full flex items-center justify-center
                      text-[10px] sm:text-xs font-semibold
                      bg-red-700 text-white border-2 border-white shadow
                    "
                  >
                    {likedUsers.length}
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
                  rounded-full transition-all duration-200
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
