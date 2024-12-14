import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-sage-800 text-ivory-100 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link
              to="/"
              className="text-ivory-100 hover:text-sage-300 transition duration-300"
            >
              Home
            </Link>
            <span className="mx-2">|</span>
            <Link
              to="/registry"
              className="text-ivory-100 hover:text-sage-300 transition duration-300"
            >
              Registry
            </Link>
            <span className="mx-2">|</span>
            <Link
              to="/gallery"
              className="text-ivory-100 hover:text-sage-300 transition duration-300"
            >
              Gallery
            </Link>
            <span className="mx-2">|</span>
            <Link
              to="/contact"
              className="text-ivory-100 hover:text-sage-300 transition duration-300"
            >
              Contact Us
            </Link>
          </div>
          <div className="text-center md:text-right">
            <p>
              Made by{" "}
              <a
                href="https://henrypendleton.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage-300 hover:text-ivory-100 transition duration-300"
              >
                Henry Pendleton
              </a>
            </p>
            <p className="text-sm mt-2">
              © {new Date().getFullYear()} Nobska and Henry. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
