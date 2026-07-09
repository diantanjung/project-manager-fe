// src/layouts/MainLayout.tsx
import { Outlet } from "react-router";
import { Sidebar } from "../components/shared/Sidebar";

import { PageHeader } from "../components/shared/PageHeader";

export function MainLayout() {
  // Header state removed from uiStore

  return (
    <div className="flex h-screen w-full bg-background-light overflow-hidden">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto relative scroll-smooth p-0">
        <PageHeader />
        {/* The page content goes here */}
        <Outlet />
      </main>
    </div>
  );
}
