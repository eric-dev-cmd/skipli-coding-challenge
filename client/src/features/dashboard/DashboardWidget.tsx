import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import {
  ExternalLink,
  GitFork,
  Heart,
  Search,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const mockUsers = [
  {
    id: 583231,
    login: "octocat",
    avatar_url: "/placeholder.svg?height=64&width=64",
    html_url: "https://github.com/octocat",
    public_repos: 8,
    followers: 9001,
    isLiked: false,
  },
];
export default function DashboardWidget() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setIsProfileModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const [isLoading, setIsLoading] = useState(false);

  const totalResults = 1000; // GitHub API limitation
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  // Simulate API call for search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      console.log(`Searching GitHub users: ${query}`);
    }, 500);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      console.log(
        `Loading page ${page} with ${resultsPerPage} results per page`
      );
    }, 300);
  };

  const handleResultsPerPageChange = (value: string) => {
    const newPerPage = Number.parseInt(value);
    setResultsPerPage(newPerPage);
    setCurrentPage(1);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      console.log(`Changed to ${newPerPage} results per page`);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">GitHub Search</h1>
            </div>

            <div className="flex-1 max-w-3xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search GitHub usernames..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 w-full h-10"
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            </div>

            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsProfileModalOpen(true)}
                className="relative"
              >
                <User className="h-5 w-5" />
              </Button>
            ) : (
              <Button onClick={() => navigate(ROUTES.LOGIN)} size="sm">
                Login
              </Button>
            )}
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Header with Controls */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery
                ? `Search results for "${searchQuery}"`
                : "GitHub Users"}
            </h2>
            <p className="text-gray-600 mt-1">
              Showing {(currentPage - 1) * resultsPerPage + 1}-
              {Math.min(currentPage * resultsPerPage, totalResults)} of{" "}
              {totalResults} results
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                Table
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Per page:</span>
              <Select
                value={resultsPerPage.toString()}
                onValueChange={handleResultsPerPageChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Display */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        ) : viewMode === "table" ? (
          /* Table View - Shows all required fields clearly */
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6 w-full">
            <div className="w-full overflow-x-auto">
              <Table className="min-w-fit">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[80px] text-left px-4 py-3">
                      ID
                    </TableHead>
                    <TableHead className="w-[160px] text-left px-4 py-3">
                      User
                    </TableHead>
                    <TableHead className="w-[100px] text-left px-4 py-3">
                      Avatar
                    </TableHead>
                    <TableHead className="min-w-[400px] text-left px-4 py-3">
                      Profile URL
                    </TableHead>
                    <TableHead className="w-[100px] text-left px-4 py-3">
                      Repos
                    </TableHead>
                    <TableHead className="w-[120px] text-left px-4 py-3">
                      Followers
                    </TableHead>
                    <TableHead className="w-[120px] text-center px-4 py-3">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        user.isLiked ? "bg-red-50" : ""
                      }`}
                    >
                      <TableCell className="px-4 py-3 font-mono text-sm text-gray-700">
                        {user.id}
                      </TableCell>
                      <TableCell className="px-4 py-3 font-semibold text-gray-900">
                        {user.login}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Avatar className="h-10 w-10 ring-1 ring-gray-200">
                          <AvatarImage
                            src={user.avatar_url || "/placeholder.svg"}
                            alt={user.login}
                          />
                          <AvatarFallback>
                            {user.login.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="px-4 py-3 max-w-[400px] truncate">
                        <a
                          href={user.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          {user.html_url}
                        </a>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-700">
                        {user.public_repos}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-700">
                        {user.followers.toLocaleString()}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => console.log("eric handleLike: ")}
                            className="p-1 hover:bg-gray-100"
                          >
                            <Heart
                              className={`h-5 w-5 ${
                                user.isLiked
                                  ? "fill-red-500 text-red-500"
                                  : "text-gray-400 hover:text-red-500"
                              }`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(user.html_url, "_blank")}
                            className="p-1 hover:bg-gray-100"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          /* Grid View - Card layout with all required fields */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
            {users.map((user) => (
              <Card key={user.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={user.avatar_url || "/placeholder.svg"}
                          alt={user.login}
                        />
                        <AvatarFallback>
                          {user.login.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {user.login}
                        </h3>
                        <p className="text-sm text-gray-500 font-mono">
                          ID: {user.id}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log("eric handleLike")}
                      className="p-2"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          user.isLiked
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400 hover:text-red-500"
                        }`}
                      />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <GitFork className="h-4 w-4" />
                        <span>{user.public_repos} repos</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{user.followers.toLocaleString()} followers</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 break-all">
                      <strong>Profile URL:</strong> {user.html_url}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => window.open(user.html_url, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-2">
          <Button
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
                  className="w-10"
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
            variant="outline"
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages || isLoading}
          >
            Next
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500 mt-4">
          Page {currentPage} of {totalPages} (GitHub API limit: 1000 results)
        </div>
      </main>
    </div>
  );
}
