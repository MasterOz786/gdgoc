"use client";

import { useAuth } from "/app/context/AuthContext";  // Importing the useAuth hook
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, LogOut, Camera } from "lucide-react";
import { useRouter } from "next/navigation";

export function UserInfoPanel() {
  const { session, loading, logout } = useAuth();  // Access auth context
  const router = useRouter();

  if (loading) {
    return <div className="flex justify-center items-center min-h-32">Loading...</div>;
  }

  if (!session) {
    return <div className="text-center text-red-500">Failed to load user data.</div>;
  }

  const user = session.user;

  const handleProfileEdit = () => {
    router.push("/profile");
  };

  const handleLogout = async () => {
    await logout();  // Use logout from the context
    router.push("/login");  // Redirect after logout
  };

  const userName = user.user_metadata?.full_name || "Guest User";
  const avatarInitials = userName.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();

  return (
    <Card className="user-info-panel">
      <CardHeader className="user-info-header">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.user_metadata?.avatar_url || undefined} />
              <AvatarFallback className="bg-purple-600 text-xl">
                {avatarInitials}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl">{userName}</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {user.user_metadata?.bio || "No bio provided"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="user-info-content space-y-2">
        <Button
          variant="default"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600 rounded-full"
          onClick={handleProfileEdit}
        >
          <User className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
        <Button
          variant="outline"
          className="w-full rounded-full"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </CardContent>
    </Card>
  );
}
