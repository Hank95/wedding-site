import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

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

  return (
    <header>
      <nav
        className={`fixed top-0 left-0 right-0 bg-white shadow-md transition-transform duration-300 z-50 ${
          isNavVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <img
            src="/placeholder.svg?height=50&width=50"
            alt="Wedding Logo"
            width={50}
            height={50}
          />
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link to="/registry" className="text-gray-600 hover:text-gray-900">
              Registry
            </Link>
            <Link to="/gallery" className="text-gray-600 hover:text-gray-900">
              Gallery
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">
              Contact us
            </Link>
          </div>
          <button className="md:hidden">
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </nav>
    </header>
  );
}
