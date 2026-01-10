import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
// Import your components
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
