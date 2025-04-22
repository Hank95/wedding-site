import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import ErrorPage from "../pages/ErrorPage";
import ContactPage from "../pages/ContactPage";
import RegistryPage from "../pages/RegistryPage";
import GalleryPage from "../pages/GalleryPage";
import ActivitiesMap from "@/pages/ActivitiesMap";
import RSVPForm from "@/pages/RSVPPage";

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
        element: <RegistryPage />,
      },
      {
        path: "gallery",
        element: <GalleryPage />,
      },
      { path: "activities", element: <ActivitiesMap /> },
      {
        path: "rsvp",
        element: <RSVPForm />,
      },
    ],
  },
]);

export default BrowserRouter;
