import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "@/components/ui/sonner";

// Loading component for Suspense fallback
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-700"></div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      <Toaster />
      <Footer />
    </>
  );
}
