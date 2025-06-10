import { Outlet, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { analytics } from "@/lib/analytics";

// Loading component for Suspense fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-700 mx-auto mb-4"></div>
        <p className="text-sage-600 text-lg">Loading your wedding experience...</p>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Track page views
  useEffect(() => {
    const pageName = location.pathname === '/' ? 'home' : location.pathname.slice(1);
    analytics.pageVisited(pageName);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-sage-700 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-sage-500"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>
      
      <Header />
      <Suspense fallback={!isHomePage ? <PageLoader /> : null}>
        <main id="main-content" role="main" className="flex-1">
          <Outlet />
        </main>
      </Suspense>
      <Toaster />
      <Footer />
    </div>
  );
}
