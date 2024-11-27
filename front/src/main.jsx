import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
// import "./index.css";
// import App from "./App.jsx";
import ErrorPage from "./pages/ErrorPage/ErrorPage.jsx";
import "./i18n";
// import { Home } from "./pages/Home/Home.jsx";
// import "./styles.css";
import App from "./pages/App/App.jsx";
import { Home } from "./pages/Home/Home.jsx";
import { News } from "./pages/News/News.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import Login from "./pages/Login/Login.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/en/home" replace />, // Redirección al acceder a `/`
  },
  {
    path: "/:lang",
    element: <Navigate to="/en/home" replace />, // Redirección al acceder a `/`
  },
  {
    path: "/:lang",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "news",
        element: <News />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </StrictMode>
);
