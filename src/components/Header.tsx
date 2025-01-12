import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100 && !hasScrolled) {
        setIsNavVisible(true);
        setHasScrolled(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolled]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <nav
        className={`fixed top-0 left-0 right-0 bg-ivory-100 shadow-md transition-transform duration-300 z-50 ${
          isNavVisible ? "translate-y-0" : "-translate-y-full"
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
          <div className="hidden md:flex space-x-4">
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
          </div>
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="h-6 w-6 text-sage-600" />
            ) : (
              <Menu className="h-6 w-6 text-sage-600" />
            )}
          </button>
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
              Gallery
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
