import { createBrowserRouter } from "react-router";
import MainSite from "./MainSite";
import AdminPage from "./components/AdminPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainSite,
  },
  {
    path: "/admin",
    Component: AdminPage,
  },
]);
