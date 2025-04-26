"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();

    // Subscribe to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error(error.message);
      return;
    }
    router.push("/profile/dashboard");
  };

  const signup = async (email, password) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error(error.message);
      return;
    }
    router.push("/profile/dashboard");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    router.push("/");
  };

  // Google OAuth login
  const googleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error("Google login error:", error.message);
      return;
    }

    // Fetch session again after Google OAuth login
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    
    router.push("/profile/dashboard");
  };

  return (
    <AuthContext.Provider value={{ session, loading, login, signup, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
