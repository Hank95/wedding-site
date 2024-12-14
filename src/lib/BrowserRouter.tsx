import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import ErrorPage from "../pages/ErrorPage";
import ContactPage from "../pages/ContactPage";
import RegistryPage from "../pages/RegistryPage";

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
    ],
  },
]);

export default BrowserRouter;
