import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import NewManhwa from "./pages/NewManhwa"; // 👈 import it

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/signup", element: <Signup /> },
  { path: "/app", element: <Dashboard /> },
  { path: "/stats", element: <Stats /> },
  { path: "/new", element: <NewManhwa /> }, // 👈 add route
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);