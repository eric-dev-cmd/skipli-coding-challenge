import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { Search, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Mock data matching GitHub API response structure
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
  {
    id: 1024025,
    login: "torvalds",
    avatar_url: "/placeholder.svg?height=64&width=64",
    html_url: "https://github.com/torvalds",
    public_repos: 6,
    followers: 200000,
    isLiked: true,
  },
  {
    id: 810438,
    login: "gaearon",
    avatar_url: "/placeholder.svg?height=64&width=64",
    html_url: "https://github.com/gaearon",
    public_repos: 295,
    followers: 85000,
    isLiked: false,
  },
  {
    id: 170270,
    login: "sindresorhus",
    avatar_url: "/placeholder.svg?height=64&width=64",
    html_url: "https://github.com/sindresorhus",
    public_repos: 1200,
    followers: 45000,
    isLiked: true,
  },
  {
    id: 110953,
    login: "addyosmani",
    avatar_url: "/placeholder.svg?height=64&width=64",
    html_url: "https://github.com/addyosmani",
    public_repos: 156,
    followers: 32000,
    isLiked: false,
  },
  {
    id: 25254,
    login: "tj",
    avatar_url: "/placeholder.svg?height=64&width=64",
    html_url: "https://github.com/tj",
    public_repos: 278,
    followers: 28000,
    isLiked: true,
  },
];

export default function DashboardWidget() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [, setIsProfileModalOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log(`Searching GitHub users: ${query}`);
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
                {/* {likedUsers.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {likedUsers.length}
                  </Badge>
                )} */}
              </Button>
            ) : (
              <Button onClick={() => navigate(ROUTES.LOGIN)} size="sm">
                Login
              </Button>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
