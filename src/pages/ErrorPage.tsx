import React from "react";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const error = useRouteError();
  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    // error is type `ErrorResponse`
    errorMessage = error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = "Unknown error";
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md px-4 sm:px-6 lg:px-8 text-center">
        <img
          alt="Lost in Space"
          className="mx-auto"
          height="400"
          src="/space_dog.webp"
          style={{
            aspectRatio: "400/400",
            objectFit: "cover",
          }}
          width="400"
        />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mt-8">
          Oops! Lost in Space
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-4">
          The page you're looking for seems to have drifted off into the cosmos.
          Don't worry, we'll help you find your way back home.
        </p>
        <p className="text-gray-600 dark:text-gray-400 mt-4">{errorMessage}</p>
        <Link
          className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-md shadow-sm text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-50 mt-8"
          to="/"
        >
          Take me back to Earth
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
