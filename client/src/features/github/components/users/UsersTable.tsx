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
import { useDebouncedAction } from "@/hooks/useDebouncedAction";
import { cn } from "@/lib/utils";
import type { GitHubUser } from "@/types";
import { ExternalLink, Heart } from "lucide-react";

interface UsersTableProps {
  users: GitHubUser[];
  handleLike: (userId: number) => void;
  currentPage: number;
  resultsPerPage: number;
}

const UsersTable = ({
  users,
  handleLike,
  currentPage,
  resultsPerPage,
}: UsersTableProps) => {
  const [disabledLikes, handleLikeDebounced] = useDebouncedAction(2000);

  const handleLikeClick = (userId: number) => {
    handleLikeDebounced(userId, () => handleLike(userId));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="w-full overflow-x-auto">
        <Table className="w-full min-w-[640px]">
          {/* Table Header */}
          <TableHeader className="bg-gray-100">
            <TableRow className="hover:bg-gray-200">
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
                  className={cn(
                    "border-b border-gray-200",
                    "hover:bg-gray-100",
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  )}
                >
                  <TableCell className="text-right font-mono text-gray-600 text-xs sm:text-sm">
                    {serialNumber}
                  </TableCell>
                  <TableCell className="text-right font-mono text-gray-600 text-xs sm:text-sm hidden md:table-cell">
                    {user.id}
                  </TableCell>
                  <TableCell className="text-left font-medium text-gray-900 text-sm sm:text-base">
                    {user.login}
                  </TableCell>
                  <TableCell className="text-center md:table-cell">
                    <div className="flex justify-center items-center">
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-gray-200">
                        <AvatarImage
                          src={user.avatar_url || "/placeholder.svg"}
                          alt={user.login}
                        />
                        <AvatarFallback className="bg-gray-100 text-gray-800">
                          {user.login.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </TableCell>
                  <TableCell className="text-left text-sm sm:text-base truncate block lg:table-cell">
                    <a
                      href={user.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {user.html_url}
                    </a>
                  </TableCell>
                  <TableCell className="text-right font-medium text-gray-700 text-sm sm:text-base md:table-cell">
                    {user.public_repos}
                  </TableCell>
                  <TableCell className="text-right font-medium text-gray-700 text-sm sm:text-base lg:table-cell">
                    {user.followers.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLikeClick(user.id)}
                        disabled={disabledLikes.includes(user.id)}
                        className={cn(
                          "group rounded-full h-8 w-8 sm:h-10 sm:w-10 p-0 flex items-center justify-center cursor-pointer hover:bg-red-200",
                          user.isLiked && "bg-red-50"
                        )}
                      >
                        <Heart
                          className={cn(
                            "h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200",
                            user.isLiked
                              ? "fill-red-600 text-red-600 group-hover:scale-110"
                              : "text-red-400 hover:text-red-600 group-hover:scale-110"
                          )}
                        />
                        <span className="sr-only">Like</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(user.html_url, "_blank")}
                        className="p-1 rounded-full cursor-pointer hover:bg-gray-200"
                      >
                        <ExternalLink className="h-5 w-5 text-gray-500 hover:text-gray-700" />
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
};

export default UsersTable;
