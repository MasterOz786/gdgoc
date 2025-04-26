"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { UserInfoPanel } from "@/components/features/user-portal/user-info-panel";
import { DashboardWidgets } from "@/components/features/user-portal/dashboard-widgets";
import { SettingsPanel } from "@/components/features/user-portal/settings-panel";
import "@/styles/dashboard.css";
import { useAuth } from '/app/context/AuthContext';
import { useRouter } from "next/navigation";

export default function DashboardPage() {  
  const { session } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
    setMounted(true);
    document.body.classList.add("dark"); // Enforce dark mode
    return () => {
      document.body.classList.add("dark"); // Ensure dark mode is not removed
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <Navbar />
      </header>
      <main className="dashboard-main">
        <div className="dashboard-content">
          <aside className="dashboard-sidebar">
            <UserInfoPanel />
            <SettingsPanel />
          </aside>
          <section className="dashboard-main-content">
            <DashboardWidgets />
          </section>
        </div>
      </main>
    </div>
  );
}
