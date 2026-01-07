// src/layouts/MainLayout.tsx
import { Outlet } from "react-router";
import { Sidebar } from "../components/shared/Sidebar";
export function MainLayout() {
  return (
    <div className="flex h-screen w-full bg-background-light overflow-hidden">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto relative scroll-smooth p-0">
        {/* The page content goes here */}
        <Outlet />
      </main>
    </div>
  );
}
