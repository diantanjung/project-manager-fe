import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
// Import your components
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";


function App() {
  // Define the routes
  const router = createBrowserRouter([
    {
      // The Parent Route (Layout)
      path: "/",
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
  ]);
  return (
      <RouterProvider router={router} />
  );
}

export default App;
