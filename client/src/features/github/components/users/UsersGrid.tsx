import type { GitHubUser } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, ExternalLink, GitFork, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface UsersGridProps {
  users: GitHubUser[];
  handleLike: (userId: number) => void;
  currentPage: number;
  resultsPerPage: number;
}

const UsersGrid = ({
  users,
  handleLike,
  currentPage,
  resultsPerPage,
}: UsersGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {users.map((user, index) => {
        const serialNumber = (currentPage - 1) * resultsPerPage + index + 1;

        return (
          <Card
            key={user.id}
            className="
              overflow-hidden 
              border border-gray-200 dark:border-gray-700 
              hover:shadow-md transition-shadow duration-200 
              relative
            "
          >
            <div className="flex items-center gap-3 p-4 sm:p-6 bg-gray-50 dark:bg-gray-800/50">
              <div className="relative flex-shrink-0">
                <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-white dark:border-gray-800 shadow-sm">
                  <AvatarImage
                    src={user.avatar_url || "/placeholder.svg"}
                    alt={user.login}
                  />
                  <AvatarFallback className="text-lg bg-white dark:bg-gray-800">
                    {user.login.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div
                  className="
                  absolute -bottom-1 -right-1 
                  bg-primary text-white text-[10px] sm:text-xs 
                  rounded-full h-5 w-5 sm:h-6 sm:w-6 
                  flex items-center justify-center font-semibold
                "
                >
                  #{serialNumber}
                </div>
              </div>

              {/* Username + ID */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <h3 className="text-base sm:text-lg font-semibold truncate">
                  {user.login}
                </h3>
                <p className="hidden sm:block text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-mono">
                  ID: {user.id}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(user.id)}
                className={cn(
                  "rounded-full h-8 w-8 sm:h-10 sm:w-10 p-0 flex items-center justify-center cursor-pointer",
                  user.isLiked && "bg-red-50 dark:bg-red-900/20"
                )}
              >
                <Heart
                  className={cn(
                    "h-4 w-4 sm:h-5 sm:w-5",
                    user.isLiked
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400 hover:text-red-500"
                  )}
                />
                <span className="sr-only">Like</span>
              </Button>
            </div>

            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                <div className="flex items-center gap-1">
                  <GitFork className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm sm:text-base font-medium">
                    {user.public_repos} repos
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm sm:text-base font-medium">
                    {user.followers.toLocaleString()} followers
                  </span>
                </div>
              </div>

              <div className="mt-1">
                <p className="hidden sm:block text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Profile URL:
                </p>
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 
                    text-sm sm:text-base truncate block hover:underline
                  "
                >
                  {user.html_url}
                </a>
              </div>
            </CardContent>

            <CardFooter className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
              <Button
                className="w-full flex items-center justify-center gap-2 text-sm sm:text-base"
                variant="outline"
                size="sm"
                onClick={() => window.open(user.html_url, "_blank")}
              >
                <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="truncate">View Profile</span>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default UsersGrid;
