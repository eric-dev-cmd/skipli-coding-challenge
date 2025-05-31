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
  isLoading: boolean;
}

export function UsersGrid({
  users,
  handleLike,
  currentPage,
  resultsPerPage,
  isLoading,
}: UsersGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user, index) => {
        const serialNumber = (currentPage - 1) * resultsPerPage + index + 1;

        return (
          <Card
            key={user.id}
            className="overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 relative"
          >
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16 border-4 border-white dark:border-gray-800 shadow-sm">
                  <AvatarImage
                    src={user.avatar_url || "/placeholder.svg"}
                    alt={user.login}
                  />
                  <AvatarFallback className="text-lg bg-white dark:bg-gray-800">
                    {user.login.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-primary text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold">
                  #{serialNumber}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold truncate">{user.login}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                  ID: {user.id}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(user.id)}
                className={cn(
                  "rounded-full h-10 w-10 p-0 cursor-pointer",
                  user.isLiked && "bg-red-50 dark:bg-red-900/20"
                )}
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    user.isLiked
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400 hover:text-red-500"
                  )}
                />
                <span className="sr-only">Like</span>
              </Button>
            </div>

            <CardContent className="p-6">
              <div className="flex justify-between mb-4">
                <div className="flex items-center gap-2">
                  <GitFork className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="font-medium">
                    {user.public_repos} public repos
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="font-medium">
                    {user.followers.toLocaleString()} followers
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Profile URL:
                </p>
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm truncate block hover:underline"
                >
                  {user.html_url}
                </a>
              </div>
            </CardContent>

            <CardFooter className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
              <Button
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
                onClick={() => window.open(user.html_url, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
                View Profile
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
