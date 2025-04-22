import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Removed the registries array

export default function RegistryPage() {
  useEffect(() => {
    const scriptId = "zola-wjs";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src = "https://widget.zola.com/js/widget.js";
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen bg-ivory-100 py-12 px-4 sm:px-6 lg:px-8 pt-20">
      {/* Adjusted max-width for potentially wider Zola embed */}
      <div className="max-w-4xl mx-auto mt-6">
        {" "}
        {/* Changed max-w-3xl to max-w-4xl */}
        <Link
          to="/"
          className="inline-flex items-center text-sage-600 hover:text-sage-800 mb-8"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-sage-800 mb-8 font-display text-center">
          Our Registry
        </h1>
        {/* Updated paragraph */}
        <p className="text-lg text-sage-700 mb-12 text-center">
          {" "}
          {/* Increased mb */}
          Thank you for thinking of us! You can find our complete wedding
          registry on Zola below.
        </p>
        {/* Removed the grid div and the .map function for other registries */}
        {/* Zola Embed Section - Removed extra top margin/border */}
        <div>
          <a
            className="zola-registry-embed"
            href="https://www.zola.com/wedding/henryandnobska"
            data-registry-key="henryandnobska"
          >
            Our Zola Wedding Registry
          </a>
        </div>
      </div>
    </div>
  );
}
