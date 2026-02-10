import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import "./index.css";
// Import your components
import { MainLayout } from "./layouts/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Users } from "./pages/admin/Users";
import { Teams } from "./pages/admin/Teams";

import { ProjectBoard } from "./pages/ProjectBoard";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <MainLayout />,
          children: [
            {
              path: "/",
              element: <Navigate to="/dashboard" replace />,
            },
            {
              path: "dashboard",
              element: <Dashboard />,
            },
            {
              path: "project/:projectId",
              element: <ProjectBoard />,
            },
            {
              path: "profile",
              element: <Profile />,
            },
            {
              path: "admin/users",
              element: <ProtectedRoute allowedRoles={["admin"]} />,
              children: [
                {
                  index: true,
                  element: <Users />,
                },
              ],
            },
            {
              path: "admin/teams",
              element: <ProtectedRoute allowedRoles={["admin"]} />,
              children: [
                {
                  index: true,
                  element: <Teams />,
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
