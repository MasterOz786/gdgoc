"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase/client"; // Assuming the Supabase client is correctly set up
import { useAuth } from "/app/context/AuthContext"; // Importing the useAuth hook

export default function ProfilePage() {
  const { session, loading: authLoading, logout } = useAuth(); // Using useAuth to get session data
  const router = useRouter();
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  // If no session exists (user is not logged in)
  if (!session) {
    router.push("/login"); // Redirect to login if no session
    return null;
  }

  const user = {
    name: session.user?.user_metadata?.full_name || "John Doe",
    email: session.user?.email || "john@example.com",
    avatarUrl: session.user?.user_metadata?.avatar_url || null,
    bio: session.user?.user_metadata?.bio || "AI Communication Enthusiast",
  };

  // Handle file input for avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  // Update profile function
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // If there's a new avatar, upload it to Supabase Storage
    let avatarUrl = user.avatarUrl;
    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${user.email}_avatar.${fileExt}`;
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatarFile);

      if (error) {
        console.error("Error uploading avatar:", error.message);
        setLoading(false);
        return;
      }

      // Get the public URL of the uploaded image
      avatarUrl = data?.path ? supabase.storage.from("avatars").getPublicUrl(data.path).publicURL : null;
    }

    // Update the user profile in Supabase
    const { error: updateError } = await supabase
      .from("profiles")
      .upsert({ email: user.email, name: user.name, bio: user.bio, avatar_url: avatarUrl });

    if (updateError) {
      console.error("Error updating profile:", updateError.message);
    } else {
      console.log("Profile updated:", user);
      router.push("/profile/dashboard");
    }

    setLoading(false);
  };

  const handleCancel = () => {
    router.push("/profile/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Button
            variant="ghost"
            className="mr-4"
            onClick={handleCancel}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl font-semibold">Edit Profile</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback className="bg-purple-600 text-2xl">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click to change your profile picture
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Bio
                  </label>
                  <Textarea
                    id="bio"
                    value={user.bio}
                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                    className="w-full"
                    rows={4}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
