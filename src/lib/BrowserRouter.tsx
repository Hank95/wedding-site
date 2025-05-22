import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import App from "../App";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home"; // Eagerly load Home to prevent CLS

// Lazy load other page components for code splitting
const ContactPage = lazy(() => import("../pages/ContactPage"));
const RegistryPage = lazy(() => import("../pages/RegistryPage"));
const GalleryPage = lazy(() => import("../pages/GalleryPage"));
const ActivitiesMap = lazy(() => import("@/pages/ActivitiesMap"));
const RSVPForm = lazy(() => import("@/pages/RSVPPage"));

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
