import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import ErrorPage from "../pages/ErrorPage";
import ContactPage from "../pages/ContactPage";
// import RegistryPage from "../pages/RegistryPage";
import TemporaryRegistryPage from "@/pages/TemporaryRegistryPage";
import GalleryPage from "../pages/GalleryPage";
import ActivitiesMap from "@/pages/ActivitiesMap";

const BrowserRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "registry",
        element: <TemporaryRegistryPage />,
      },
      {
        path: "gallery",
        element: <GalleryPage />,
      },
      { path: "activities", element: <ActivitiesMap /> },
    ],
  },
]);

export default BrowserRouter;
