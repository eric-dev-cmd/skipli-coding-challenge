// src/components/modals/ProfileDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  LogOut,
  PhoneIcon,
  Heart,
  GitBranch,
  Users,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/common/button/CopyButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { GithubUser } from "@/services/githubService";

interface ProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  likedUsers: GithubUser[];
  userName?: string;
  onLogout: () => void;
  onUnlike: (userId: number, username: string) => void;
  onViewProfile: (url: string, username: string) => void;
}

const ProfileDialog = ({
  isOpen,
  onClose,
  likedUsers,
  userName,
  onLogout,
  onUnlike,
  onViewProfile,
}: ProfileDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[90vw] md:max-w-[70%] max-h-[90vh] mx-auto p-4 md:p-6 gap-4 overflow-y-auto rounded-lg bg-white shadow-lg">
        <DialogHeader>
          <DialogTitle>My Profile</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="cursor-pointer" value="info">
              Profile Information
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="favorites">
              Favorites ({likedUsers.length})
            </TabsTrigger>
          </TabsList>

          {/* Profile Info */}
          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-auto">
                    <div className="relative bg-white rounded-lg p-5 border-l-2 border-black shadow-md w-full sm:w-auto">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-blue-600 rounded-full flex-shrink-0">
                            <PhoneIcon className="h-5 w-5 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 flex-wrap">
                              Contact Information
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                Verified
                              </span>
                            </h3>
                            <p className="text-gray-600 mt-1 truncate">
                              <span className="font-medium text-gray-900">
                                {userName}
                              </span>
                            </p>
                          </div>
                        </div>
                        <CopyButton textToCopy={userName || ""} />
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={onLogout}
                    className="text-red-700 hover:text-red-800 cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites */}
          <TabsContent value="favorites" className="space-y-4">
            {likedUsers.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <Heart className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No favorites yet
                    </h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      Start exploring GitHub profiles and add them to your
                      favorites by clicking the heart icon.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {likedUsers.map((user) => (
                  <Card
                    key={user.id}
                    className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-gray-100">
                          <AvatarImage
                            src={user.avatar_url}
                            alt={`${user.login}'s avatar`}
                          />
                          <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                            {user.login.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 font-mono mb-2">
                            ID: {user.id}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <GitBranch className="h-3 w-3" />
                              <span>{user.public_repos} repos</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>
                                {user.followers.toLocaleString()} followers
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onUnlike(user.id, user.login)}
                            className="p-2 hover:bg-red-50 group"
                            aria-label={`Remove ${user.login} from favorites`}
                          >
                            <Heart className="h-4 w-4 fill-red-500 text-red-500 group-hover:scale-110 transition-transform" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              onViewProfile(user.html_url, user.login)
                            }
                            className="hover:bg-blue-50 hover:border-blue-300"
                            aria-label={`View ${user.login}'s GitHub profile`}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
