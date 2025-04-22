"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Check if we're on the homepage
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  useEffect(() => {
    // If not on homepage, show nav immediately
    if (!isHomePage) {
      setIsNavVisible(true);
    } else {
      // On homepage, use scroll behavior
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        if (scrollPosition > 100 && !hasScrolled) {
          setIsNavVisible(true);
          setHasScrolled(true);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [hasScrolled, isHomePage]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <nav
        className={`fixed top-0 left-0 right-0 bg-ivory-100 shadow-md transition-transform duration-300 z-50 ${
          isNavVisible || !isHomePage ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/">
            <img
              src="/NH-Logo.webp"
              alt="Wedding Logo"
              width={75}
              height={75}
            />
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sage-600 hover:text-sage-900">
              Home
            </Link>
            <Link to="/registry" className="text-sage-600 hover:text-sage-900">
              Registry
            </Link>
            <Link
              to="/activities"
              className="text-sage-600 hover:text-sage-900"
            >
              Activities
            </Link>
            <Link to="/gallery" className="text-sage-600 hover:text-sage-900">
              Engagement Gallery
            </Link>
            <Link to="/contact" className="text-sage-600 hover:text-sage-900">
              Contact us
            </Link>
            <Link to="/rsvp">
              <Button className="bg-sage-700 hover:bg-sage-800 text-white font-display px-6 py-2 rounded-md border-2 border-sage-700 hover:border-sage-800 shadow-md transition-all duration-200 transform hover:scale-105 cursor-pointer">
                RSVP
              </Button>
            </Link>
          </div>
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/rsvp">
              <Button className="bg-sage-700 hover:bg-sage-800 text-white font-display px-4 py-1 text-sm rounded-md border-2 border-sage-700 hover:border-sage-800 shadow-sm cursor-pointer transition-all duration-200 transform hover:scale-105">
                RSVP
              </Button>
            </Link>
            <button onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-6 w-6 text-sage-600" />
              ) : (
                <Menu className="h-6 w-6 text-sage-600 cursor-pointer" />
              )}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-ivory-100 py-2">
            <Link
              to="/"
              className="block px-4 py-2 text-sage-600 hover:bg-sage-100"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/activities"
              className="block px-4 py-2 text-sage-600 hover:bg-sage-100"
              onClick={toggleMenu}
            >
              Activities
            </Link>
            <Link
              to="/registry"
              className="block px-4 py-2 text-sage-600 hover:bg-sage-100"
              onClick={toggleMenu}
            >
              Registry
            </Link>
            <Link
              to="/gallery"
              className="block px-4 py-2 text-sage-600 hover:bg-sage-100"
              onClick={toggleMenu}
            >
              Engagement Gallery
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-2 text-sage-600 hover:bg-sage-100"
              onClick={toggleMenu}
            >
              Contact us
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
