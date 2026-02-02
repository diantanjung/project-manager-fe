import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
// Import your components
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Users } from "./pages/admin/Users";

function App() {
  // Define the routes
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
      // Wrap protected routes with ProtectedRoute
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          // The Parent Route (Layout)
          element: <MainLayout />,
          children: [
            {
              // Index route renders on "/"
              index: true,
              element: <Home />,
            },
            {
              // Renders on "/dashboard" inside the Layout
              path: "dashboard",
              element: <Dashboard />,
            },
            {
              path: "profile",
              element: <Profile />,
            },
            {
              // Admin Users Route
              path: "admin/users",
              element: <ProtectedRoute allowedRoles={["admin"]} />,
              children: [
                {
                  index: true,
                  element: <Users />,
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
