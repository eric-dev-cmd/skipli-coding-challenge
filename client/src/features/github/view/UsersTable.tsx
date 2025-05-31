import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { GitHubUser } from "@/types";
import { ExternalLink, Heart } from "lucide-react";

interface UsersTableProps {
  users: GitHubUser[];
  handleLike: (userId: number) => void;
  currentPage: number;
  resultsPerPage: number;
}

export function UsersTable({
  users,
  handleLike,
  currentPage,
  resultsPerPage,
}: UsersTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="w-full overflow-x-auto">
        <Table className="w-full min-w-[640px]">
          {/* Table Header */}
          <TableHeader className="bg-gray-50 dark:bg-gray-900">
            <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-900">
              <TableHead className="text-right w-[40px] font-semibold text-xs sm:text-sm">
                #
              </TableHead>

              <TableHead className="text-right w-[100px] font-semibold text-xs sm:text-sm hidden md:table-cell">
                ID
              </TableHead>
              <TableHead className="text-left w-[150px] font-semibold text-xs sm:text-sm">
                Username
              </TableHead>
              <TableHead className="text-center w-[80px] font-semibold text-xs sm:text-sm md:table-cell">
                Avatar
              </TableHead>
              <TableHead className="text-left min-w-[150px] font-semibold text-xs sm:text-sm lg:table-cell">
                Profile URL
              </TableHead>
              <TableHead className="text-right w-[80px] font-semibold text-xs sm:text-sm md:table-cell">
                Repos
              </TableHead>
              <TableHead className="text-right w-[80px] font-semibold text-xs sm:text-sm lg:table-cell">
                Followers
              </TableHead>

              <TableHead className="text-center w-[100px] font-semibold text-xs sm:text-sm">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {users.map((user, index) => {
              const serialNumber =
                (currentPage - 1) * resultsPerPage + index + 1;

              return (
                <TableRow
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700"
                >
                  <TableCell className="text-right font-mono text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                    {serialNumber}
                  </TableCell>

                  <TableCell className="text-right font-mono text-gray-600 dark:text-gray-300 text-xs sm:text-sm hidden md:table-cell">
                    {user.id}
                  </TableCell>

                  {/* Username */}
                  <TableCell className="text-left font-medium text-sm sm:text-base">
                    {user.login}
                  </TableCell>

                  <TableCell className="text-center md:table-cell">
                    <div className="flex justify-center items-center">
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-1 border-gray-200 dark:border-gray-700">
                        <AvatarImage
                          src={user.avatar_url || "/placeholder.svg"}
                          alt={user.login}
                        />
                        <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                          {user.login.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </TableCell>

                  <TableCell className="text-left min-w-auto text-sm sm:text-base truncate block lg:table-cell">
                    <a
                      href={user.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                    >
                      {user.html_url}
                    </a>
                  </TableCell>

                  <TableCell className="text-right font-medium text-sm sm:text-base md:table-cell">
                    {user.public_repos}
                  </TableCell>

                  <TableCell className="text-right font-medium text-sm sm:text-base lg:table-cell">
                    {user.followers.toLocaleString()}
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(user.id)}
                        className={cn(
                          "p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(user.html_url, "_blank")}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      >
                        <ExternalLink className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
                        <span className="sr-only">View Profile</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
